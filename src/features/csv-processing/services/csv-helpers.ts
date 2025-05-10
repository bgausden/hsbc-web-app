/**
 * CSV helpers and utility functions for CSV processing
 */
import { CastingContext, parse } from 'csv-parse/browser/esm/sync';
import { assertNotNull } from '../../../core/utils/asserts.js';

// Constants for CSV processing
export const PAYMENT = /PAYMENT - THANK YOU.*$/;
export const RETURN = /RETURN:.*$/;
export const SALES = 'SALES: ';
export const TRANSACTION_DATE_INDEX = 1; // zero indexed
export const DESCRIPTION_INDEX = 2; // column index for Description
export const AMOUNT_INDEX = 4; // column index for Amount(HKD)

/**
 * Cleans and formats string values from CSV
 *
 * @param value The string value to clean
 * @returns The cleaned string value
 */
export const cast = (value: string): string => {
  return value.replace(/\s+/g, ' ').replace(SALES, '').trim();
};

/**
 * Sets the sign for amount values based on transaction type
 * Purchase amounts need to be negative for Xero import
 * Payments and returns are positive amounts (credits) in Xero
 *
 * @param record The CSV record to process
 */
export function setSign(record: string[]): void {
  assertNotNull(record);
  if (record.length <= AMOUNT_INDEX) {
    return; // Not enough fields to process
  }

  if (record[DESCRIPTION_INDEX]?.match(PAYMENT) || record[DESCRIPTION_INDEX]?.match(RETURN)) {
    // do nothing. The amount is already positive
    return;
  }

  // change the value to a negative value
  record[AMOUNT_INDEX] = `-${record[AMOUNT_INDEX]}`;
}

/**
 * Processes each record from CSV parsing
 *
 * @param param0 The raw record object with raw string and parsed record
 * @param context The parsing context
 * @returns Processed record or null if invalid
 */
export const onRecord = (
  { raw, record }: { raw: string; record: string[] },
  context: CastingContext
) => {
  // Validate record exists
  if (!Array.isArray(record)) {
    return null;
  }

  if (record.length <= 1) {
    // empty record, return null
    return null;
  }

  if (context.error && context.error.code === 'CSV_RECORD_INCONSISTENT_COLUMNS') {
    // Handle inconsistent columns by fixing common HSBC CSV issues
    return handleInconsistentColumns(raw, record, context);
  }

  // Purchase amounts need to be negative for Xero import
  // Payments and returns are positive amounts (credits) in Xero
  // HSBC CSV has everything as a positive value
  setSign(record);

  // delete rows where there is only data in the 0th column (garbage)
  if (record[TRANSACTION_DATE_INDEX]?.trim() === '') return null;

  // return Post Date, Txn Amount, null, Description + Foreign CCY Amt
  return [record[0], record[4], '', `${record[2]} ${record[3]}`];
};

/**
 * Handles inconsistent columns in HSBC CSV data by fixing common issues
 *
 * @param raw The raw CSV line
 * @param record The parsed record
 * @param context The parsing context
 * @returns Fixed record or null
 */
function handleInconsistentColumns(raw: string, record: string[], context: CastingContext) {
  // find the 3rd comma in the line and excise it as it's probably incorrectly
  // part of the payee's name (and shouldn't be but HSBC are crap so...)
  let stringRaw = raw as string;
  let counter = 3; // zero-based index
  let nThIndex = 0;

  if (counter > 0) {
    while (counter--) {
      // Get the index of the next occurence
      nThIndex = stringRaw.indexOf(',', nThIndex + ','.length);
    }
  }

  stringRaw = stringRaw.substring(0, nThIndex) + stringRaw.substring(nThIndex + ','.length);

  // call CSV.parse() again on the newly constructed line.
  // This time should return the correct number of fields.
  const result = parse(stringRaw, {
    raw: true,
    trim: true,
    onRecord: onRecord,
    cast: cast,
  });

  return result[0];
}
