import { describe, it, expect } from 'vitest';
import { handleCommaInDescription } from '../src/features/csv-processing/services/csv-helpers.js';
import { getTransactionLines } from './fixtures/csv-fixtures.js';

describe('handleCommaInDescription - Real CSV Data', () => {
  it('should process real HSBC transaction lines without errors', () => {
    const transactionLines = getTransactionLines();

    // Filter for lines that likely have commas in description (more than 5 fields when split)
    const linesWithCommas = transactionLines.filter((line) => line.split(',').length > 5);

    console.log(
      `Found ${linesWithCommas.length} lines with potential comma issues out of ${transactionLines.length} total lines`
    );

    if (linesWithCommas.length > 0) {
      console.log('Sample lines with commas:');
      linesWithCommas.slice(0, 3).forEach((line, index) => {
        console.log(`${index + 1}: ${line.substring(0, 80)}...`);
      });

      // Filter for lines that actually have comma-in-description issues
      // These are lines that start with "SALES:" and have commas in the description
      const actualCommaInDescriptionLines = linesWithCommas.filter((line) => {
        const fields = line.split(',');
        // Look for lines where field 2 (description) contains "SALES:" and there are extra fields
        return fields[2]?.includes('SALES:') && fields.length > 5;
      });

      console.log(
        `Found ${actualCommaInDescriptionLines.length} lines with actual comma-in-description issues`
      );

      // Also process payment lines that have CR indicators
      const paymentLinesWithCR = linesWithCommas.filter((line) => {
        const fields = line.split(',');
        return fields[2]?.includes('PAYMENT') && fields[fields.length - 1]?.trim() === 'CR';
      });

      console.log(`Found ${paymentLinesWithCR.length} payment lines with CR indicators`);

      // Process all problematic lines (both comma-in-description and payment lines)
      const allProblematicLines = [...actualCommaInDescriptionLines, ...paymentLinesWithCR];

      // Test processing each problematic line
      allProblematicLines.forEach((line, index) => {
        try {
          const result = handleCommaInDescription(line);
          console.log(`Processed line ${index + 1}: ${result.substring(0, 80)}...`);
        } catch (error) {
          console.log(`Failed to process line ${index + 1}:`);
          console.log(`  Raw: ${line}`);
          const fields = line.split(',');
          console.log(
            `  Fields(${fields.length}): [${fields.map((f, idx) => `${idx}:'${f}'`).join(', ')}]`
          );
          console.log(`  Error: ${error.message}`);
          throw error;
        }
      });
    } else {
      console.log('No lines found with comma issues in the test data');
    }

    // This test always passes, it's mainly for integration verification
    expect(true).toBe(true);
  });

  it('should handle lines with specific patterns found in HSBC data', () => {
    // Test some common patterns that might appear in real data
    const testCases = [
      // MINDBODY case
      '17 Jun 2025,16 Jun 2025,SALES: MINDBODY, INC. SAN LUIS OBISUS,USD 299.00,2366.83',
      // Company with multiple commas
      '18 Jun 2025,17 Jun 2025,SALES: AMAZON, LOGISTICS, INC. LOCATION,GBP 45.50,400.25',
      // Restaurant with location
      '19 Jun 2025,18 Jun 2025,SALES: RESTAURANT, DOWNTOWN, DISTRICT,EUR 75.00,650.00',
    ];

    testCases.forEach((testCase) => {
      expect(() => {
        const result = handleCommaInDescription(testCase);
        // Verify the result has exactly 5 fields
        const fields = result.split(',');
        expect(fields).toHaveLength(5);
        // Verify 4th field is empty (foreign currency position)
        expect(fields[3]).toBe('');
      }).not.toThrow();
    });
  });
});
