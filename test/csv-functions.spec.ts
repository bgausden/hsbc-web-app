import { assert } from 'chai';
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
      assert.equal(result[1][1], '-45.00');             // negative purchase
      assert.equal(result[1][3], 'STARBUCKS COFFEE ');  // description + foreign amt
    });
  });

  describe('description with a single comma', function () {
    it('parses amount correctly when description contains one comma', function () {
      const csv = makeCSV('15/03/2025,15/03/2025,MERCHANT, EXTRA,,45.00');
      const result = csvParse(csv);
      assert.equal(result[1][1], '-45.00');        // amount must be correct HKD value
      assert.include(result[1][3], 'MERCHANT');    // description must include merchant
    });
  });

  describe('description with multiple commas', function () {
    it('parses amount correctly when description contains two commas', function () {
      const csv = makeCSV('15/03/2025,15/03/2025,A, B, C,,45.00');
      const result = csvParse(csv);
      assert.equal(result[1][1], '-45.00');
      assert.include(result[1][3], 'A');
    });
  });

  describe('payment row', function () {
    it('keeps payment amount positive', function () {
      const csv = makeCSV('15/03/2025,15/03/2025,PAYMENT - THANK YOU,,1000.00');
      const result = csvParse(csv);
      assert.equal(result[1][1], '1000.00');
    });

    it('handles HSBC payment rows with trailing CR column', function () {
      const csv = makeCSV('15/03/2025,15/03/2025,PAYMENT - THANK YOU,,21047.34,CR');
      const result = csvParse(csv);
      assert.equal(result[1][0], '15/03/2025');
      assert.equal(result[1][1], '21047.34');
      assert.equal(result[1][2], '');
      assert.include(result[1][3], 'PAYMENT - THANK YOU');
    });
  });
});
