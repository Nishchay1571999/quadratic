use super::{Grid, Sheet, SheetId};
use lexicon_fractional_index::key_between;
use std::str::FromStr;

impl Grid {
    pub fn sheets(&self) -> &[Sheet] {
        &self.sheets
    }

    pub fn first_sheet_id(&self) -> SheetId {
        if self.sheets.is_empty() {
            unreachable!("grid should always have at least one sheet");
        }
        self.sheets[0].id
    }

    pub fn first_sheet(&self) -> &Sheet {
        let id = self.first_sheet_id();
        self.try_sheet(id)
            .expect("there should always be a first sheet in the grid")
    }

    pub fn first_sheet_mut(&mut self) -> &mut Sheet {
        let id = self.first_sheet_id();
        self.try_sheet_mut(id)
            .expect("there should always be a first sheet in the grid")
    }

    pub fn sheet_ids(&self) -> Vec<SheetId> {
        self.sheets.iter().map(|sheet| sheet.id).collect()
    }

    pub fn try_sheet_from_name(&self, name: String) -> Option<&Sheet> {
        self.sheets.iter().find(|sheet| sheet.name == name)
    }

    pub fn try_sheet_mut_from_name(&mut self, name: String) -> Option<&mut Sheet> {
        self.sheets.iter_mut().find(|sheet| sheet.name == name)
    }

    pub fn try_sheet_from_string_id(&self, id: String) -> Option<&Sheet> {
        SheetId::from_str(&id).map_or(None, |sheet_id| self.try_sheet(sheet_id))
    }

    pub fn try_sheet_mut_from_string_id(&mut self, id: String) -> Option<&mut Sheet> {
        SheetId::from_str(&id).map_or(None, |sheet_id| self.try_sheet_mut(sheet_id))
    }

    pub fn sort_sheets(&mut self) {
        self.sheets.sort_by(|a, b| a.order.cmp(&b.order));
    }

    pub fn end_order(&self) -> String {
        let last_order = self.sheets.last().map(|last| last.order.clone());
        key_between(&last_order, &None).unwrap()
    }

    /// Find the order of the sheet before the given id
    pub fn previous_sheet_order(&self, sheet_id: SheetId) -> Option<String> {
        let mut previous: Option<&Sheet> = None;
        for sheet in self.sheets.iter() {
            if sheet.id == sheet_id {
                return previous.map(|previous| previous.order.clone());
            }
            previous = Some(sheet);
        }
        None
    }

    pub fn next_sheet(&self, sheet_id: SheetId) -> Option<&Sheet> {
        let mut next = false;
        for sheet in self.sheets.iter() {
            if next {
                return Some(sheet);
            }
            if sheet.id == sheet_id {
                next = true;
            };
        }
        None
    }

    /// Adds a sheet to the grid. Returns an error if the sheet name is already
    /// in use.
    ///
    /// If `sheet` is `None`, a new sheet is created with a random ID and
    /// autogenerated name.
    ///
    /// Adds a suffix if the sheet already exists.
    pub fn add_sheet(&mut self, sheet: Option<Sheet>) -> SheetId {
        // for new sheets, order is after the last one
        let mut sheet = sheet.unwrap_or_else(|| {
            Sheet::new(
                SheetId::new(),
                format!("Sheet {}", self.sheets.len() + 1),
                self.end_order(),
            )
        });

        // add a suffix if a duplicate name is detected. This will protect against two users creating sheets with the same name in multiplayer.
        let id = sheet.id;
        let mut index = 1;
        loop {
            if self
                .sheets
                .iter()
                .any(|old_sheet| old_sheet.name == sheet.name)
            {
                sheet.name = format!("{} ({})", sheet.name, index);
                index += 1;
            } else {
                break;
            }
        }
        self.sheets.push(sheet);
        self.sort_sheets();
        id
    }

    pub fn remove_sheet(&mut self, sheet_id: SheetId) -> Option<Sheet> {
        let i = self.sheet_id_to_index(sheet_id);
        match i {
            Some(i) => Some(self.sheets.remove(i)),
            None => None,
        }
    }

    /// Moves a sheet before another sheet
    pub fn move_sheet(&mut self, target: SheetId, order: String) {
        if let Some(target) = self.try_sheet_mut(target) {
            target.order = order;
            self.sort_sheets();
        }
    }

    pub fn sheet_id_to_index(&self, id: SheetId) -> Option<usize> {
        self.sheets.iter().position(|sheet| sheet.id == id)
    }

    pub fn sheet_index_to_id(&self, index: usize) -> Option<SheetId> {
        Some(self.sheets.get(index)?.id)
    }

    pub fn sheet_has_id(&self, sheet_id: Option<SheetId>) -> bool {
        let Some(sheet_id) = sheet_id else {
            return false;
        };
        self.sheets.iter().any(|s| s.id == sheet_id)
    }

    pub fn try_sheet(&self, sheet_id: SheetId) -> Option<&Sheet> {
        self.sheets.iter().find(|s| s.id == sheet_id)
    }

    pub fn try_sheet_mut(&mut self, sheet_id: SheetId) -> Option<&mut Sheet> {
        self.sheets.iter_mut().find(|s| s.id == sheet_id)
    }

    #[cfg(test)]
    pub fn sheets_mut(&mut self) -> &mut [Sheet] {
        &mut self.sheets
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use serial_test::parallel;

    #[test]
    #[parallel]
    fn test_try_sheet_from_id() {
        let grid = Grid::new();
        let id = grid.first_sheet_id();

        assert!(grid.try_sheet(id).is_some());
        assert!(grid.try_sheet(SheetId::new()).is_none());
    }

    #[test]
    #[parallel]
    fn test_try_sheet_mut_from_id() {
        let mut grid = Grid::new();
        let id = grid.first_sheet_id();

        assert!(grid.try_sheet_mut(id).is_some());
        assert!(grid.try_sheet_mut(SheetId::new()).is_none());
    }

    /// creates three sheets with name 1, 2, and 3
    fn create_three_sheets() -> Grid {
        let mut grid = Grid::new();
        grid.sheets[0].name = String::from('0');
        grid.add_sheet(None);
        grid.sheets[1].name = String::from('1');
        grid.add_sheet(None);
        grid.sheets[2].name = String::from('2');
        grid
    }

    #[test]
    #[parallel]
    fn test_order_add_sheet() {
        let grid = create_three_sheets();
        let sheet_0 = &grid.sheets[0];
        let sheet_1 = &grid.sheets[1];
        let sheet_2 = &grid.sheets[2];
        assert!(sheet_0.order < sheet_1.order);
        assert!(sheet_1.order < sheet_2.order);
    }

    #[test]
    #[parallel]
    fn test_order_move_sheet() {
        // starting as name = 0, 1, 2
        let mut grid = create_three_sheets();

        // moved to name = 1, 0, 2
        grid.move_sheet(
            grid.sheets[0].id,
            key_between(
                &Some(grid.sheets[1].order.clone()),
                &Some(grid.sheets[2].order.clone()),
            )
            .unwrap(),
        );
        assert_eq!(grid.sheets[0].name, String::from('1'));
        assert_eq!(grid.sheets[1].name, String::from('0'));
        assert_eq!(grid.sheets[2].name, String::from('2'));

        // moved to name = 1, 2, 0
        grid.move_sheet(
            grid.sheets[1].id,
            key_between(&Some(grid.sheets[2].order.clone()), &None).unwrap(),
        );
        assert_eq!(grid.sheets[0].name, String::from('1'));
        assert_eq!(grid.sheets[1].name, String::from('2'));
        assert_eq!(grid.sheets[2].name, String::from('0'));

        // moved back to name = 0, 1, 2
        grid.move_sheet(
            grid.sheets[2].id,
            key_between(&None, &Some(grid.sheets[0].order.clone())).unwrap(),
        );
        assert_eq!(grid.sheets[0].name, String::from('0'));
        assert_eq!(grid.sheets[1].name, String::from('1'));
        assert_eq!(grid.sheets[2].name, String::from('2'));
    }

    #[test]
    #[parallel]
    fn test_first_sheet() {
        let grid = create_three_sheets();
        assert_eq!(grid.first_sheet().name, String::from('0'));
    }

    #[test]
    #[parallel]
    fn test_first_sheet_id() {
        let grid = create_three_sheets();
        assert_eq!(grid.first_sheet_id(), grid.sheets[0].id);
    }

    #[test]
    #[parallel]
    fn test_previous_sheet_order() {
        let grid = create_three_sheets();
        assert_eq!(grid.previous_sheet_order(grid.sheets[0].id), None);
        assert_eq!(
            grid.previous_sheet_order(grid.sheets[1].id),
            Some(grid.sheets[0].order.clone())
        );
        assert_eq!(
            grid.previous_sheet_order(grid.sheets[2].id),
            Some(grid.sheets[1].order.clone())
        );
    }

    #[test]
    #[parallel]
    fn test_next_sheet() {
        let grid = create_three_sheets();
        assert_eq!(grid.next_sheet(grid.sheets[0].id), Some(&grid.sheets[1]));
        assert_eq!(grid.next_sheet(grid.sheets[1].id), Some(&grid.sheets[2]));
        assert_eq!(grid.next_sheet(grid.sheets[2].id), None);
    }

    #[test]
    #[parallel]
    fn test_sort_sheets() {
        let mut grid = create_three_sheets();
        grid.sheets[0].order = String::from("a2");
        grid.sheets[1].order = String::from("a1");
        grid.sheets[2].order = String::from("a3");
        grid.sort_sheets();
        assert_eq!(grid.sheets[0].name, String::from('1'));
        assert_eq!(grid.sheets[1].name, String::from('0'));
        assert_eq!(grid.sheets[2].name, String::from('2'));
    }

    #[test]
    #[parallel]
    fn test_move_sheet() {
        let mut grid = create_three_sheets();
        grid.move_sheet(
            grid.sheets[0].id,
            key_between(
                &Some(grid.sheets[1].order.clone()),
                &Some(grid.sheets[2].order.clone()),
            )
            .unwrap(),
        );
        assert_eq!(grid.sheets[0].name, String::from('1'));
        assert_eq!(grid.sheets[1].name, String::from('0'));
        assert_eq!(grid.sheets[2].name, String::from('2'));
    }

    #[test]
    #[parallel]
    fn add_sheet_adds_suffix_if_name_already_in_use() {
        let mut grid = Grid::new();
        grid.add_sheet(Some(Sheet::new(
            SheetId::new(),
            "Sheet 1".to_string(),
            "a1".to_string(),
        )));
        grid.add_sheet(Some(Sheet::new(
            SheetId::new(),
            "Sheet 1".to_string(),
            "a1".to_string(),
        )));
        assert_eq!(grid.sheets[0].name, "Sheet 1".to_string());
        assert_eq!(grid.sheets[1].name, "Sheet 1 (1)".to_string());
    }
}
