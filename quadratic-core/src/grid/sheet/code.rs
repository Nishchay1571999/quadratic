use itertools::Itertools;

use super::Sheet;
use crate::{
    grid::{CodeCellValue, RenderSize},
    CellValue, Pos, Rect, SheetPos, SheetRect,
};

impl Sheet {
    /// Sets or deletes a code cell value.
    pub fn set_code_cell(
        &mut self,
        pos: Pos,
        code_cell: Option<CodeCellValue>,
    ) -> Option<CodeCellValue> {
        // todo: probably a more rust-y way to do this
        let old = self
            .code_cells
            .iter()
            .find_map(|(code_cell_pos, code_cell_value)| {
                if *code_cell_pos == pos {
                    Some(code_cell_value)
                } else {
                    None
                }
            })
            .cloned();
        if old.is_some() {
            self.code_cells
                .retain(|(code_cell_pos, _)| *code_cell_pos != pos);
        }
        if let Some(code_cell) = code_cell {
            self.code_cells.push((pos, code_cell));
        }
        // }
        old
    }

    /// Returns a code cell value.
    pub fn get_code_cell(&self, pos: Pos) -> Option<&CodeCellValue> {
        self.code_cells
            .iter()
            .find_map(|(code_cell_pos, code_cell_value)| {
                if *code_cell_pos == pos {
                    Some(code_cell_value)
                } else {
                    None
                }
            })
    }

    pub fn get_code_cell_value(&self, pos: Pos) -> Option<CellValue> {
        self.code_cells
            .iter()
            .find_map(|(code_cell_pos, code_cell_value)| {
                let output_rect = code_cell_value.output_rect(*code_cell_pos);
                if output_rect.contains(pos) {
                    code_cell_value.get_output_value(
                        (pos.x - code_cell_pos.x) as u32,
                        (pos.y - code_cell_pos.y) as u32,
                    )
                } else {
                    None
                }
            })
    }

    pub fn iter_code_output_in_rect(
        &self,
        rect: Rect,
    ) -> impl Iterator<Item = (Rect, &CodeCellValue)> {
        self.code_cells
            .iter()
            .filter_map(move |(pos, code_cell_value)| {
                let output_rect = code_cell_value.output_rect(*pos);
                output_rect
                    .intersects(rect)
                    .then(|| (output_rect, code_cell_value))
            })
    }

    /// returns the render-size for a html-like cell
    pub fn render_size(&self, pos: Pos) -> Option<RenderSize> {
        let column = self.get_column(pos.x)?;
        column.render_size.get(pos.y)
    }

    /// Checks if the deletion of a cell or a code_cell released a spill error;
    /// sorted by earliest last_modified.
    /// Returns the Pos and the code_cell_value if it did
    pub fn spill_error_released(
        &self,
        sheet_rect: &SheetRect,
    ) -> Option<(SheetPos, CodeCellValue)> {
        let sheet_id = sheet_rect.sheet_id;
        self.code_cells
            .iter()
            .filter(|(_, code_cell)| code_cell.has_spill_error())
            .sorted_by_key(|a| &a.1.last_modified)
            .filter_map(|(code_cell_pos, code_cell)| {
                // only check code_cells with spill errors
                if !code_cell.has_spill_error() {
                    return None;
                }
                let output_size = code_cell.output_size();
                // cannot spill if only 1x1
                if output_size.len() == 1 {
                    return None;
                }
                sheet_rect
                    .intersects(SheetRect::from_sheet_pos_and_size(
                        code_cell_pos.to_sheet_pos(sheet_id),
                        output_size,
                    ))
                    .then(|| (code_cell_pos.to_sheet_pos(sheet_id), code_cell.to_owned()))
            })
            .next()
    }
}

#[cfg(test)]
mod test {
    use bigdecimal::BigDecimal;

    use super::*;
    use crate::{
        controller::GridController,
        grid::{CodeCellLanguage, RenderSize},
        Value,
    };

    #[test]
    fn test_render_size() {
        use crate::Pos;

        let mut gc = GridController::new();
        let sheet_id = gc.sheet_ids()[0];
        gc.set_cell_render_size(
            SheetPos {
                x: 0,
                y: 0,
                sheet_id,
            }
            .into(),
            Some(crate::grid::RenderSize {
                w: "10".to_string(),
                h: "20".to_string(),
            }),
            None,
        );

        let sheet = gc.sheet(sheet_id);
        assert_eq!(
            sheet.render_size(Pos { x: 0, y: 0 }),
            Some(RenderSize {
                w: "10".to_string(),
                h: "20".to_string()
            })
        );
        assert_eq!(sheet.render_size(Pos { x: 1, y: 1 }), None);
    }

    #[test]
    fn test_set_code_cell_value() {
        let mut gc = GridController::new();
        let sheet_id = gc.sheet_ids()[0];
        let sheet = gc.grid_mut().try_sheet_mut_from_id(sheet_id).unwrap();
        let code_cell_value = CodeCellValue {
            language: CodeCellLanguage::Formula,
            code_string: "1".to_string(),
            formatted_code_string: None,
            output: None,
            last_modified: "".to_string(),
        };
        let old = sheet.set_code_cell(Pos { x: 0, y: 0 }, Some(code_cell_value.clone()));
        assert_eq!(
            sheet.get_code_cell(Pos { x: 0, y: 0 }),
            Some(&code_cell_value)
        );
        assert_eq!(old, None);
        let old = sheet.set_code_cell(Pos { x: 0, y: 0 }, None);
        assert_eq!(old, Some(code_cell_value));
        assert_eq!(sheet.get_code_cell(Pos { x: 0, y: 0 }), None);
    }

    #[test]
    fn test_get_code_cell_value() {
        let mut gc = GridController::new();
        let sheet_id = gc.sheet_ids()[0];
        let sheet = gc.grid_mut().try_sheet_mut_from_id(sheet_id).unwrap();
        let code_cell_value = CodeCellValue {
            language: CodeCellLanguage::Formula,
            code_string: "1 + 1".to_string(),
            formatted_code_string: None,
            output: Some(crate::grid::CodeCellRunOutput {
                std_out: None,
                std_err: None,
                result: crate::grid::CodeCellRunResult::Ok {
                    output_value: Value::Single(CellValue::Number(BigDecimal::from(2))),
                    cells_accessed: std::collections::HashSet::new(),
                },
                spill: false,
            }),
            last_modified: "".to_string(),
        };
        sheet.set_code_cell(Pos { x: 0, y: 0 }, Some(code_cell_value.clone()));
        assert_eq!(
            sheet.get_code_cell_value(Pos { x: 0, y: 0 }),
            Some(CellValue::Number(BigDecimal::from(2)))
        );
        assert_eq!(sheet.get_code_cell_value(Pos { x: 1, y: 1 }), None);
    }
}
