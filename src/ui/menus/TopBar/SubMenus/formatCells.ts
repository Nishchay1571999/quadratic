import { ColorResult } from 'react-color';
import { sheetController } from '../../../../grid/controller/SheetController';
import { transactionResponse } from '../../../../grid/controller/transactionResponse';
import { convertReactColorToString } from '../../../../helpers/convertColor';
import { TransactionSummary } from '../../../../quadratic-core/types';
import { CellAlignment } from '../../../../schemas';

export const FORMAT_SELECTION_EVENT = 'format-selection-event';

const format = (summary: TransactionSummary) => {
  transactionResponse(summary);
  window.dispatchEvent(new Event(FORMAT_SELECTION_EVENT));
};

export const setFillColor = (color?: ColorResult): void => {
  const rectangle = sheetController.sheet.cursor.getRectangle();
  format(sheetController.sheet.setCellFillColor(rectangle, color ? convertReactColorToString(color) : undefined));
};

export const setBold = (bold: boolean): void => {
  const rectangle = sheetController.sheet.cursor.getRectangle();
  format(sheetController.sheet.setCellBold(rectangle, bold));
};

export const setItalic = (italic: boolean): void => {
  const rectangle = sheetController.sheet.cursor.getRectangle();
  format(sheetController.sheet.setCellItalic(rectangle, italic));
};

export const setTextColor = (rgb?: ColorResult): void => {
  const rectangle = sheetController.sheet.cursor.getRectangle();
  format(sheetController.sheet.setCellTextColor(rectangle, rgb ? convertReactColorToString(rgb) : undefined));
};

export const setAlignment = (alignment: CellAlignment): void => {
  const rectangle = sheetController.sheet.cursor.getRectangle();
  format(sheetController.sheet.setCellAlign(rectangle, alignment));
};

export const textFormatIncreaseDecimalPlaces = (): void => {
  throw new Error('not implemented yet');
};

export const textFormatDecreaseDecimalPlaces = (): void => {
  throw new Error('not implemented yet');
};

export const textFormatSetCurrency = (): void => {
  throw new Error('not implemented yet');
};

export const textFormatSetPercentage = (): void => {
  throw new Error('not implemented yet');
};

export const textFormatSetNumber = (): void => {
  throw new Error('not implemented yet');
};

export const textFormatSetExponential = (): void => {
  throw new Error('not implemented yet');
};

export const textFormatClear = (): void => {
  throw new Error('not implemented yet');
};

export const clearFormatting = () => {
  const rectangle = sheetController.sheet.cursor.getRectangle();
  format(sheetController.sheet.clearFormatting(rectangle));
};

export const clearFormattingAndBorders = () => {
  // const rectangle = sheetController.sheet.cursor.getRectangle();
  // format(sheetController.sheet.clearAllFormatting(rectangle));
  throw new Error('not implemented yet!');
};
