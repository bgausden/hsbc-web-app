import { csvParse } from "./csv-functions.js";

function isForm(element: unknown): asserts element is HTMLFormElement {
  if (!(element instanceof HTMLFormElement)) {
    throw new Error('Element is not a form!');
  }
}

function assertNotNull<T>(arg: T): asserts arg is NonNullable<T> {
  if (arg === null || arg === undefined) {
    throw new Error('Element is null or undefined!');
  }
}

function isFileList(arg: unknown): asserts arg is FileList {
  if (!(arg instanceof FileList)) {
    throw new Error('Element is not a FileList!');
  }
}

export function main() {
  // Get the file input element from the HTML document
  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

  // Listen for the form submission event
  const possibleForm = document.querySelector('form');
  isForm(possibleForm)
  possibleForm.addEventListener('submit', async (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Get the uploaded file
    const fileList = fileInput.files;
    isFileList(fileList)
    const file = fileList[0];

    // Read the contents of the file
    const fileContents = await file.text();

    // Process the file contents as needed
    //const processedContents = fileContents.toUpperCase();
    const reader = new (FileReader);
    let csvData: string[][] = []


    csvData = csvParse(fileContents, csvData)

    assertNotNull(csvData)

    const csvString = csvData.map(row => row.join(',')).join('\n');
    // Create a new file with the processed contents
    const processedFile = new File([csvString], 'processed.csv', { type: 'text/csv' });

    // Create a download link for the processed file
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(processedFile);
    downloadLink.download = processedFile.name;
    downloadLink.textContent = 'Download processed file';

    document.body.appendChild(document.createElement('br'));

    // Create a heading for the sample data
    const sampleDataHeading = document.createElement('h2');
    sampleDataHeading.textContent = 'Sample data';
    document.body.appendChild(sampleDataHeading);

    // Create a table to display a sample of the data
    const table = document.body.appendChild(document.createElement('table'))
    assertNotNull(table)
    table.id = 'sample-data'
    table.className = 'table'
    table.appendChild(document.createElement('thead'));
    table.appendChild(document.createElement('tr'));

    // Create a table header for each column
    for (const column of csvData[0]) {
      const header = document.createElement('th');
      header.textContent = column;
      table.appendChild(header);
    }

    // Append the first 20 rows to the table
    for (let i = 1; i < 20 && i < csvData.length; i++) {
      const row = csvData[i];
      const rowElement = document.createElement('tr');
      for (const column of row) {
        const cell = document.createElement('td');
        cell.textContent = column;
        rowElement.appendChild(cell);
      }
      table.appendChild(rowElement);
    }

    document.body.appendChild(document.createElement('br'));






/*     // Append the first 20 lines to the document body
    for (let i = 0; i < 20 && i < processedFileLines.length; i++) {
      const line = processedFileLines[i];
      const lineElement = document.createElement('p');
      lineElement.textContent = line;
      document.body.appendChild(lineElement);
    } */

    // Append the download link to the HTML document
    document.body.appendChild(downloadLink);

    document.body.appendChild(document.createElement('br'));

  })
}

main()