/**
 * Security utility functions for protecting against common web vulnerabilities
 */

/**
 * Generates a random token for CSRF protection
 *
 * @returns A random string to be used as a CSRF token
 */
export function generateCsrfToken(): string {
  // Create array of random values
  const randomValues = new Uint8Array(32);
  // Fill with cryptographically strong random values
  window.crypto.getRandomValues(randomValues);
  // Convert to a string token
  return Array.from(randomValues)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Sets a CSRF token in local storage and as a meta tag
 * This helps protect form submissions from CSRF attacks
 */
export function setupCsrfProtection(): void {
  // Only run in browser environment
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  // Generate a new token
  const csrfToken = generateCsrfToken();

  // Store in localStorage (or sessionStorage for more security)
  localStorage.setItem('csrf_token', csrfToken);

  // Add as a meta tag for use in forms
  const metaTag = document.createElement('meta');
  metaTag.name = 'csrf-token';
  metaTag.content = csrfToken;
  document.head.appendChild(metaTag);
}

/**
 * Validates a form submission against the stored CSRF token
 *
 * @param formToken The token from the form submission
 * @returns Boolean indicating if the token is valid
 */
export function validateCsrfToken(formToken: string): boolean {
  // Get the stored token
  const storedToken = localStorage.getItem('csrf_token');

  // Token should exist and match
  return !!storedToken && storedToken === formToken;
}

/**
 * Adds a hidden CSRF token field to a form
 *
 * @param form The form element to add the token to
 */
export function addCsrfTokenToForm(form: HTMLFormElement): void {
  // Get token from meta tag or storage
  const token =
    document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ||
    localStorage.getItem('csrf_token') ||
    generateCsrfToken();

  // Create hidden input for the token
  const tokenInput = document.createElement('input');
  tokenInput.type = 'hidden';
  tokenInput.name = 'csrf_token';
  tokenInput.value = token;

  // Add to form
  form.appendChild(tokenInput);
}
