import { describe, expect, it } from 'vitest';
import { stringifyCsv } from '../src/stringifyCsv.js';

describe('stringifyCsv', function () {
  it('quotes fields containing commas', function () {
    const csv = stringifyCsv([
      ['Date', 'Amount', 'Payee', 'Description'],
      ['03 May 2025', '-2386.79', '', 'MINDBODY, INC. SAN LUIS OBISUS USD 299.00'],
    ]);

    expect(csv).toContain('\n03 May 2025,-2386.79,,"MINDBODY, INC. SAN LUIS OBISUS USD 299.00"');
  });

  it('escapes embedded quotes', function () {
    const csv = stringifyCsv([
      ['Description'],
      ['He said "hello"'],
    ]);

    expect(csv).toBe('Description\n"He said ""hello"""');
  });
});