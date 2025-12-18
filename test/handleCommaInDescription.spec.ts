import { describe, it, expect } from 'vitest';
import { handleCommaInDescription } from '../src/features/csv-processing/services/csv-helpers.js';

describe('handleCommaInDescription - Manual CSV Parsing', () => {
  it('should handle the MINDBODY example with currency in 5th field', () => {
    const raw =
      '22 May 2025	,21 May 2025	,SALES:   MINDBODY, INC.            SAN LUIS OBISUS	,USD 299.00	,2386.79';
    const result = handleCommaInDescription(raw);

    expect(result).toBe('22 May 2025	,21 May 2025	,MINDBODY INC. SAN LUIS OBISUS,,2386.79');
  });

  it('should handle multiple commas in description field', () => {
    const raw = 'Date1,Date2,SALES: COMPANY, NAME, INC. LOCATION,USD 100.00,500.00';
    const result = handleCommaInDescription(raw);

    expect(result).toBe('Date1,Date2,COMPANY NAME INC. LOCATION,,500.00');
  });

  it('should merge fields until exactly 5 fields remain', () => {
    const raw = 'Date1,Date2,SALES: SPLIT, INTO, MANY, PARTS,USD 50.00,250.00';
    const result = handleCommaInDescription(raw);

    expect(result).toBe('Date1,Date2,SPLIT INTO MANY PARTS,,250.00');
  });

  it('should validate currency pattern in 5th field - valid currencies', () => {
    const validCurrencies = [
      'Date1,Date2,Description,Part,USD 123.45,500.00',
      'Date1,Date2,Description,Part,EUR 999.99,750.00',
      'Date1,Date2,Description,Part,GBP 000.01,100.00',
    ];

    validCurrencies.forEach((raw) => {
      expect(() => handleCommaInDescription(raw)).not.toThrow();
    });
  });

  it('should throw error for invalid currency pattern in 5th field', () => {
    const invalidCurrencies = [
      'Date1,Date2,Description,Part,US 123.45,500.00', // Too short currency
      'Date1,Date2,Description,Part,USDD 123.45,500.00', // Too long currency
      'Date1,Date2,Description,Part,USD123.45,500.00', // Missing space
      'Date1,Date2,Description,Part,USD 123,500.00', // Missing decimal
      'Date1,Date2,Description,Part,USD 123.4,500.00', // Wrong decimal places
      'Date1,Date2,Description,Part,123.45,500.00', // No currency
      'Date1,Date2,Description,Part,USD abc.de,500.00', // Non-numeric amount
    ];

    invalidCurrencies.forEach((raw) => {
      expect(() => handleCommaInDescription(raw)).toThrow(
        /5th field must contain currency name and amount/
      );
    });
  });

  it('should throw error for insufficient fields', () => {
    const insufficientFields = [
      'Date1,Date2,Description,Part,USD 123.45', // Only 5 fields
      'Date1,Date2,Description,Part', // Only 4 fields
      'Date1,Date2,Description', // Only 3 fields
    ];

    insufficientFields.forEach((raw) => {
      expect(() => handleCommaInDescription(raw)).toThrow(/Expected at least 6 fields/);
    });
  });

  it('should clean up whitespace and remove SALES prefix', () => {
    const raw = 'Date1,Date2,SALES:   COMPANY    NAME, PART   WITH   SPACES,USD 123.45,500.00';
    const result = handleCommaInDescription(raw);

    expect(result).toBe('Date1,Date2,COMPANY NAME PART WITH SPACES,,500.00');
  });

  it('should handle exactly 6 fields without extra merging', () => {
    const raw = 'Date1,Date2,SALES: DESCRIPTION,PART,USD 123.45,500.00';
    const result = handleCommaInDescription(raw);

    expect(result).toBe('Date1,Date2,DESCRIPTION PART,,500.00');
  });

  it('should preserve original field formatting where possible', () => {
    const raw = '22 May 2025	,21-May-25,SALES: TEST, COMPANY,USD 50.00,100.50';
    const result = handleCommaInDescription(raw);

    // Should preserve the tab in first field and dash format in second field
    expect(result).toBe('22 May 2025	,21-May-25,TEST COMPANY,,100.50');
  });

  it('should handle edge case with many commas in description', () => {
    const raw = 'D1,D2,SALES: A, B, C, D, E, F, G,USD 1.00,2.00';
    const result = handleCommaInDescription(raw);

    expect(result).toBe('D1,D2,A B C D E F G,,2.00');
  });

  it('should handle payment lines with CR indicator', () => {
    const raw = '12 May 2025	,12 May 2025	,PAYMENT - THANK YOU	,	,21047.34,CR	';
    const result = handleCommaInDescription(raw);

    expect(result).toBe('12 May 2025	,12 May 2025	,PAYMENT - THANK YOU,,21047.34');
  });

  it('should handle payment lines with CR and clean up whitespace', () => {
    const raw = '10 Jun 2025,10 Jun 2025,PAYMENT - THANK YOU,,18490.36,CR';
    const result = handleCommaInDescription(raw);

    expect(result).toBe('10 Jun 2025,10 Jun 2025,PAYMENT - THANK YOU,,18490.36');
  });

  it('should handle foreign currency lines without CR indicator (unchanged behavior)', () => {
    const raw =
      '22 May 2025	,21 May 2025	,SALES:   MINDBODY, INC.            SAN LUIS OBISUS	,USD 299.00	,2386.79';
    const result = handleCommaInDescription(raw);

    expect(result).toBe('22 May 2025	,21 May 2025	,MINDBODY INC. SAN LUIS OBISUS,,2386.79');
  });

  it('should handle complex edge case with commas in payment description and CR', () => {
    // Hypothetical case: what if a payment line had commas in the description AND a CR indicator
    const raw = '15 Jun 2025,15 Jun 2025,PAYMENT - THANK, YOU VERY, MUCH,,5000.00,CR';
    const result = handleCommaInDescription(raw);

    expect(result).toBe('15 Jun 2025,15 Jun 2025,PAYMENT - THANK YOU VERY MUCH,,5000.00');
  });
});
