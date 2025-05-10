/**
 * Main CSV parsing functionality for HSBC to Xero CSV conversion
 */
import { parse } from 'csv-parse/browser/esm/sync';
import { assertNotNull } from '../../../core/utils/asserts.js';
import { cast, onRecord } from './csv-helpers.js';

/**
 * Parses HSBC CSV content and transforms it to Xero-compatible format
 *
 * @param fileContents The CSV content as a string
 * @returns A 2D array representing the parsed and transformed CSV data
 * @throws Error if the CSV content is empty or parsing fails
 */
export function csvParse(fileContents: string): string[][] {
  // Validate input
  assertNotNull(fileContents);
  if (fileContents.trim() === '') {
    throw new Error('CSV content cannot be empty');
  }

  // get the raw data, skipping the document title e.g. "World Business MasterCard xxxx-xxxx-xxxx-1234"
  const raw = fileContents;
  const rawData = raw.slice(raw.indexOf(`\n`) + 1);

  // parse the raw data into a 2d array of strings
  let csvData = parse(rawData, {
    relax_column_count: true,
    trim: true,
    raw: true,
    cast: cast,
    onRecord: onRecord,
  });

  // Validate parsed data
  assertNotNull(csvData);
  if (!Array.isArray(csvData) || csvData.length === 0) {
    throw new Error('Failed to parse CSV data properly');
  }

  // replace the HSBC CSV header with the Xero header
  csvData[0] = ['Date', 'Amount', 'Payee', 'Description'];

  return csvData;
}
