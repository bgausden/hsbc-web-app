/**
 * CSV helpers and utility functions for CSV processing
 */
import { CastingContext, parse } from 'csv-parse/browser/esm/sync';
import { assertNotNull } from '../../../core/utils/asserts.js';

// Constants for CSV processing
export const PAYMENT = /PAYMENT - THANK YOU.*$/;
export const RETURN = /RETURN:\s*.*$/;
export const SALES = 'SALES: ';
export const HSBC_POST_DATE_INDEX = 0;
export const HSBC_TRANSACTION_DATE_INDEX = 1;
export const HSBC_DESCRIPTION_INDEX = 2; // column index for Description
export const HSBC_FOREIGN_CURRENCY_AMOUNT_INDEX = 3; // column index for Foreign Currency Amount
export const HSBC_AMOUNT_INDEX = 4; // column index for Amount in HKD
const EMPTY_VALUE = '';
const NO_DESCRIPTION = 'NO DESCRIPTION';

/**
 * Cleans and formats string values from CSV
 *
 * @param value The string value to clean
 * @returns The cleaned string value
 */
export const cast = (value: string): string => {
  return value.replace(/\t+/g, '').replace(/\s+/g, ' ').replace(SALES, '').trim();
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
  if (record.length <= HSBC_AMOUNT_INDEX) {
    return; // Not enough fields to process
  }

  if (
    record[HSBC_DESCRIPTION_INDEX]?.match(PAYMENT) ||
    record[HSBC_DESCRIPTION_INDEX]?.match(RETURN)
  ) {
    // do nothing. The amount is already positive
    return;
  }

  // change the value to a negative value
  record[HSBC_AMOUNT_INDEX] = `-${record[HSBC_AMOUNT_INDEX]}`;
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
    return handleInconsistentColumns(raw, record);
  }

  // Purchase amounts need to be negative for Xero import
  // Payments and returns are positive amounts (credits) in Xero
  // HSBC CSV has everything as a positive value
  setSign(record);

  // delete rows where there is only data in the 0th column (garbage)
  if (record[HSBC_TRANSACTION_DATE_INDEX]?.trim() === '') return null;

  // return Post Date, Txn Amount, null, Description + Foreign CCY Amt (if available)
  const foreignCurrencyAmount = record[HSBC_FOREIGN_CURRENCY_AMOUNT_INDEX]?.trim();
  const description = record[HSBC_DESCRIPTION_INDEX] || NO_DESCRIPTION;
  const combinedDescription = foreignCurrencyAmount
    ? `${description} ${foreignCurrencyAmount}`
    : description;

  return [
    record[HSBC_POST_DATE_INDEX],
    record[HSBC_AMOUNT_INDEX],
    EMPTY_VALUE,
    combinedDescription,
  ];
};

export function csvPreProcess(record: string[]): string[] {
  // Sample data "22 Apr 2025	",21-Apr-25,SALES:   MINDBODY," INC.            SAN LUIS OBISUS                                        	",2366.83
  // Note comma after MINDBODY which shouldn't be there and note also the foreign dollar amount is missing
  if (record.length !== 5) {
    throw new Error(`Expected at least 5 fields in record, got ${record.length}`);
  }

  // Merge the 3rd and 4th fields (indices 2 and 3) and clean whitespace
  const mergedDescription = (record[HSBC_DESCRIPTION_INDEX] + record[HSBC_DESCRIPTION_INDEX + 1])
    .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
    .replace(/SALES:\s+/g, '') // Remove SALES: prefix
    .trim();

  // Return new record with merged description field
  return [
    record[HSBC_POST_DATE_INDEX], // Post Date
    record[HSBC_TRANSACTION_DATE_INDEX], // Transaction Date
    mergedDescription, // Merged Description (was fields 2 + 3)
    '', // Foreign Currency Amount was missing due to extra comma
    record[HSBC_FOREIGN_CURRENCY_AMOUNT_INDEX], // HKD amount moved from 4th to 5th position
  ];
}

export function handleCommaInDescription(raw: string): string {
  // Sample data
  // 22 May 2025	,21 May 2025	,SALES:   MINDBODY, INC.            SAN LUIS OBISUS	,USD 299.00	,2386.79
  // 12 May 2025	,12 May 2025	,PAYMENT - THANK YOU	,	,21047.34,CR

  // Split by comma to get fields
  let fields = raw.split(',');

  // Ensure we have at least 6 fields to work with
  if (fields.length < 6) {
    throw new Error(`Expected at least 6 fields in raw string, got ${fields.length}`);
  }

  // Check if the last field is "CR" (credit indicator) and remove it
  if (fields[fields.length - 1].trim() === 'CR') {
    fields.pop(); // Remove the CR field
  }

  // If there are more than 5 fields, merge fields 3 and 4 repeatedly until we have exactly 5 fields
  while (fields.length > 5) {
    // Merge fields at index 2 and 3 (3rd and 4th fields)
    const mergedField = fields[2] + ' ' + fields[3];

    // Replace commas with spaces and normalize whitespace
    const cleanedField = mergedField
      .replace(/,/g, ' ') // Replace commas with spaces
      .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
      .trim();

    // Replace the two fields with the merged one
    fields.splice(2, 2, cleanedField);
  }

  // Ensure we now have exactly 5 fields
  if (fields.length !== 5) {
    throw new Error(`Expected exactly 5 fields after merging, got ${fields.length}`);
  }

  // Validate that the 4th field (index 3) contains a valid currency pattern OR is empty
  const currencyPattern = /^[A-Z]{3}\s+\d+\.\d{2}$/;
  const isEmpty = fields[3].trim() === '';

  if (!isEmpty && !currencyPattern.test(fields[3].trim())) {
    throw new Error(
      `5th field must contain currency name and amount (e.g. "USD 299.00") or be empty, got: "${fields[3]?.trim()}"`
    );
  }

  // Clean up the description field (remove SALES: prefix)
  fields[2] = fields[2].replace(/SALES:\s+/g, '').trim();

  // Create final result: Date1, Date2, Description, Empty, Amount
  const result = [
    fields[0], // Post Date
    fields[1], // Transaction Date
    fields[2], // Merged and cleaned Description
    EMPTY_VALUE, // Insert empty 4th field (Foreign Currency Amount position)
    fields[4], // Amount in HKD (last field)
  ];

  return result.join(',');
}

export function createOutputRow(record: string[]): string[] {
  // return Post Date, Txn Amount, null, Description + Foreign CCY Amt (if available)
  const foreignCurrencyAmount = record[HSBC_FOREIGN_CURRENCY_AMOUNT_INDEX]?.trim();
  const description = record[HSBC_DESCRIPTION_INDEX] || NO_DESCRIPTION;
  const combinedDescription = foreignCurrencyAmount
    ? `${description} ${foreignCurrencyAmount}`
    : description;

  return [
    record[HSBC_POST_DATE_INDEX],
    record[HSBC_AMOUNT_INDEX],
    EMPTY_VALUE,
    combinedDescription,
  ];
}
