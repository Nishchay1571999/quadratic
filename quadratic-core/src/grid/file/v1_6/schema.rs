use crate::grid::file::v1_5::schema as v1_5;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::{
    collections::HashMap,
    fmt::{self, Display},
};
use uuid::Uuid;

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct GridSchema {
    pub sheets: Vec<Sheet>,
    pub version: Option<String>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Id {
    pub id: String,
}
impl Id {
    pub fn new() -> Self {
        Self {
            id: Uuid::new_v4().to_string(),
        }
    }
}
impl From<String> for Id {
    fn from(id: String) -> Self {
        Self { id }
    }
}
impl Display for Id {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.id)
    }
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Pos {
    pub x: i64,
    pub y: i64,
}

impl From<crate::Pos> for Pos {
    fn from(pos: crate::Pos) -> Self {
        Self { x: pos.x, y: pos.y }
    }
}
pub type SheetRect = v1_5::SheetRect;
pub type Offsets = v1_5::Offsets;
pub type Borders = v1_5::Borders;
pub type RunError = v1_5::RunError;

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Sheet {
    pub id: Id,
    pub name: String,
    pub color: Option<String>,
    pub order: String,
    pub offsets: Offsets,
    pub columns: Vec<(i64, Column)>,
    pub borders: Borders,
    pub code_runs: Vec<(Pos, CodeRun)>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct CodeRun {
    pub formatted_code_string: Option<String>,
    pub std_out: Option<String>,
    pub std_err: Option<String>,
    pub cells_accessed: Vec<SheetRect>,
    pub result: CodeRunResult,
    pub return_type: Option<String>,
    pub line_number: Option<u32>,
    pub output_type: Option<String>,
    pub spill_error: bool,
    pub last_modified: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum CodeRunResult {
    Ok(OutputValue),
    Err(RunError),
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum OutputValue {
    Single(CellValue),
    Array(OutputArray),
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct OutputArray {
    pub size: OutputSize,
    pub values: Vec<CellValue>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct OutputSize {
    pub w: i64,
    pub h: i64,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct OutputValueValue {
    pub type_field: String,
    pub value: String,
}

pub type RenderSize = v1_5::RenderSize;

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Column {
    pub values: HashMap<String, CellValue>,
    pub align: HashMap<String, ColumnRepeat<CellAlign>>,
    pub wrap: HashMap<String, ColumnRepeat<CellWrap>>,
    pub numeric_format: HashMap<String, ColumnRepeat<NumericFormat>>,
    pub numeric_decimals: HashMap<String, ColumnRepeat<i16>>,
    pub numeric_commas: HashMap<String, ColumnRepeat<bool>>,
    pub bold: HashMap<String, ColumnRepeat<bool>>,
    pub italic: HashMap<String, ColumnRepeat<bool>>,
    pub text_color: HashMap<String, ColumnRepeat<String>>,
    pub fill_color: HashMap<String, ColumnRepeat<String>>,
    pub render_size: HashMap<String, ColumnRepeat<RenderSize>>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum CellValue {
    Blank,
    Text(String),
    NumberI64(i64),
    NumberF64((i64, u32)),
    NumberBD(String),
    Html(String),
    Code(CodeCell),
    Logical(bool),
    Instant(String),
    Duration(String),
    Error(RunError),
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ColumnRepeat<T> {
    pub value: T,
    pub len: u32,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum NumericFormatKind {
    #[default]
    Number,
    Currency,
    Percentage,
    Exponential,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct NumericFormat {
    pub kind: NumericFormatKind,
    pub symbol: Option<String>,
}

pub type CellBorder = v1_5::CellBorder;

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum CodeCellLanguage {
    Python,
    Formula,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct CodeCell {
    pub language: CodeCellLanguage,
    pub code: String,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum CellAlign {
    Left,
    Center,
    Right,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum CellWrap {
    Overflow,
    Wrap,
    Clip,
}
