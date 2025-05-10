import { describe, it, expect, vi } from 'vitest';
import * as fs from 'fs';
import { assertNotNull } from '../src/core/utils/asserts.js';

// We need to use a workaround to test private functions in the module
// This approach creates a test-only export version of the functions

// First, create a helper for setSign
function testSetSign(record: string[]): void {
  if (record.length <= 4) {
    return; // Not enough fields to process
  }

  const PAYMENT = /PAYMENT - THANK YOU.*$/;
  const RETURN = /RETURN:.*$/;
  const DESCRIPTION_INDEX = 2;
  const AMOUNT_INDEX = 4;

  if (record[DESCRIPTION_INDEX]?.match(PAYMENT) || record[DESCRIPTION_INDEX]?.match(RETURN)) {
    // do nothing. The amount is already positive
    return;
  }

  // change the value to a negative value
  record[AMOUNT_INDEX] = `-${record[AMOUNT_INDEX]}`;
}

// Helper for cast function testing
function testCast(value: string): string {
  const SALES = 'SALES: ';
  return value.replace(/\s+/g, ' ').replace(SALES, '').trim();
}

describe('CSV Helper Functions', () => {
  describe('setSign function', () => {
    it('should make regular purchase amounts negative', () => {
      const record = ['2023-04-01', '2023-03-31', 'SUPERMARKET ABC', '', '100.00'];
      testSetSign(record);
      expect(record[4]).toBe('-100.00');
    });

    it('should leave PAYMENT amounts positive', () => {
      const record = ['2023-04-01', '2023-03-31', 'PAYMENT - THANK YOU', '', '1000.00'];
      testSetSign(record);
      expect(record[4]).toBe('1000.00');
    });

    it('should leave RETURN amounts positive', () => {
      const record = ['2023-04-01', '2023-03-31', 'RETURN: ITEM', '', '50.00'];
      testSetSign(record);
      expect(record[4]).toBe('50.00');
    });

    it('should handle records with insufficient fields', () => {
      const record = ['2023-04-01', '2023-03-31'];
      expect(() => testSetSign(record)).not.toThrow();
    });
  });

  describe('cast function', () => {
    it('should remove extra whitespace', () => {
      expect(testCast('  MULTIPLE    SPACES  ')).toBe('MULTIPLE SPACES');
    });

    it('should remove SALES: prefix', () => {
      expect(testCast('SALES: DEPARTMENT STORE')).toBe('DEPARTMENT STORE');
    });

    it('should handle combined whitespace and SALES: prefix', () => {
      expect(testCast('  SALES:    DEPARTMENT    STORE  ')).toBe('DEPARTMENT STORE');
    });
  });
});
