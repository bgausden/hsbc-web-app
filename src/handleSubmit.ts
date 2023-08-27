import { csvParse } from "./csv-functions.js";
import { isHTMLInputElement, isFileList, isFile, assertNotNull } from "./asserts.js";
import { createSampleTable } from "./createSampleTable.js";

export const handleSubmit =
    async (event: SubmitEvent) => {

        // Prevent the default form submission behavior
        event.preventDefault();

        // Get the file input element from the HTML document
        const fileInput = document.querySelector('input[type="file"]');

        isHTMLInputElement(fileInput);

        //Remove #output-div if it exists
        let outputDiv = document.querySelector('#output-div');
        if (outputDiv) {
            outputDiv.remove();
        }

        // Get the uploaded file
        const fileList = fileInput.files;
        isFileList(fileList);
        const file = fileList[0];
        if (!isFile(file)) { return; }

        // Read the contents of the file
        const fileContents = await file.text();

        // Process the file contents as needed
        //const processedContents = fileContents.toUpperCase();
        // const reader = new (FileReader);
        let csvData: string[][] = [];


        csvData = csvParse(fileContents, csvData);

        assertNotNull(csvData);

        const csvString = csvData.map(row => row.join(',')).join('\n');
        // Create a new file with the processed contents
        const processedFile = new File([csvString], 'processed.csv', { type: 'text/csv' });

        const topContainer = document.querySelector('#top-container');
        assertNotNull(topContainer);

        topContainer.appendChild(document.createElement('div')).className = "mb-3";

        outputDiv = topContainer.appendChild(document.createElement('div'));
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
        createSampleTable(outputDiv, csvData);

        outputDiv.appendChild(document.createElement('div')).className = "mb-3";

        const downloadButton = document.createElement('button');
        downloadButton.textContent = 'Download File';
        downloadButton.className = 'btn btn-primary';
        downloadButton.addEventListener('click', () => {
            window.location.href = URL.createObjectURL(processedFile);
        });
        outputDiv.appendChild(downloadButton);

        outputDiv.appendChild(document.createElement('br'));

    };

