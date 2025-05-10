/**
 * Tests for the CSV parser functionality
 */
import { describe, it, expect } from 'vitest';
import { csvParse } from '../services/csv-parser.js';

describe('csvParse function', () => {
  // Basic parsing test
  it('should parse a valid HSBC CSV and return expected Xero format', () => {
    const input = `World Business MasterCard xxxx-xxxx-xxxx-1234
Post Date,Transaction Date,Description,Foreign Amount,Amount(HKD)
2023-04-01,2023-03-31,SUPERMARKET ABC,,100.00
2023-04-02,2023-04-01,RESTAURANT XYZ,,250.50
2023-04-03,2023-04-02,PAYMENT - THANK YOU,,1000.00`;

    const expected = [
      ['Date', 'Amount', 'Payee', 'Description'],
      ['2023-04-01', '-100.00', '', 'SUPERMARKET ABC '],
      ['2023-04-02', '-250.50', '', 'RESTAURANT XYZ '],
      ['2023-04-03', '1000.00', '', 'PAYMENT - THANK YOU '],
    ];

    const result = csvParse(input);
    expect(result).toEqual(expected);
  });

  // Test handling of empty input
  it('should throw an error when given an empty string', () => {
    expect(() => csvParse('')).toThrow('CSV content cannot be empty');
  });

  // Test handling of RETURN transactions
  it('should handle RETURN transactions with positive amounts', () => {
    const input = `World Business MasterCard xxxx-xxxx-xxxx-1234
Post Date,Transaction Date,Description,Foreign Amount,Amount(HKD)
2023-04-01,2023-03-31,RETURN: SOME STORE,,50.00`;

    const result = csvParse(input);
    expect(result[1][1]).toBe('50.00'); // Amount should be positive
  });

  // Test handling of PAYMENT transactions
  it('should handle PAYMENT transactions with positive amounts', () => {
    const input = `World Business MasterCard xxxx-xxxx-xxxx-1234
Post Date,Transaction Date,Description,Foreign Amount,Amount(HKD)
2023-04-01,2023-03-31,PAYMENT - THANK YOU,,1000.00`;

    const result = csvParse(input);
    expect(result[1][1]).toBe('1000.00'); // Amount should be positive
  });

  // Test handling of regular purchases
  it('should convert regular purchases to negative amounts', () => {
    const input = `World Business MasterCard xxxx-xxxx-xxxx-1234
Post Date,Transaction Date,Description,Foreign Amount,Amount(HKD)
2023-04-01,2023-03-31,ONLINE SHOP,,200.00`;

    const result = csvParse(input);
    expect(result[1][1]).toBe('-200.00'); // Amount should be negative
  });

  // Test handling of invalid data
  it('should handle invalid data gracefully', () => {
    const input = `World Business MasterCard xxxx-xxxx-xxxx-1234
Post Date,Transaction Date,Description,Foreign Amount,Amount(HKD)
2023-04-01,2023-03-31,Invalid Row`;

    expect(() => csvParse(input)).not.toThrow();
  });

  // Test handling of inconsistent columns
  it('should handle inconsistent column counts in the CSV', () => {
    const input = `World Business MasterCard xxxx-xxxx-xxxx-1234
Post Date,Transaction Date,Description,Foreign Amount,Amount(HKD)
2023-04-01,2023-03-31,STORE WITH COMMA, INC,,300.00`;

    expect(() => csvParse(input)).not.toThrow();
  });

  // Test handling of empty rows
  it('should handle empty rows in the CSV', () => {
    const input = `World Business MasterCard xxxx-xxxx-xxxx-1234
Post Date,Transaction Date,Description,Foreign Amount,Amount(HKD)
2023-04-01,2023-03-31,STORE A,,100.00

2023-04-03,2023-04-02,STORE B,,200.00`;

    const result = csvParse(input);
    expect(result.length).toBe(3); // Header + 2 data rows (empty row skipped)
  });

  // Test output structure
  it('should always return the expected Xero CSV structure', () => {
    const input = `World Business MasterCard xxxx-xxxx-xxxx-1234
Post Date,Transaction Date,Description,Foreign Amount,Amount(HKD)
2023-04-01,2023-03-31,STORE A,,100.00`;

    const result = csvParse(input);

    // Check header
    expect(result[0]).toEqual(['Date', 'Amount', 'Payee', 'Description']);

    // Check data row structure
    expect(result[1].length).toBe(4);
    expect(typeof result[1][0]).toBe('string'); // Date
    expect(typeof result[1][1]).toBe('string'); // Amount
    expect(typeof result[1][2]).toBe('string'); // Payee
    expect(typeof result[1][3]).toBe('string'); // Description
  });
});
