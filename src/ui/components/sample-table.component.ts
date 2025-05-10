/**
 * Creates a sample table to display CSV data
 */
import { assertNotNull } from '../../core/utils/asserts.js';
import { sanitizeString } from '../../features/csv-processing/services/sanitization.js';

/**
 * Safely sets text content with sanitization
 *
 * @param element The HTML element to set content on
 * @param content The content to set
 */
function safeSetTextContent(element: HTMLElement, content: string): void {
  // Text content is already safe from XSS, but we sanitize as an extra precaution
  element.textContent = sanitizeString(content);
}

/**
 * Creates a table element to display sample CSV data
 *
 * @param csvData The CSV data as a 2D array of strings
 * @returns An HTML table element populated with the CSV data
 */
export function createSampleTable(csvData: string[][]): HTMLTableElement {
  // Validate input
  assertNotNull(csvData);
  if (!Array.isArray(csvData) || csvData.length === 0) {
    throw new Error('CSV data must be a non-empty array');
  }

  const table = document.createElement('table');
  assertNotNull(table);
  table.id = 'sample-data';
  table.className = 'table table-striped table-bordered mb-3';

  // Create proper table structure
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  thead.appendChild(headerRow);

  // Create a table header for each column with spacing
  for (let i = 0; i < csvData[0].length; i++) {
    const column = csvData[0][i];
    const header = document.createElement('th');
    safeSetTextContent(header, column);
    header.style.padding = '8px';
    header.style.borderSpacing = '0 15px';

    // Right-align the Amount column header
    if (column === 'Amount') {
      header.style.textAlign = 'right';
    }

    headerRow.appendChild(header);
  }

  table.appendChild(thead);

  // Create table body
  const tbody = document.createElement('tbody');

  // Append the first 20 rows to the table
  for (let i = 1; i < 20 && i < csvData.length; i++) {
    const row = csvData[i];
    const rowElement = document.createElement('tr');

    for (let j = 0; j < row.length; j++) {
      const cell = document.createElement('td');
      const columnName = csvData[0][j];

      // Handle Amount column specially
      if (columnName === 'Amount') {
        // Try to parse the amount as a number and format with 2 decimal places
        const value = row[j];
        const numValue = parseFloat(value);

        if (!isNaN(numValue)) {
          safeSetTextContent(cell, numValue.toFixed(2));
        } else {
          safeSetTextContent(cell, value);
        }

        // Right-align the Amount column
        cell.style.textAlign = 'right';
      } else {
        safeSetTextContent(cell, row[j]);
      }

      cell.style.padding = '8px';
      rowElement.appendChild(cell);
    }

    tbody.appendChild(rowElement);
  }

  table.appendChild(tbody);
  return table;
}
