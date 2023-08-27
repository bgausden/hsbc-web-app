import { csvParse } from "./csv-functions.js";
import './style-loader.mjs'

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

export function isFileList(arg: unknown): asserts arg is FileList {
  if (!(arg instanceof FileList) && (arg instanceof Object && Object.keys(arg).length === 0)) {
    throw new Error('Element is not a FileList!');
  }
}

export function isFile(arg: unknown): arg is File {
  return arg instanceof File
}

export function EntryPoint() {
  // Get the file input element from the HTML document
  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

  // Listen for the form submission event
  const possibleForm = document.querySelector('#fileSelect');
  isForm(possibleForm)
  possibleForm.addEventListener('submit', async (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Get the uploaded file
    const fileList = fileInput.files;
    isFileList(fileList)
    const file = fileList[0];
    if (!isFile(file)) { return }

    // Read the contents of the file
    const fileContents = await file.text();

    // Process the file contents as needed
    //const processedContents = fileContents.toUpperCase();
    // const reader = new (FileReader);
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

    const topContainer = document.querySelector('#top-container')
    assertNotNull(topContainer)

    topContainer.appendChild(document.createElement('div')).className = "mb-3"

    const sampleDataDiv = topContainer.appendChild(document.createElement('div'))
    sampleDataDiv.id = 'sample-data-div'
    sampleDataDiv.className = 'mb-3'

    // Create a heading for the sample data
    const sampleDataHeading = document.createElement('h5');
    sampleDataHeading.textContent = 'Sample data';
    sampleDataDiv.appendChild(sampleDataHeading);

    // Create a table to display a sample of the data
    const table = sampleDataDiv.appendChild(document.createElement('table'))
    assertNotNull(table)
    table.id = 'sample-data'
    table.className = 'table.mb-3'
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

    topContainer.appendChild(document.createElement('div')).className = "mb-3"

    const downloadButton = document.createElement('button');
    downloadButton.textContent = 'Download File';
    downloadButton.className = 'btn btn-primary'
    downloadButton.addEventListener('click', () => {
      window.location.href = downloadLink.href;
    });
    topContainer.appendChild(downloadButton);

    topContainer.appendChild(document.createElement('br'));

  })
}

if (typeof window !== "undefined" && typeof window.document !== "undefined") {
  // We are in the browser
  EntryPoint();
}