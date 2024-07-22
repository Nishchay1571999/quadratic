use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::{grid::Sheet, selection::Selection, CellValue};

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, TS)]
pub enum ValidationListSource {
    Selection(Selection),
    List(Vec<String>),
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, TS)]
pub struct ValidationList {
    pub source: ValidationListSource,
    pub ignore_blank: bool,
    pub drop_down: bool,
}

impl ValidationList {
    /// Compares all CellValues within a Selection to the provided CellValue.
    fn validate_selection(sheet: &Sheet, selection: &Selection, value: &CellValue) -> bool {
        if let Some(values) = sheet.selection(selection, None, false) {
            values.iter().any(|(_, search)| *search == value)
        } else {
            false
        }
    }

    /// Validates a CellValue against a ValidationList.
    pub(crate) fn validate(sheet: &Sheet, list: &ValidationList, value: &CellValue) -> bool {
        match &list.source {
            ValidationListSource::Selection(selection) => {
                ValidationList::validate_selection(sheet, selection, value)
            }
            ValidationListSource::List(list) => list.contains(&value.to_string()),
        }
    }

    /// Gets the drop down list.
    pub fn to_drop_down(sheet: &Sheet, list: &ValidationList) -> Option<Vec<String>> {
        if !list.drop_down {
            return None;
        }
        match &list.source {
            ValidationListSource::Selection(selection) => {
                let Some(values) = sheet.selection(selection, None, false) else {
                    return None;
                };
                Some(values.iter().map(|(_, value)| value.to_string()).collect())
            }
            ValidationListSource::List(list) => Some(list.clone()),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn validate_list_strings() {
        let sheet = Sheet::test();
        let list = ValidationList {
            source: ValidationListSource::List(vec!["test".to_string()]),
            ignore_blank: true,
            drop_down: true,
        };

        assert!(ValidationList::validate(
            &sheet,
            &list,
            &CellValue::Text("test".to_string())
        ));
        assert!(!ValidationList::validate(
            &sheet,
            &list,
            &CellValue::Text("test2".to_string())
        ));
    }

    #[test]
    fn validate_list_selection() {
        let mut sheet = Sheet::test();
        sheet.set_cell_value((0, 0).into(), "test");
        let selection = Selection::pos(0, 0, sheet.id);

        assert!(ValidationList::validate_selection(
            &sheet,
            &selection,
            &CellValue::Text("test".to_string())
        ));

        assert!(!ValidationList::validate_selection(
            &sheet,
            &selection,
            &CellValue::Text("test2".to_string())
        ));
    }

    #[test]
    fn to_drop_down_strings() {
        let sheet = Sheet::test();
        let list = ValidationList {
            source: ValidationListSource::List(vec!["test".to_string()]),
            ignore_blank: true,
            drop_down: true,
        };

        assert_eq!(
            ValidationList::to_drop_down(&sheet, &list),
            Some(vec!["test".to_string()])
        );

        let list = ValidationList {
            source: ValidationListSource::List(vec!["test".to_string(), "test2".to_string()]),
            ignore_blank: true,
            drop_down: false,
        };
        assert_eq!(ValidationList::to_drop_down(&sheet, &list), None)
    }
}
