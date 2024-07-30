use std::fs::create_dir_all;

use controller::operations::clipboard::PasteSpecial;
use grid::{
    formats::format::Format,
    js_types::JsSheetFill,
    sheet::validations::{
        validation::{
            Validation, ValidationDisplay, ValidationDisplaySheet, ValidationError,
            ValidationMessage, ValidationStyle,
        },
        validation_rules::{
            validation_checkbox::ValidationCheckbox,
            validation_list::{ValidationList, ValidationListSource},
            ValidationRule,
        },
    },
};
use quadratic_core::{
    color::Rgba,
    controller::{
        active_transactions::transaction_name::TransactionName,
        execution::run_code::get_cells::JsGetCellResponse, transaction_types::JsCodeResult,
    },
    grid::{
        js_types::{
            JsCodeCell, JsHtmlOutput, JsRenderBorder, JsRenderBorders, JsRenderCell,
            JsRenderCellSpecial, JsRenderCodeCell, JsRenderCodeCellState,
        },
        sheet::search::SearchOptions,
        BorderSelection, BorderStyle, CellBorderLine, CodeCellLanguage, ConnectionKind,
    },
    selection::Selection,
    sheet_offsets::{
        resize_transient::TransientResize,
        sheet_offsets_wasm::{ColumnRow, Placement},
    },
    wasm_bindings::controller::{
        bounds::MinMax,
        sheet_info::{SheetBounds, SheetInfo},
        summarize::SummarizeSelectionResult,
    },
    Rect, *,
};
use ts_rs::TS;

macro_rules! generate_type_declarations {
    ($($type:ty),+ $(,)?) => {
        String::new() $(+ "export " + &<$type>::decl() + "\n")+
    };
}

fn main() {
    // TODO: autogenerate this file by parsing the whole project using `syn` and
    // searching for types annotated with `#[derive(TS)]`. This still won't work
    // for types generated by `macro_rules!` macros, so we'll have to handle
    // those some other way.
    let mut s = format!("// This file is automatically generated by {}\n", file!());
    s += "// Do not modify it manually.\n\n";

    s += &generate_type_declarations!(
        CodeCellLanguage,
        ConnectionKind,
        JsHtmlOutput,
        JsCodeCell,
        JsRenderCodeCell,
        JsRenderCodeCellState,
        JsRenderCellSpecial,
        JsRenderCell,
        formulas::RangeRef,
        formulas::CellRef,
        formulas::CellRefCoord,
        grid::GridBounds,
        grid::CellAlign,
        grid::CellWrap,
        grid::NumericFormat,
        grid::NumericFormatKind,
        grid::SheetId,
        grid::js_types::JsRenderCell,
        grid::js_types::JsRenderFill,
        grid::js_types::CellFormatSummary,
        grid::js_types::JsClipboard,
        ArraySize,
        Axis,
        Instant,
        Duration,
        RunError,
        RunErrorMsg,
        Pos,
        Rect,
        Span,
        SearchOptions,
        SheetPos,
        SheetRect,
        Selection,
        Placement,
        ColumnRow,
        SheetInfo,
        PasteSpecial,
        Rgba,
        CellBorderLine,
        BorderSelection,
        BorderStyle,
        JsRenderBorder,
        JsRenderBorders,
        JsCodeResult,
        MinMax,
        TransientResize,
        SheetBounds,
        TransactionName,
        JsGetCellResponse,
        SummarizeSelectionResult,
        Format,
        JsSheetFill,
        ColumnRow,
        Validation,
        ValidationRule,
        ValidationError,
        ValidationMessage,
        ValidationCheckbox,
        ValidationList,
        ValidationListSource,
        ValidationStyle,
        ValidationDisplay,
        ValidationDisplaySheet,
    );

    if create_dir_all("../quadratic-client/src/app/quadratic-core-types").is_ok() {
        std::fs::write(
            "../quadratic-client/src/app/quadratic-core-types/index.d.ts",
            s,
        )
        .expect("failed to write types file");
    }
}
