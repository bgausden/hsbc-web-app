/**
 * Sanitization utilities for processing user-provided content
 */

/**
 * Sanitizes a string to prevent XSS and other injection attacks
 * Removes potentially dangerous HTML/script content
 *
 * @param input The string to sanitize
 * @returns A sanitized version of the input string
 */
export function sanitizeString(input: string): string {
  if (!input) return '';

  // Replace HTML entities
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Sanitizes data in a CSV row
 * Applies string sanitization to each cell
 *
 * @param row Array of string values representing a CSV row
 * @returns Sanitized version of the row
 */
export function sanitizeCsvRow(row: string[]): string[] {
  if (!Array.isArray(row)) return [];
  return row.map((cell) => sanitizeString(cell));
}

/**
 * Sanitizes an entire CSV data structure
 *
 * @param csvData 2D array of strings representing CSV data
 * @returns Sanitized version of the CSV data
 */
export function sanitizeCsvData(csvData: string[][]): string[][] {
  if (!Array.isArray(csvData)) return [];
  return csvData.map((row) => sanitizeCsvRow(row));
}

/**
 * Validates and sanitizes CSV cell data for a specific column type
 *
 * @param value The cell value to sanitize
 * @param columnType The expected data type for the column
 * @returns Sanitized and validated value
 */
export function sanitizeByColumnType(
  value: string,
  columnType: 'date' | 'amount' | 'text'
): string {
  const sanitized = sanitizeString(value);

  switch (columnType) {
    case 'date':
      // Keep only valid date characters
      return sanitized.replace(/[^0-9\-\/\.]/g, '');

    case 'amount':
      // Keep only valid currency characters
      return sanitized.replace(/[^0-9\.\-\,\$£€]/g, '');

    case 'text':
    default:
      return sanitized;
  }
}
