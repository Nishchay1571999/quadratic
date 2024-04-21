// Converts

import { JsCodeResult } from '@/quadratic-core-types';
import { javascriptClient } from '../javascriptClient';
import { javascriptCore } from '../javascriptCore';
import { javascriptConvertOutputArray, javascriptConvertOutputType } from './javascriptOutput';

export function javascriptErrorResult(transactionId: string, message: string, lineNumber?: number) {
  const codeResult: JsCodeResult = {
    transaction_id: transactionId,
    success: false,
    output_value: null,
    std_err: message,
    std_out: '',
    output_array: null,
    line_number: lineNumber ?? null,
    output_display_type: null,
    cancel_compute: false,
  };
  javascriptCore.sendJavascriptResults(transactionId, codeResult);
  javascriptClient.sendState('ready');
}

export function javascriptResults(
  transactionId: string,
  x: number,
  y: number,
  result: any,
  console: string,
  lineNumber?: number
) {
  const message: string[] = [];
  const outputType = javascriptConvertOutputType(message, result, x, y);
  const outputArray = javascriptConvertOutputArray(message, result, x, y);
  const codeResult: JsCodeResult = {
    transaction_id: transactionId,
    success: true,
    output_value: outputType?.output ? outputType.output : null,
    std_out: (console ? console : '') + (message.length ? message.join('\n') : ''),
    std_err: null,
    output_array: outputArray ? outputArray.output : null,
    line_number: lineNumber !== undefined ? lineNumber + 1 : null,
    output_display_type: outputType?.displayType || outputArray?.displayType || null,
    cancel_compute: false,
  };
  javascriptCore.sendJavascriptResults(transactionId, codeResult);
  javascriptClient.sendState('ready', { current: undefined });
}
