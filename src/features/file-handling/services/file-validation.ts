/**
 * File validation services for enhancing security
 */

/**
 * Validates if a file is a CSV file
 * Checks both the extension and MIME type for additional security
 *
 * @param file The file to validate
 * @returns True if the file is a valid CSV file, false otherwise
 */
export function isValidCsvFile(file: File): boolean {
  // Check file extension
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  const hasValidExtension = fileExtension === 'csv';

  // Check MIME type
  const hasValidMimeType =
    file.type === 'text/csv' ||
    file.type === 'application/csv' ||
    file.type === 'application/vnd.ms-excel' ||
    file.type === ''; // Some browsers don't set type for CSV

  // Additional check on small sample of content if needed
  return hasValidExtension && hasValidMimeType;
}

/**
 * Ensures the file size is within acceptable limits
 * Prevents denial of service through extremely large files
 *
 * @param file The file to validate
 * @param maxSizeInBytes Maximum allowed file size (default: 5MB)
 * @returns True if the file size is acceptable, false otherwise
 */
export function isAcceptableFileSize(
  file: File,
  maxSizeInBytes: number = 5 * 1024 * 1024
): boolean {
  return file.size > 0 && file.size <= maxSizeInBytes;
}

/**
 * Performs a quick check on file content to verify it looks like CSV data
 * This adds an extra layer of validation beyond just checking extension
 *
 * @param content The file content as string
 * @returns True if the content appears to be CSV data
 */
export function hasValidCsvContent(content: string): boolean {
  // Empty content is invalid
  if (!content || content.trim() === '') {
    return false;
  }

  // Check for characteristics of CSV data (has commas, multiple lines)
  const hasCommas = content.includes(',');
  const hasMultipleLines = content.includes('\n');

  // Quick check for common CSV characteristics
  return hasCommas && hasMultipleLines;
}
