import { assertNotNull } from "./asserts.js";

export function createSampleTable(csvData: string[][]): HTMLElement {
    assertNotNull(csvData);
    if (!Array.isArray(csvData) || csvData.length === 0) {
        throw new Error("CSV data must be a non-empty array");
    }

    // No transaction rows — return an empty state message
    if (csvData.length === 1) {
        const empty = document.createElement('p');
        empty.className = 'text-muted fst-italic';
        empty.textContent = 'No transaction rows found.';
        return empty;
    }

    const table = document.createElement("table");
    assertNotNull(table);
    table.id = "sample-data";
    table.className = "table table-striped table-bordered mb-3";

    // Create proper table structure
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    thead.appendChild(headerRow);

    for (let i = 0; i < csvData[0].length; i++) {
        const column = csvData[0][i];
        const header = document.createElement("th");
        header.textContent = column;

        if (column === "Amount") {
            header.className = 'text-end';
        }

        headerRow.appendChild(header);
    }

    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    for (let i = 1; i < 20 && i < csvData.length; i++) {
        const row = csvData[i];
        const rowElement = document.createElement("tr");

        for (let j = 0; j < row.length; j++) {
            const cell = document.createElement("td");
            const columnName = csvData[0][j];

            if (columnName === "Amount") {
                const numValue = parseFloat(row[j]);
                cell.textContent = !isNaN(numValue) ? numValue.toFixed(2) : row[j];
                cell.className = 'text-end';
            } else {
                cell.textContent = row[j];
            }

            rowElement.appendChild(cell);
        }

        tbody.appendChild(rowElement);
    }

    table.appendChild(tbody);
    return table;
}
