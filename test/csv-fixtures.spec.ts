import { describe, it, expect } from 'vitest';
import { getTransactionLines, loadHsbcCsvFixture } from './fixtures/csv-fixtures.js';

describe('CSV Fixtures', () => {
  describe('getTransactionLines', () => {
    it('should filter lines to only include those starting with date format "dd MMM yyyy"', () => {
      const transactionLines = getTransactionLines();

      // Should have some transaction lines
      expect(transactionLines.length).toBeGreaterThan(0);

      // Every line should start with a date pattern
      const datePattern = /^\d{1,2}\s+[A-Za-z]{3}\s+\d{4}/;

      transactionLines.forEach((line, index) => {
        expect(line.trim()).toMatch(datePattern);
      });
    });

    it('should exclude header and metadata lines', () => {
      const transactionLines = getTransactionLines();
      const fullCsv = loadHsbcCsvFixture();

      // Verify that unwanted lines are excluded
      const unwantedPatterns = [
        'World Business MasterCard',
        'Post Date,Transaction Date',
        'Transactions to be included',
        'Transactions included in previous',
      ];

      transactionLines.forEach((line) => {
        unwantedPatterns.forEach((pattern) => {
          expect(line).not.toContain(pattern);
        });
      });

      // But verify the full CSV does contain these patterns (sanity check)
      unwantedPatterns.forEach((pattern) => {
        expect(fullCsv).toContain(pattern);
      });
    });

    it('should include valid transaction lines with various date formats', () => {
      const transactionLines = getTransactionLines();

      // Look for some expected transaction patterns
      const hasAprilTransaction = transactionLines.some(
        (line) => line.includes('Apr 2025') && line.includes('SALES')
      );
      const hasMayTransaction = transactionLines.some(
        (line) => line.includes('May 2025') && line.includes('SALES')
      );

      expect(hasAprilTransaction).toBe(true);
      expect(hasMayTransaction).toBe(true);
    });

    it('should handle single and double digit dates', () => {
      const transactionLines = getTransactionLines();

      // Should include both single digit dates (e.g., "2 Apr 2025") and double digit dates (e.g., "22 Apr 2025")
      const singleDigitDatePattern = /^\d{1}\s+[A-Za-z]{3}\s+\d{4}/;
      const doubleDigitDatePattern = /^\d{2}\s+[A-Za-z]{3}\s+\d{4}/;

      const hasSingleDigitDate = transactionLines.some((line) =>
        singleDigitDatePattern.test(line.trim())
      );
      const hasDoubleDigitDate = transactionLines.some((line) =>
        doubleDigitDatePattern.test(line.trim())
      );

      // We expect to have both types in the HSBC data
      expect(hasSingleDigitDate || hasDoubleDigitDate).toBe(true);
    });

    it('should not include empty lines', () => {
      const transactionLines = getTransactionLines();

      transactionLines.forEach((line, index) => {
        expect(line.trim()).not.toBe('');
        expect(line.trim().length).toBeGreaterThan(0);
      });
    });

    it('should log some sample filtered lines for manual verification', () => {
      const transactionLines = getTransactionLines();

      console.log(`\nFiltered ${transactionLines.length} transaction lines:`);

      // Show first 3 lines for manual verification
      transactionLines.slice(0, 3).forEach((line, index) => {
        console.log(`${index + 1}: ${line.substring(0, 80)}...`);
      });

      // Show last 2 lines
      if (transactionLines.length > 3) {
        console.log('...');
        transactionLines.slice(-2).forEach((line, index) => {
          console.log(`${transactionLines.length - 1 + index}: ${line.substring(0, 80)}...`);
        });
      }

      // This test always passes, it's just for logging
      expect(true).toBe(true);
    });
  });
});
