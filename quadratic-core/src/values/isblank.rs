use super::{Array, CellValue, Value};

pub trait IsBlank {
    /// Returns whether the value is blank. The empty string is considered
    /// non-blank.
    fn is_blank(&self) -> bool;

    /// Coerces the value to a specific type; returns `None` if the conversion
    /// fails or the original value is blank.
    fn coerce_nonblank<T>(self) -> Option<T>
    where
        Self: TryInto<T>,
    {
        match self.is_blank() {
            true => None,
            false => self.try_into().ok(),
        }
    }
}
impl<T: IsBlank> IsBlank for &'_ T {
    fn is_blank(&self) -> bool {
        (*self).is_blank()
    }
}

impl IsBlank for Value {
    fn is_blank(&self) -> bool {
        match self {
            Value::Single(v) => v.is_blank(),
            Value::Array(a) => a.is_blank(),
            Value::Tuple(t) => t.is_blank(),
        }
    }
}

impl IsBlank for CellValue {
    fn is_blank(&self) -> bool {
        matches!(self, CellValue::Blank)
    }
}

impl IsBlank for Array {
    fn is_blank(&self) -> bool {
        self.cell_values_slice().is_blank()
    }
}

impl<T: IsBlank> IsBlank for [T] {
    fn is_blank(&self) -> bool {
        self.iter().all(|v| v.is_blank())
    }
}
