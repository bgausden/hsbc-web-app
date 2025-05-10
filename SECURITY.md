# Security Measures in HSBC to Xero CSV Converter

This document outlines the security measures implemented in the HSBC to Xero CSV converter application to protect against common web vulnerabilities.

## Client-Side Security Measures

### 1. Content Security Policy (CSP)

A comprehensive Content Security Policy has been implemented through HTTP headers in the Vercel configuration:

- `default-src 'self'`: Restricts resources to be loaded only from the same origin
- `script-src 'self'`: Restricts scripts to be executed only from the same origin
- `style-src 'self' 'unsafe-inline'`: Allows styles from the same origin and inline styles
- `img-src 'self' data:`: Restricts images to be loaded only from the same origin or data URIs
- `object-src 'none'`: Prevents plugins from being loaded
- `base-uri 'self'`: Restricts base URIs to the same origin
- `form-action 'self'`: Restricts form submissions to the same origin
- `font-src 'self'`: Restricts fonts to be loaded only from the same origin
- `connect-src 'self'`: Restricts network connections to the same origin

### 2. Browser Compatibility and Feature Detection

The application implements browser compatibility checks using feature detection instead of user-agent sniffing. This ensures that only browsers with modern security features are used.

### 3. Cross-Site Request Forgery (CSRF) Protection

- CSRF tokens are generated using the Web Crypto API for cryptographically strong random values
- Tokens are stored in localStorage and as a meta tag
- Forms are automatically populated with CSRF tokens
- Token validation occurs during form submission

### 4. Input Validation and Sanitization

#### File Validation

- File extension validation (.csv)
- MIME type validation (text/csv, application/csv, etc.)
- File size validation (maximum 5MB)
- Content validation to ensure data appears to be CSV

#### Data Sanitization

- All CSV data is sanitized to prevent XSS attacks
- HTML entity encoding for special characters
- Type-specific sanitization based on column content (dates, amounts, text)
- DOM manipulation uses safe methods (textContent instead of innerHTML)

### 5. Secure File Downloads

- Files are downloaded using temporary object URLs
- URLs are properly revoked after download
- Appropriate download attributes are set on anchor elements
- Proper MIME types are enforced

### 6. Additional HTTP Security Headers

The following security headers are implemented:

- `X-Content-Type-Options: nosniff`: Prevents MIME type sniffing
- `X-Frame-Options: DENY`: Prevents clickjacking by disallowing framing
- `X-XSS-Protection: 1; mode=block`: Enables browser XSS protection
- `Referrer-Policy: strict-origin-when-cross-origin`: Controls referrer information
- `Permissions-Policy`: Restricts browser features (camera, microphone, geolocation)

## Best Practices for Using This Application

1. **Keep your browser updated**: This application requires a modern browser with current security features.
2. **Use caution with sensitive data**: While this application processes data locally and doesn't send it to any server, always be careful with financial data.
3. **Verify processed data**: Always review the generated output before importing into Xero.
4. **Report security issues**: If you discover any security vulnerabilities, please report them to the maintainers.

## Potential Future Security Enhancements

1. **Subresource Integrity (SRI)** for external resources
2. **Offline support** using Service Workers
3. **Input validation enhancement** for specific HSBC CSV formats
4. **Enhanced error logging** with privacy considerations
5. **Improved data validation** for Xero compatibility

## Responsible Disclosure

If you discover a security vulnerability, please contact the maintainers directly rather than creating a public issue.
