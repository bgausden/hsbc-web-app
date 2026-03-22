import { describe, it, expect } from 'vitest';
import { csvParse } from '../src/csv-functions.js';

// HSBC CSV always starts with a title row
const TITLE = 'World Business MasterCard xxxx-xxxx-xxxx-1234';
const HEADER = 'Post Date,Transaction Date,Description,Foreign CCY Amt,Amount(HKD)';

function makeCSV(...rows: string[]): string {
  return [TITLE, HEADER, ...rows].join('\n');
}

describe('csvParse', function () {
  describe('normal row (no comma in description)', function () {
    it('parses amount and description correctly', function () {
      const csv = makeCSV('15/03/2025,15/03/2025,STARBUCKS COFFEE,,45.00');
      const result = csvParse(csv);
      // result[0] is Xero header, result[1] is first data row
      expect(result[1][1]).toBe('-45.00');             // negative purchase
      expect(result[1][3]).toBe('STARBUCKS COFFEE ');  // description + foreign amt
    });
  });

  describe('description with a single comma', function () {
    it('parses amount correctly when description contains one comma', function () {
      const csv = makeCSV('15/03/2025,15/03/2025,MERCHANT, EXTRA,,45.00');
      const result = csvParse(csv);
      expect(result[1][1]).toBe('-45.00');
      expect(result[1][3]).toContain('MERCHANT');
    });
  });

  describe('description with multiple commas', function () {
    it('parses amount correctly when description contains two commas', function () {
      const csv = makeCSV('15/03/2025,15/03/2025,A, B, C,,45.00');
      const result = csvParse(csv);
      expect(result[1][1]).toBe('-45.00');
      expect(result[1][3]).toContain('A');
    });
  });

  describe('payment row', function () {
    it('keeps payment amount positive', function () {
      const csv = makeCSV('15/03/2025,15/03/2025,PAYMENT - THANK YOU,,1000.00');
      const result = csvParse(csv);
      expect(result[1][1]).toBe('1000.00');
    });

    it('handles HSBC payment rows with trailing CR column', function () {
      const csv = makeCSV('15/03/2025,15/03/2025,PAYMENT - THANK YOU,,21047.34,CR');
      const result = csvParse(csv);
      expect(result[1][0]).toBe('15/03/2025');
      expect(result[1][1]).toBe('21047.34');
      expect(result[1][2]).toBe('');
      expect(result[1][3]).toContain('PAYMENT - THANK YOU');
    });
  });
});
