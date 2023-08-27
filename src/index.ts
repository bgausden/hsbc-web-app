import { handleSubmit } from "./handleSubmit.js";
import { isForm, isHTMLInputElement } from "./asserts.js";
import "./style-loader.mjs"; // just so webpack includes bootstrap css in the bundle
import { handleFileChange } from "./handleFileChange.js";

export function EntryPoint() {
  // Listen for the form submission event
  const form = document.querySelector('#fileSelect');
  isForm(form)
  form.addEventListener('submit', handleSubmit)

  const input = document.querySelector('#formFile');
  isHTMLInputElement(input)
  input.addEventListener('change', handleFileChange);
}

if (typeof window !== "undefined" && typeof window.document !== "undefined") {
  // We are in the browser
  EntryPoint();
}