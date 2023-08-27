import { assertNotNull } from "./asserts.js";

export function createSampleTable(outputDiv: Element, csvData: string[][]) {
    const table = outputDiv.appendChild(document.createElement('table'));
    assertNotNull(table);
    table.id = 'sample-data';
    table.className = 'table.mb-3';
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
}
