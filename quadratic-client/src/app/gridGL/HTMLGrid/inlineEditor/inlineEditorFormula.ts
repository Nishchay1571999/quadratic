//! This handles the cell highlighting and inserting of cells when editing a
//! formula in the inline editor.

import { events } from '@/app/events/events';
import { sheets } from '@/app/grid/controller/Sheets';
import { inlineEditorHandler } from '@/app/gridGL/HTMLGrid/inlineEditor/inlineEditorHandler';
import { inlineEditorMonaco } from '@/app/gridGL/HTMLGrid/inlineEditor/inlineEditorMonaco';
import { pixiApp } from '@/app/gridGL/pixiApp/PixiApp';
import { SheetPosTS } from '@/app/gridGL/types/size';
import { getA1Notation } from '@/app/gridGL/UI/gridHeadings/getA1Notation';
import { ParseFormulaReturnType } from '@/app/helpers/formulaNotation';
import { parseFormula } from '@/app/quadratic-rust-client/quadratic_rust_client';
import { colors } from '@/app/theme/colors';
import { extractCellsFromParseFormula } from '@/app/ui/menus/CodeEditor/useEditorCellHighlights';
import * as monaco from 'monaco-editor';
import { editor } from 'monaco-editor';

class InlineEditorFormula {
  private insertingCells?: { value: string; position: number };
  private decorations?: editor.IEditorDecorationsCollection;

  constructor() {
    events.on('cursorPosition', this.cursorMoved);
  }

  async cellHighlights(location: SheetPosTS, formula: string) {
    const parsed = (await parseFormula(formula, location.x, location.y)) as ParseFormulaReturnType;
    if (parsed) {
      pixiApp.cellHighlights.fromFormula(parsed, { x: location.x, y: location.y }, location.sheetId);

      const extractedCells = extractCellsFromParseFormula(parsed, { x: location.x, y: location.y }, location.sheetId);
      const newDecorations: monaco.editor.IModelDeltaDecoration[] = [];
      const cellColorReferences = new Map<string, number>();

      extractedCells.forEach((value, index) => {
        const { cellId, span } = value;
        const startPosition = inlineEditorMonaco.getSpanPosition(span.start);

        const cellColor =
          cellColorReferences.get(cellId) ?? cellColorReferences.size % colors.cellHighlightColor.length;
        cellColorReferences.set(cellId, cellColor);

        // we need to +1 since we removed the `=` character from the formula
        const range = new monaco.Range(
          startPosition.lineNumber,
          startPosition.column + 1,
          startPosition.lineNumber,
          startPosition.column + 1 + span.end - span.start
        );

        // decorations color the cell references in the editor
        newDecorations.push({
          range,
          options: {
            stickiness: 1,
            inlineClassName: `cell-reference-${cellColorReferences.get(cellId)}`,
          },
        });

        const editorCursorPosition = inlineEditorMonaco.getPosition();

        if (editorCursorPosition && range.containsPosition(editorCursorPosition)) {
          pixiApp.cellHighlights.setHighlightedCell(index);
        }
      });

      // update the cell references in the editor
      if (this.decorations) {
        this.decorations.clear();
        this.decorations.set(newDecorations);
      } else {
        this.decorations = inlineEditorMonaco.createDecorationsCollection(newDecorations);
      }
    } else {
      this.decorations?.clear();
      pixiApp.cellHighlights.clear();
    }
  }

  clearDecorations() {
    this.decorations?.clear();
    pixiApp.cellHighlights.clear();
    pixiApp.cellHighlights.dirty = true;
  }

  removeInsertingCells() {
    if (!this.insertingCells) return;
    const { value, position } = this.insertingCells;
    inlineEditorMonaco.deleteText(position, value.length);
    this.insertingCells = undefined;
  }

  private insertInsertingCells(a1Notation: string) {
    this.removeInsertingCells();
    const position = inlineEditorMonaco.insertTextAtCursor(a1Notation);
    this.insertingCells = { value: a1Notation, position };
  }

  addInsertingCells(position: number) {
    this.insertingCells = { value: '', position };
  }

  endInsertingCells() {
    this.insertingCells = undefined;
  }

  private cursorMoved = () => {
    if (inlineEditorHandler.isEditingFormula()) {
      const cursor = sheets.sheet.cursor;

      const location = inlineEditorHandler.location;
      if (!location) {
        throw new Error('Expected inlineEditorHandler.location to be defined in cursorMoved');
      }

      // We start the cursorIsMoving unless we've returned to the home cell (viz.,
      // after a Backspace or Escape).
      if (
        !cursor.multiCursor &&
        cursor.originPosition.x === location.x &&
        cursor.originPosition.y === location.y &&
        location.sheetId === sheets.sheet.id
      ) {
        return;
      }
      inlineEditorHandler.cursorIsMoving = true;
      inlineEditorMonaco.removeSelection();
      if (cursor.multiCursor) {
        const startLocation = cursor.multiCursor.originPosition;
        const start = getA1Notation(startLocation.x, startLocation.y);
        const endLocation = cursor.multiCursor.terminalPosition;
        const end = getA1Notation(endLocation.x, endLocation.y);
        this.insertInsertingCells(`${start}:${end}`);
      } else {
        const location = cursor.originPosition;
        const a1Notation = getA1Notation(location.x, location.y);
        this.insertInsertingCells(a1Notation);
      }

      // We need the timeout to ensure the pointerDown event does not change the
      // focus again.
      setTimeout(inlineEditorMonaco.focus, 0);
    }
  };
}

export const inlineEditorFormula = new InlineEditorFormula();
