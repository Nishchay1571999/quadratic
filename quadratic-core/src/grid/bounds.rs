use crate::{Pos, Rect};
use serde::{Deserialize, Serialize};

#[derive(Debug, PartialEq)]
pub struct BoundsRect {
    pub x: i64,
    pub y: i64,
    pub width: u32,
    pub height: u32,
}

#[derive(Serialize, Deserialize, Debug, Copy, Clone, PartialEq, Eq, Hash)]
#[serde(tag = "type", rename_all = "camelCase")]
#[cfg_attr(feature = "js", derive(ts_rs::TS))]
pub enum GridBounds {
    Empty,
    NonEmpty(Rect),
}
impl Default for GridBounds {
    fn default() -> Self {
        Self::Empty
    }
}
impl From<Rect> for GridBounds {
    fn from(rect: Rect) -> Self {
        GridBounds::NonEmpty(rect)
    }
}

impl From<GridBounds> for Option<Rect> {
    fn from(bounds: GridBounds) -> Self {
        match bounds {
            GridBounds::Empty => None,
            GridBounds::NonEmpty(rect) => Some(rect),
        }
    }
}

impl GridBounds {
    pub fn is_empty(&self) -> bool {
        *self == GridBounds::Empty
    }
    pub fn clear(&mut self) {
        *self = GridBounds::default();
    }
    pub fn add(&mut self, pos: Pos) {
        match self {
            GridBounds::Empty => *self = Rect::single_pos(pos).into(),
            GridBounds::NonEmpty(rect) => rect.extend_to(pos),
        }
    }
    pub fn add_rect(&mut self, rect: Rect) {
        match self {
            GridBounds::Empty => *self = rect.into(),
            GridBounds::NonEmpty(r) => *r = r.union(&rect),
        }
    }
    pub fn merge(a: Self, b: Self) -> Self {
        match (a, b) {
            (GridBounds::Empty, r) | (r, GridBounds::Empty) => r,
            (GridBounds::NonEmpty(mut a), GridBounds::NonEmpty(b)) => {
                a.extend_to(b.min);
                a.extend_to(b.max);
                GridBounds::NonEmpty(a)
            }
        }
    }
    pub fn to_bounds_rect(&self) -> Option<BoundsRect> {
        match self {
            GridBounds::Empty => None,
            GridBounds::NonEmpty(rect) => Some(BoundsRect {
                x: rect.min.x,
                y: rect.min.y,
                width: rect.width(),
                height: rect.height(),
            }),
        }
    }

    pub fn extend_x(&mut self, x: i64) {
        match self {
            // we cannot extend x to an empty bounds
            GridBounds::Empty => (),
            GridBounds::NonEmpty(rect) => rect.extend_x(x),
        }
    }

    pub fn extend_y(&mut self, y: i64) {
        match self {
            // we cannot extend y to an empty bounds
            GridBounds::Empty => (),
            GridBounds::NonEmpty(rect) => rect.extend_y(y),
        }
    }
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn test_bounds_rect() {
        let bounds = BoundsRect {
            x: 1,
            y: 2,
            width: 3,
            height: 4,
        };
        let grid_bounds = GridBounds::NonEmpty(Rect::new(1, 2, 3, 5));
        assert_eq!(grid_bounds.to_bounds_rect(), Some(bounds));
    }

    #[test]
    fn test_bounds_rect_empty() {
        let grid_bounds = GridBounds::Empty;
        assert_eq!(grid_bounds.to_bounds_rect(), None);
    }

    #[test]
    fn test_bounds_rect_extend_x() {
        let mut grid_bounds = GridBounds::NonEmpty(Rect::new(1, 2, 3, 4));
        grid_bounds.extend_x(5);
        assert_eq!(grid_bounds, GridBounds::NonEmpty(Rect::new(1, 2, 5, 4)));
    }

    #[test]
    fn test_bounds_rect_extend_y() {
        let mut grid_bounds = GridBounds::NonEmpty(Rect::new(1, 2, 3, 4));
        grid_bounds.extend_y(5);
        assert_eq!(grid_bounds, GridBounds::NonEmpty(Rect::new(1, 2, 3, 5)));
    }

    #[test]
    fn to_rect() {
        let grid_bounds = GridBounds::NonEmpty(Rect::new(1, 2, 3, 4));
        assert_eq!(grid_bounds.to_rect(), Some(Rect::new(1, 2, 3, 4)));
        let grid_bounds = GridBounds::Empty;
        assert_eq!(grid_bounds.to_rect(), None);
    }
}
