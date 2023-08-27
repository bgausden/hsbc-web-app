import { handleSubmit } from "./handleSubmit.js";
import { isForm } from "./asserts.js";
import "./style-loader.mjs"; // just so webpack includes bootstrap css in the bundle

export function EntryPoint() {


  // Listen for the form submission event
  const form = document.querySelector('#fileSelect');
  isForm(form)
  form.addEventListener('submit', handleSubmit)
}

if (typeof window !== "undefined" && typeof window.document !== "undefined") {
  // We are in the browser
  EntryPoint();
}