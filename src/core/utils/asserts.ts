import { CsvError } from 'csv-parse/browser/esm';
import { HSBC_DESCRIPTION_INDEX } from '../../features/csv-processing/services/csv-helpers.js';

/**
 * Asserts that the element is an HTMLFormElement
 *
 * @param element The element to check
 * @throws Error if the element is not an HTMLFormElement
 */
export function isForm(element: unknown): asserts element is HTMLFormElement {
  if (!(element instanceof HTMLFormElement)) {
    throw new Error('Element is not a form!');
  }
}

/**
 * Asserts that the argument is not null or undefined
 *
 * @param arg The argument to check
 * @throws Error if the argument is null or undefined
 */
export function assertNotNull<T>(arg: T): asserts arg is NonNullable<T> {
  if (arg === null || arg === undefined) {
    throw new Error('Element is null or undefined!');
  }
}

/**
 * Asserts that the argument is a FileList
 *
 * @param arg The argument to check
 * @throws Error if the argument is not a FileList
 */
export function isFileList(arg: unknown): asserts arg is FileList {
  if (!(arg instanceof FileList) && arg instanceof Object && Object.keys(arg).length === 0) {
    throw new Error('Element is not a FileList!');
  }
}

/**
 * Checks if the argument is a File
 *
 * @param arg The argument to check
 * @returns True if the argument is a File, false otherwise
 */
export function isFile(arg: unknown): arg is File {
  return arg instanceof File;
}

/**
 * Asserts that the given argument is an HTMLInputElement.
 *
 * This function is a type guard that narrows the type of `arg` to HTMLInputElement
 * when it passes the check. If the argument is not an HTMLInputElement, it throws an error.
 *
 * @param arg - The value to check
 * @throws {Error} Throws an error if the argument is not an HTMLInputElement
 *
 * @example
 * ```ts
 * const element = document.getElementById('my-input');
 * isHTMLInputElement(element);
 * // After this line, TypeScript knows element is HTMLInputElement
 * element.value = 'new value';
 * ```
 */
export function isHTMLInputElement(arg: unknown): asserts arg is HTMLInputElement {
  if (!(arg instanceof HTMLInputElement)) {
    throw new Error('Element is not an HTMLInputElement!');
  }
}

export function isValidRecord(record: unknown): asserts record is string[] {
  if (!Array.isArray(record)) {
    throw new Error('Record is not an array!');
  }
  if (record.length !== 5) {
    throw new Error('Record does not have exactly 5 fields!');
  }
  if (record[HSBC_DESCRIPTION_INDEX] === '' || record[HSBC_DESCRIPTION_INDEX] === undefined) {
    const e = new CsvError(
      'CSV_INVALID_ARGUMENT',
      'Record does not have a valid Description field!'
    );
    //(e as any).code = "CSV_NO_DESCRIPTION";
    throw e;
  }
}

export function isCsvError(error: unknown): asserts error is CsvError {
  if (!(error instanceof Error)) {
    throw new Error('Provided error is not an instance of Error!');
  }
  if (!('code' in error)) {
    throw new Error('Provided error is not a CsvError!');
  }
}

export function isMissingDescription(record: string[]): boolean {
  if (
    !Array.isArray(record) ||
    record[HSBC_DESCRIPTION_INDEX] === undefined ||
    record[HSBC_DESCRIPTION_INDEX] === ''
  ) {
    return false; // Not a valid record or no description field
  }
  return true; // Valid record with description field
}
