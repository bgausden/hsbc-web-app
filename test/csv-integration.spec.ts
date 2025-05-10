import { describe, it, expect, assert } from 'vitest';
import { csvParse } from '../src/csv-functions.js';

// Mock a sample CSV file for testing
const mockCsvContent = `World Business MasterCard xxxx-xxxx-xxxx-1234
Post Date,Transaction Date,Description,Foreign Amount,Amount(HKD)
2023-04-01,2023-03-31,SHOP ONE,,100.00
2023-04-02,2023-04-01,SHOP TWO,,200.00
2023-04-03,2023-04-02,PAYMENT - THANK YOU,,1000.00`;

describe('CSV Parser Integration', () => {
  // Test the complete parsing pipeline
  it('should convert HSBC CSV to Xero CSV format', () => {
    const result = csvParse(mockCsvContent);

    // Verify output structure matches Xero format
    expect(result[0]).toEqual(['Date', 'Amount', 'Payee', 'Description']);

    // Verify transaction data conversion
    expect(result.length).toBe(4); // Header + 3 transactions

    // Verify amount signs are correct
    expect(result[1][1]).toBe('-100.00'); // Regular purchase (negative)
    expect(result[2][1]).toBe('-200.00'); // Regular purchase (negative)
    expect(result[3][1]).toBe('1000.00'); // Payment (positive)
  });

  // Test data transformation for Xero compatibility
  it('should transform data to be Xero compatible', () => {
    const result = csvParse(mockCsvContent);

    // Check that the structure matches what Xero expects
    expect(result[0][0]).toBe('Date');
    expect(result[0][1]).toBe('Amount');
    expect(result[0][2]).toBe('Payee');
    expect(result[0][3]).toBe('Description');

    // Check that each transaction row has the right format
    result.slice(1).forEach((row) => {
      // Each row should have exactly 4 elements
      expect(row.length).toBe(4);

      // Amounts should be properly formatted
      if (!row[1].startsWith('-') && !row[3].includes('PAYMENT - THANK YOU')) {
        // Regular purchases should be negative
        assert.fail('Regular purchases should have negative amounts');
      }
    });
  });

  // Test resilience against malformed input
  it('should be resilient to typical CSV formatting issues', () => {
    // Create a simple malformed CSV that the parser can handle
    const malformedCsv = `World Business MasterCard xxxx-xxxx-xxxx-1234
Post Date,Transaction Date,Description,Foreign Amount,Amount(HKD)
2023-04-01,2023-03-31,Description,,100.00
2023-04-02,,,,
2023-04-03,2023-04-02,Description with spaces,,300.00`;

    // Should not throw on this simplified malformed input
    expect(() => csvParse(malformedCsv)).not.toThrow();

    // Should still produce some valid output
    const result = csvParse(malformedCsv);
    expect(result.length).toBeGreaterThan(1);
  });
});
