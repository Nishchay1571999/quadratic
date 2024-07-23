import { JsNumber } from '@/app/quadratic-core-types';
import { BigNumber } from 'bignumber.js';

// Converts a number to a string with the given cell formatting
export const convertNumber = (n: string, format: JsNumber, currentFractionDigits?: number): string => {
  let number = new BigNumber(n);

  let suffix = '';
  if (format.format?.type === 'PERCENTAGE') {
    number = number.times(100);
    suffix = '%';
  }

  let options: BigNumber.Format = { decimalSeparator: '.', groupSeparator: ',' };
  if (format.commas) {
    options.groupSize = 3;
  }
  if (currentFractionDigits) {
    options.fractionGroupSize = currentFractionDigits;
  } else if (format.decimals !== null) {
    options.fractionGroupSize = format.decimals;
  } else {
    options.fractionGroupSize = undefined;
  }
  if (format.format?.type === 'CURRENCY') {
    if (format.format.symbol) {
      options.prefix = format.format.symbol;
    } else {
      throw new Error('Expected format.symbol to be defined in convertNumber.ts');
    }
  }

  if (currentFractionDigits !== undefined) {
    return number.toFormat(currentFractionDigits, options) + suffix;
  } else if (format.decimals !== null) {
    return number.toFormat(format.decimals, options) + suffix;
  }
  return number.toFormat(options) + suffix;
};

// Reduces the number of decimals (used by rendering to show a fractional number in a smaller-width cell)
export const reduceDecimals = (
  current: string,
  original: string,
  format: JsNumber,
  currentFractionDigits?: number
): { number: string; currentFractionDigits: number } | undefined => {
  // this only works if there is a fractional part
  if (original.includes('.')) {
    if (currentFractionDigits === undefined) {
      const split = original.split('.');
      currentFractionDigits = split[1].length - 1;
    }
    const updated = convertNumber(original, format, currentFractionDigits);
    console.log(updated, currentFractionDigits);
    if (updated !== current) {
      return { number: updated, currentFractionDigits };
    }
  }
};
