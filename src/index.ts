/**
 * Main application entry point
 * Initializes the application and sets up event listeners
 */
import { handleSubmit, handleFileChange } from './ui/components/index.js';
import { isForm } from './core/utils/asserts.js';
import 'bootstrap';
import './index.scss';

/**
 * Entry point function that sets up event listeners
 */
export function EntryPoint() {
  // Listen for the form submission event
  const form = document.querySelector('#fileSelect');
  isForm(form);
  form.addEventListener('submit', handleSubmit);

  const input = document.querySelector('#formFile') as HTMLInputElement;
  if (input) {
    input.addEventListener('change', handleFileChange);
  } else {
    console.error('File input element not found');
  }
}

if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
  // We are in the browser
  EntryPoint();
}
