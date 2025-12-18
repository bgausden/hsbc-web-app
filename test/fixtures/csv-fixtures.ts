import * as fs from 'fs';
import * as path from 'path';

/**
 * Load a CSV fixture file
 * @param filename - The CSV filename in the fixtures directory
 * @returns The CSV content as a string
 */
export function loadCsvFixture(filename: string): string {
  const fixturePath = path.join(__dirname, filename);
  return fs.readFileSync(fixturePath, 'utf8');
}

/**
 * Get sample CSV rows for testing
 */
export const sampleCsvRows = {
  // Normal transaction with foreign currency
  normalWithForeign: '12 May 2025,11 May 2025,SALES: GR DIGITAL BETHESDA US,USD 99.00,785.16',

  // Transaction without foreign currency
  normalWithoutForeign: '12 May 2025,10 May 2025,SALES: APPLE.COM/BILL ITUNES.COM IE,,78.00',

  // Payment transaction (should remain positive)
  payment: '10 Jun 2025,10 Jun 2025,PAYMENT - THANK YOU,,18490.36',

  // Transaction with comma in description (like MINDBODY, INC.)
  commaInDescription:
    '22 May 2025,21 May 2025,SALES: MINDBODY, INC. SAN LUIS OBISUS,USD 299.00,2386.79',

  // Annual fee transaction
  annualFee: '16 May 2025,16 May 2025,A/C ANNUAL FEE,,898.33',
};

/**
 * Load the full HSBC CSV fixture
 */
export function loadHsbcCsvFixture(): string {
  return loadCsvFixture('1519.csv');
}

/**
 * Get individual transaction lines from the CSV (excluding headers and metadata)
 */
export function getTransactionLines(): string[] {
  const csvContent = loadHsbcCsvFixture();
  const lines = csvContent.split('\n');

  // Filter to keep only lines that begin with a date in format "dd MMM yyyy"
  const datePattern = /^\d{1,2}\s+[A-Za-z]{3}\s+\d{4}/;

  return lines.filter((line) => {
    const trimmed = line.trim();
    return trimmed && datePattern.test(trimmed);
  });
}
