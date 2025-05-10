/**
 * Tests for CSV helper functions
 */
import { describe, it, expect } from 'vitest';
import { setSign, cast, PAYMENT, RETURN } from '../services/csv-helpers.js';

describe('CSV Helper Functions', () => {
  describe('cast function', () => {
    it('should replace multiple spaces with a single space', () => {
      expect(cast('Hello    World')).toBe('Hello World');
    });

    it('should remove SALES: prefix', () => {
      expect(cast('SALES: Some Store')).toBe('Some Store');
    });

    it('should trim whitespace from beginning and end', () => {
      expect(cast('  Trimmed   ')).toBe('Trimmed');
    });

    it('should handle combined cases', () => {
      expect(cast('  SALES:  Multiple    Spaces   ')).toBe('Multiple Spaces');
    });
  });

  describe('setSign function', () => {
    it('should make purchases negative', () => {
      const record = ['2023-04-01', '2023-03-31', 'STORE A', '', '100.00'];
      setSign(record);
      expect(record[4]).toBe('-100.00');
    });

    it('should leave PAYMENT entries positive', () => {
      const record = ['2023-04-01', '2023-03-31', 'PAYMENT - THANK YOU', '', '100.00'];
      setSign(record);
      expect(record[4]).toBe('100.00');
    });

    it('should leave RETURN entries positive', () => {
      const record = ['2023-04-01', '2023-03-31', 'RETURN: STORE', '', '100.00'];
      setSign(record);
      expect(record[4]).toBe('100.00');
    });

    it('should handle records with insufficient fields', () => {
      const record = ['2023-04-01', '2023-03-31'];
      expect(() => setSign(record)).not.toThrow();
      expect(record).toEqual(['2023-04-01', '2023-03-31']);
    });
  });

  describe('PAYMENT and RETURN constants', () => {
    it('PAYMENT regex should match payment entries', () => {
      expect(PAYMENT.test('PAYMENT - THANK YOU')).toBe(true);
      expect(PAYMENT.test('PAYMENT - THANK YOU ABC')).toBe(true);
      expect(PAYMENT.test('NOT A PAYMENT')).toBe(false);
    });

    it('RETURN regex should match return entries', () => {
      expect(RETURN.test('RETURN: STORE NAME')).toBe(true);
      expect(RETURN.test('REGULAR PURCHASE')).toBe(false);
    });
  });
});
