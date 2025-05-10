/**
 * Detects if the user is using a modern browser and shows a warning if not
 */

/**
 * Checks if the current browser is supported
 *
 * @returns true if the browser is supported, false otherwise
 */
function isModernBrowser(): boolean {
  // Feature detection for modern browsers
  const supportsES6 = () => {
    try {
      new Function('() => {}');
      return true;
    } catch (e) {
      return false;
    }
  };

  const supportsModernFeatures = () => {
    return (
      // Check if fetch exists in the global context
      'fetch' in window &&
      typeof Promise === 'function' &&
      typeof Symbol === 'function' &&
      typeof URL === 'function' &&
      Array.prototype.includes !== undefined &&
      'values' in Object &&
      window.Intl !== undefined
    );
  };

  return supportsES6() && supportsModernFeatures();
}

/**
 * Displays a warning if the browser is not supported
 */
export function checkBrowserCompatibility(): void {
  if (!isModernBrowser()) {
    // Create warning element
    const warning = document.createElement('div');
    warning.className = 'browser-warning alert alert-danger';
    warning.innerHTML = `
      <h4>Unsupported Browser Detected</h4>
      <p>This application requires a modern browser to function correctly.</p>
      <p>Please use one of the following browsers:</p>
      <ul>
        <li>Google Chrome (latest 2 versions)</li>
        <li>Mozilla Firefox (latest 2 versions)</li>
        <li>Apple Safari (latest 2 versions)</li>
        <li>Microsoft Edge (latest 2 versions)</li>
      </ul>
    `;

    // Add to page
    document.body.insertBefore(warning, document.body.firstChild);

    console.warn('Unsupported browser detected. Some features may not work correctly.');
  }
}
