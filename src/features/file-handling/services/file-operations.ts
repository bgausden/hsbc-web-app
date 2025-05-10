/**
 * Service for handling file operations related to CSV processing
 */
import { csvParse } from '../../csv-processing/services/csv-parser.js';
import { assertNotNull } from '../../../core/utils/asserts.js';
import { isFile } from '../../../core/utils/asserts.js';

/**
 * Handles file change event
 * Clears previous output when a new file is selected
 *
 * @param event The file change event
 */
export const handleFileChange = (event: Event) => {
  const outputDiv = document.getElementById('output-div');
  if (outputDiv) {
    outputDiv.remove();
  }
};

/**
 * Reads a file and returns its contents as text
 *
 * @param file The file to read
 * @returns A promise resolving to the file contents as text
 */
export const readFileAsText = async (file: File): Promise<string> => {
  if (!isFile(file)) {
    throw new Error('Invalid file object');
  }
  return await file.text();
};

/**
 * Creates a CSV file from parsed data
 *
 * @param csvData The parsed CSV data as a 2D string array
 * @param filename The name for the file (default: 'processed.csv')
 * @returns A File object containing the CSV data
 */
export const createCsvFile = (csvData: string[][], filename = 'processed.csv'): File => {
  assertNotNull(csvData);
  const csvString = csvData.map((row) => row.join(',')).join('\n');
  return new File([csvString], filename, { type: 'text/csv' });
};

/**
 * Generates a processed filename based on the original filename
 *
 * @param originalFilename The original filename
 * @returns A new filename with "-processed" appended before the extension
 */
export const getProcessedFilename = (originalFilename: string): string => {
  // Handle cases where the filename might not have an extension
  if (!originalFilename || originalFilename.trim() === '') {
    return 'processed.csv';
  }

  // Extract the basename and extension
  const lastDotIndex = originalFilename.lastIndexOf('.');

  if (lastDotIndex === -1) {
    // No extension found
    return `${originalFilename}-processed.csv`;
  }

  const basename = originalFilename.substring(0, lastDotIndex);
  const extension = originalFilename.substring(lastDotIndex);

  // Make sure we maintain the .csv extension
  const finalExtension = extension.toLowerCase() === '.csv' ? extension : '.csv';

  return `${basename}-processed${finalExtension}`;
};
