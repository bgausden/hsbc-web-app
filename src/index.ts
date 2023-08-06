// Get the file input element from the HTML document
const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

// Listen for the form submission event
document.querySelector('form').addEventListener('submit', async (event) => {
  // Prevent the default form submission behavior
  event.preventDefault();

  // Get the uploaded file
  const file = fileInput.files[0];

  // Read the contents of the file
  const fileContents = await file.text();

  // Process the file contents as needed
  const processedContents = fileContents.toUpperCase();

  // Create a new file with the processed contents
  const processedFile = new File([processedContents], 'processed.txt', { type: 'text/plain' });

  // Create a download link for the processed file
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(processedFile);
  downloadLink.download = processedFile.name;
  downloadLink.textContent = 'Download processed file';

  // Append the download link to the HTML document
  document.body.appendChild(downloadLink);
});