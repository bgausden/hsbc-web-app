import { csvParse } from "./csv-functions.js";
import { isHTMLInputElement, isFileList, isFile } from "./asserts.js";
import { createSampleTable } from "./createSampleTable.js";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function showError(container: Element, message: string): void {
    const alert = document.createElement('div');
    alert.className = 'alert alert-danger';
    alert.setAttribute('role', 'alert');
    alert.textContent = message;
    container.appendChild(alert);
}

function formatFileSize(bytes: number): string {
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

export const handleSubmit =
    async (event: SubmitEvent) => {
        event.preventDefault();

        const outputRegion = document.getElementById('output-region');
        if (!outputRegion) return;

        // Clear previous output
        outputRegion.innerHTML = '';

        // Show loading state
        const form = event.target as HTMLFormElement;
        const submitBtn = form.querySelector<HTMLInputElement>('[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.value = 'Processing…';
        }

        try {
            const fileInput = document.querySelector('input[type="file"]');
            isHTMLInputElement(fileInput);

            const fileList = fileInput.files;
            isFileList(fileList);
            const file = fileList[0];

            if (!isFile(file)) {
                showError(outputRegion, 'No file selected. Please choose a CSV file.');
                return;
            }

            if (file.size > MAX_FILE_SIZE) {
                showError(outputRegion, `File is too large (${formatFileSize(file.size)}). Maximum allowed size is 10MB.`);
                return;
            }

            const fileContents = await file.text();
            const csvData = csvParse(fileContents);

            if (!csvData || csvData.length === 0) {
                showError(outputRegion, 'The file could not be parsed. Please check it is a valid HSBC CSV statement.');
                return;
            }

            // Build output container
            const container = document.createElement('div');

            // Row count summary (csvData includes header row)
            const rowCount = csvData.length - 1;
            const previewCount = Math.min(rowCount, 19);
            const summary = document.createElement('p');
            summary.className = 'text-body-secondary mb-3';
            summary.textContent = rowCount === 0
                ? 'No transactions found in the file.'
                : `Processed ${rowCount} transaction${rowCount !== 1 ? 's' : ''}. Showing first ${previewCount} row${previewCount !== 1 ? 's' : ''}.`;
            container.appendChild(summary);

            // Sample data section
            const sampleHeading = document.createElement('h2');
            sampleHeading.className = 'mb-3';
            sampleHeading.textContent = 'Sample data';
            container.appendChild(sampleHeading);
            container.appendChild(createSampleTable(csvData));

            // Download link — uses <a download> to avoid page navigation and revokes URL after click
            const csvString = csvData.map(row => row.join(',')).join('\n');
            const blob = new Blob([csvString], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);

            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = 'processed.csv';
            downloadLink.className = 'btn btn-primary mt-3';
            downloadLink.textContent = 'Download File';
            downloadLink.addEventListener('click', () => {
                setTimeout(() => URL.revokeObjectURL(url), 100);
            });
            container.appendChild(downloadLink);

            outputRegion.appendChild(container);

        } catch (err) {
            const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
            showError(outputRegion, `Failed to process file: ${message}`);
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.value = 'Process File';
            }
        }
    };
