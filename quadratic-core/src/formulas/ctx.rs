use std::collections::HashSet;

use smallvec::{smallvec, SmallVec};

use super::*;
use crate::{
    grid::Grid, Array, CellValue, CodeResult, CodeResultExt, RunErrorMsg, SheetPos, SheetRect,
    Span, Spanned, Value,
};

/// Formula execution context.
pub struct Ctx<'ctx> {
    /// Grid file to access cells from.
    pub grid: &'ctx Grid,
    /// Position in the grid from which the formula is being evaluated.
    pub sheet_pos: SheetPos,
    /// Cells that have been accessed in evaluating the formula.
    pub cells_accessed: HashSet<SheetRect>,
}
impl<'ctx> Ctx<'ctx> {
    /// Constructs a context for evaluating a formula at `pos` in `grid`.
    pub fn new(grid: &'ctx Grid, sheet_pos: SheetPos) -> Self {
        Ctx {
            grid,
            sheet_pos,
            cells_accessed: HashSet::new(),
        }
    }

    /// Resolves a cell reference relative to `self.sheet_pos`.
    pub fn resolve_ref(&self, ref_pos: &CellRef, span: Span) -> CodeResult<Spanned<SheetPos>> {
        let sheet = match &ref_pos.sheet {
            Some(sheet_name) => self
                .grid
                .try_sheet_from_name(sheet_name.clone())
                .ok_or(RunErrorMsg::BadCellReference.with_span(span))?,
            None => self
                .grid
                .try_sheet(self.sheet_pos.sheet_id)
                .ok_or(RunErrorMsg::BadCellReference.with_span(span))?,
        };
        let ref_pos = ref_pos.resolve_from(self.sheet_pos.into());
        Ok(ref_pos.to_sheet_pos(sheet.id)).with_span(span)
    }
    /// Resolves a cell range reference relative to `self.sheet_pos`.
    pub fn resolve_range_ref(
        &self,
        range: &RangeRef,
        span: Span,
    ) -> CodeResult<Spanned<SheetRect>> {
        match range {
            RangeRef::RowRange { .. } => {
                Err(RunErrorMsg::Unimplemented("row range".into()).with_span(span))
            }
            RangeRef::ColRange { .. } => {
                Err(RunErrorMsg::Unimplemented("column range".into()).with_span(span))
            }
            RangeRef::CellRange { start, end } => {
                let sheet_pos_start = self.resolve_ref(start, span)?.inner;
                let sheet_pos_end = self.resolve_ref(end, span)?.inner;
                Ok(SheetRect::new_pos_span(
                    sheet_pos_start.into(),
                    sheet_pos_end.into(),
                    sheet_pos_start.sheet_id,
                ))
                .with_span(span)
            }
            RangeRef::Cell { pos } => {
                let sheet_pos = self.resolve_ref(pos, span)?.inner;
                Ok(SheetRect::single_sheet_pos(sheet_pos)).with_span(span)
            }
        }
    }

    /// Fetches the contents of the cell at `ref_pos` evaluated at
    /// `self.sheet_pos`, or returns an error in the case of a circular
    /// reference.
    pub fn get_cell(&mut self, sheet_pos: SheetPos, span: Span) -> CodeResult<Spanned<CellValue>> {
        if sheet_pos == self.sheet_pos {
            return Err(RunErrorMsg::CircularReference.with_span(span));
        }

        self.cells_accessed.insert(sheet_pos.into());

        let sheet = self
            .grid
            .try_sheet(sheet_pos.sheet_id)
            .ok_or(RunErrorMsg::BadCellReference.with_span(span))?;
        let value = sheet
            .display_value(sheet_pos.into())
            .unwrap_or(CellValue::Blank);
        Ok(value).with_span(span)
    }

    pub fn get_cell_array(
        &mut self,
        sheet_rect: SheetRect,
        span: Span,
    ) -> CodeResult<Spanned<Array>> {
        let sheet_id = sheet_rect.sheet_id;
        let array_size = sheet_rect.size();
        if std::cmp::max(array_size.w, array_size.h).get() > crate::limits::CELL_RANGE_LIMIT {
            return Err(RunErrorMsg::ArrayTooBig.with_span(span));
        }

        let mut flat_array = smallvec![];
        // Reuse the same `CellRef` object so that we don't have to
        // clone `sheet_name.`
        for y in sheet_rect.y_range() {
            for x in sheet_rect.x_range() {
                // TODO: record array dependency instead of many individual cell dependencies
                flat_array.push(self.get_cell(SheetPos { x, y, sheet_id }, span)?.inner);
            }
        }

        Ok(Array::new_row_major(array_size, flat_array)?).with_span(span)
    }

    /// Evaluates a function once for each corresponding set of values from
    /// `arrays`.
    ///
    /// Many functions, including basic operators such as `+`, work on arrays by
    /// zipping the arrays and then mapping the function across corresponding
    /// sets of inputs. For example `{1,2,3} + {10,20,30}` results in
    /// `{11,22,33}`. If any argument is not an array, it is expanded into an
    /// array with the same size as other arguments. This also works
    /// 2-dimensionally: if one argument is a 1x3 array and the other argument
    /// is a 3x1 array, then both arguments are first expanded to 3x3 arrays. If
    /// arrays cannot be expanded like this, then an error is returned.
    pub fn zip_map<'a, I: Copy + IntoIterator<Item = &'a Spanned<Value>>>(
        &mut self,
        arrays: I,
        f: impl for<'b> Fn(&'b mut Ctx<'_>, &[Spanned<&CellValue>]) -> CodeResult<CellValue>,
    ) -> CodeResult<Value>
    where
        I::IntoIter: ExactSizeIterator,
    {
        let size = Value::common_array_size(arrays)?;

        let mut args_buffer = Vec::with_capacity(arrays.into_iter().len());

        // If the result is a single value, return that value instead of a 1x1
        // array. This isn't just an optimization; it's important for Excel
        // compatibility.
        if size.len() == 1 {
            for array in arrays {
                args_buffer.push(array.cell_value()?);
            }
            return Ok(Value::Single(f(self, &args_buffer)?));
        }

        let mut values = SmallVec::with_capacity(size.len());
        for (x, y) in size.iter() {
            args_buffer.clear();
            for array in arrays {
                args_buffer.push(array.get(x, y)?);
            }

            values.push(f(self, &args_buffer)?);
        }

        let result = Array::new_row_major(size, values)?;
        Ok(Value::Array(result))
    }
}
