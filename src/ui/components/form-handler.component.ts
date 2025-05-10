/**
 * Form submission and handling for CSV processing
 */
import { csvParse } from '../../features/csv-processing/services/csv-parser.js';
import {
  createCsvFile,
  readFileAsText,
  getProcessedFilename,
} from '../../features/file-handling/services/file-operations.js';
import {
  isValidCsvFile,
  isAcceptableFileSize,
  hasValidCsvContent,
} from '../../features/file-handling/services/file-validation.js';
import { isFileList, assertNotNull, isHTMLInputElement } from '../../core/utils/asserts.js';
import { createSampleTable } from './sample-table.component.js';

/**
 * Handles form submission for CSV processing
 *
 * @param event The submit event from the form
 */
export const handleSubmit = async (event: SubmitEvent): Promise<void> => {
  // Prevent the default form submission behavior
  event.preventDefault();

  // Get the file input element from the HTML document
  const fileInput = document.querySelector('input[type="file"]');
  if (!fileInput) {
    throw new Error('File input element not found');
  }
  isHTMLInputElement(fileInput);

  // Remove #output-div if it exists
  let outputDiv = document.querySelector('#output-div');
  if (outputDiv) {
    outputDiv.remove();
  }

  // Get the uploaded file
  isHTMLInputElement(fileInput);
  const fileList = fileInput.files;
  isFileList(fileList);
  const file = fileList[0];

  if (!file) {
    alert('Please select a file to process');
    return;
  }

  // Security validation for file type and size
  if (!isValidCsvFile(file)) {
    alert('Please select a valid CSV file');
    return;
  }

  if (!isAcceptableFileSize(file)) {
    alert('File is too large. Please select a file smaller than 5MB');
    return;
  }

  try {
    // Read the contents of the file
    const fileContents = await readFileAsText(file);

    // Validate file content format
    if (!hasValidCsvContent(fileContents)) {
      alert('The file does not appear to contain valid CSV data');
      return;
    }

    // Process the file contents and parse CSV
    const csvData = csvParse(fileContents);
    assertNotNull(csvData);

    // Create a processed CSV file with a modified name based on original file
    const processedFilename = getProcessedFilename(file.name);
    const processedFile = createCsvFile(csvData, processedFilename);

    // Create and show output UI
    createOutputUI(csvData, processedFile);
  } catch (error) {
    console.error('Error processing file:', error);
    alert(`Error processing file: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Creates the output UI to display sample data and download button
 *
 * @param csvData The processed CSV data
 * @param processedFile The file object containing the processed CSV
 */
function createOutputUI(csvData: string[][], processedFile: File): void {
  const topContainer = document.querySelector('#top-container');
  assertNotNull(topContainer);

  topContainer.appendChild(document.createElement('div')).className = 'mb-3';

  let outputDiv = topContainer.appendChild(document.createElement('div'));
  outputDiv.id = 'output-div';
  outputDiv.className = 'mb-3';

  outputDiv = outputDiv.appendChild(document.createElement('div'));
  outputDiv.id = 'sample-data-div';
  outputDiv.className = 'mb-3';

  // Create a heading for the sample data
  const sampleDataHeading = document.createElement('h5');
  sampleDataHeading.textContent = 'Sample data';
  outputDiv.appendChild(sampleDataHeading);

  // Create a table to display a sample of the data
  outputDiv.appendChild(createSampleTable(csvData));

  outputDiv.appendChild(document.createElement('div')).className = 'mb-3';

  // Create download button
  const downloadButton = document.createElement('button');
  downloadButton.textContent = 'Download File';
  downloadButton.className = 'btn btn-primary';
  downloadButton.addEventListener('click', () => {
    // Create a secure download link with proper attributes
    const downloadLink = document.createElement('a');
    const objectUrl = URL.createObjectURL(processedFile);

    // Set up download attributes
    downloadLink.href = objectUrl;
    downloadLink.download = processedFile.name;
    downloadLink.rel = 'noopener noreferrer';

    // Append temporarily, click, and remove
    document.body.appendChild(downloadLink);
    downloadLink.click();

    // Clean up to avoid memory leaks
    setTimeout(() => {
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(objectUrl);
    }, 100);
  });
  outputDiv.appendChild(downloadButton);

  outputDiv.appendChild(document.createElement('br'));
}

/**
 * Handles file change event
 * Clears previous output when a new file is selected
 *
 * @param event The file change event
 */
export const handleFileChange = (event: Event): void => {
  const outputDiv = document.getElementById('output-div');
  if (outputDiv) {
    outputDiv.remove();
  }
};
