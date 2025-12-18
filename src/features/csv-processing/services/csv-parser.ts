/**
 * Sample CSV data from HSBC. Note the garbage
 * - title line at the top
 * - random commas in the 3rd columm breaking CSV parsing
 * - lines of metadata explaining what's in the current statment vs the next
 * It's a mix of fixed witdth and comma delimited data
 *
World Business MasterCard 5592-4033-3119-1519,,,,
Post Date,Transaction Date,Description,Foreign Currency Amount,Amount(HKD)
Transactions to be included in the next statement,,,,
17 Apr 2025	,16 Apr 2025	,SALES:   APPLE.COM/BILL            85221120099  IE                                        	, 	,178.00
22 Apr 2025	,21 Apr 2025	,SALES:   MINDBODY, INC.            SAN LUIS OBISUS                                        	, 299.00	,2366.83
22 Apr 2025	,21 Apr 2025	,SALES:   CLOUDFLARE                SAN FRANCISCOUS                                        	, 30.00	,237.47
22 Apr 2025	,19 Apr 2025	,SALES:   APPLE.COM/BILL            CORK         IE                                        	, 	,238.00
22 Apr 2025	,17 Apr 2025	,RETURN:  AlipayHK*Taobao.com       Hong Kong    HK                                        	, 	,360.48
22 Apr 2025	,20 Apr 2025	,SALES:   AlipayHK*Taobao.com       Hong Kong    HK                                        	, 	,3646.82
23 Apr 2025	,22 Apr 2025	,SALES:   APPLE.COM/BILL            ITUNES.COM   IE                                        	, 	,38.00
24 Apr 2025	,23 Apr 2025	,SALES:   ADOBE SOFTWARE            85230714922  IE                                        	, 	,448.00
24 Apr 2025	,24 Apr 2025	,SALES:   Spotify P3623FF7D3        Stockholm    SE                                        	, 	,108.00
24 Apr 2025	,23 Apr 2025	,SALES:   SERENITY RESEARCH (SG)    SINGAPORE    SG                                        	, 48.00	,438.46
25 Apr 2025	,24 Apr 2025	,SALES:   AlipayHK*Taobao.com       Hong Kong    HK                                        	, 	,241.66
25 Apr 2025	,24 Apr 2025	,SALES:   AlipayHK*Taobao.com       Hong Kong    HK                                        	, 	,284.95
28 Apr 2025	,25 Apr 2025	,SALES:   GOOGLE*GOOGLE ONE         G.CO/HELPPAY#HK                                        	, 	,79.00
29 Apr 2025	,28 Apr 2025	,SALES:   aliexpress                Singapore    SG                                        	, 103.00	,814.81
Transactions included in previous statement,,,,
2 Apr 2025	,2 Apr 2025	,SALES:   TALENOX                   SINGAPORE    SG                                        	, 	,938.00
2 Apr 2025	,1 Apr 2025	,SALES:   AlipayHK*Taobao.com       Hong Kong    HK                                        	, 	,685.71
2 Apr 2025	,1 Apr 2025	,SALES:   SWYTCH                    LONDON       GB                                        	, 6.00	,61.76
2 Apr 2025	,1 Apr 2025	,SALES:   AlipayHK*Taobao.com       Hong Kong    HK                                        	, 	,704.49
2 Apr 2025	,2 Apr 2025	,PAYMENT - THANK YOU                                                                       	, 	,24082.70
3 Apr 2025	,2 Apr 2025	,SALES:   Amazon web services       aws.amazon.coUS                                        	, 19.87	,157.66
3 Apr 2025	,2 Apr 2025	,SALES:   Amazon web services       aws.amazon.coUS                                        	, 0.50	,3.97
3 Apr 2025	,3 Apr 2025	,SALES:   SMARTONE AUTOPAY          KWUN TONG    HK                                        	, 	,2091.25
5 Apr 2025	,3 Apr 2025	,SALES:   SPARK PAY MONTHLY (3)     AUCKLAND     NZ                                        	, 73.70	,333.73
5 Apr 2025	,5 Apr 2025	,SALES:   APPLE.COM/BILL            85221120099  IE                                        	, 	,68.00
5 Apr 2025	,4 Apr 2025	,SALES:   Quote Stock Sell (NZ)     Auckland     NZ                                        	, 33.00	,261.85
7 Apr 2025	,5 Apr 2025	,SALES:   XERO GLOBAL IN-5727146    WELLINGTION  US                                        	, 73.00	,578.94
7 Apr 2025	,5 Apr 2025	,SALES:   GEORGEMIKE.COM            BROOKLYN     US                                        	, 12.00	,95.17
7 Apr 2025	,5 Apr 2025	,SALES:   HKTV MALL                 HONG KONG    HK                                        	, 	,368.00
7 Apr 2025	,5 Apr 2025	,SALES:   APPLE.COM/BILL            85221120099  IE                                        	, 	,8.00
7 Apr 2025	,4 Apr 2025	,SALES:   AlipayHK*Taobao.com       Hong Kong    HK                                        	, 	,309.09
8 Apr 2025	,7 Apr 2025	,SALES:   GUARDIAN NEWS & MEDIA     LONDON       GB                                        	, 120.00	,951.69
8 Apr 2025	,7 Apr 2025	,SALES:   APPLE.COM/BILL            ITUNES.COM   IE                                        	, 	,128.00
9 Apr 2025	,8 Apr 2025	,SALES:   Mailchimp                 Atlanta      US                                        	, 306.50	,2429.85
10 Apr 2025	,9 Apr 2025	,SALES:   MARKS & SPENCER           CENTRAL      HK                                        	, 	,862.00
10 Apr 2025	,9 Apr 2025	,SALES:   MICROSOFT#G086865313      MSBILL.INFO  SG                                        	, 42.85	,339.51
10 Apr 2025	,9 Apr 2025	,SALES:   FUSION 261DBS             LANTAU ISLANDHK                                        	, 	,142.50
11 Apr 2025	,10 Apr 2025	,SALES:   KPAY*SWEET DECORATIONS    HONGKONG     HK                                        	, 	,599.10
11 Apr 2025	,10 Apr 2025	,SALES:   APPLE.COM/BILL            ITUNES.COM   IE                                        	, 	,78.00
12 Apr 2025	,11 Apr 2025	,SALES:   FUSION 261DBS             LANTAU ISLANDHK                                        	, 	,443.10
14 Apr 2025	,13 Apr 2025	,SALES:   GITHUB                    SAN FRANCISCOUS                                        	, 25.00	,197.78
14 Apr 2025	,11 Apr 2025	,SALES:   GR DIGITAL                BETHESDA     US                                        	, 99.00	,783.21
14 Apr 2025	,12 Apr 2025	,SALES:   MARKET PLACE-JARDINE H    CENTRAL      HK                                        	, 	,109.80
16 Apr 2025	,15 Apr 2025	,SALES:   PCCW (NETVIGATOR/NOW T    HONG KONG    HK                                        	, 	,598.00
*/

/**
 * Main CSV parsing functionality for HSBC to Xero CSV conversion
 */

//import { parse } from 'csv-parse/browser/esm/sync';
import { parse, CsvError } from 'csv-parse/browser/esm';
import { parse as syncParse } from 'csv-parse/browser/esm/sync';
import {
  assertNotNull,
  isCsvError,
  isMissingDescription,
  isValidRecord,
} from '../../../core/utils/asserts.js';
import { cast, setSign, handleCommaInDescription, createOutputRow } from './csv-helpers.js';
import { sanitizeCsvData } from './sanitization.js';

/**
 * Parses HSBC CSV content and transforms it to Xero-compatible format
 *
 * @param fileContents The CSV content as a string
 * @returns A 2D array representing the parsed and transformed CSV data
 * @throws Error if the CSV content is empty or parsing fails
 */
export function csvParse(fileContents: string): string[][] {
  // Validate input
  assertNotNull(fileContents);
  if (fileContents.trim() === '') {
    throw new Error('CSV content cannot be empty');
  }

  // get the raw data, skipping the document title e.g. "World Business MasterCard xxxx-xxxx-xxxx-1234"
  const raw = fileContents;
  /**
   * Sample CSV data from HSBC
   World Business MasterCard 5592-4033-3119-1519,,,,
Post Date,Transaction Date,Description,Foreign Currency Amount,Amount(HKD)
Transactions to be included in the next statement,,,,
17 Apr 2025	,16 Apr 2025	,SALES:   APPLE.COM/BILL            85221120099  IE                                        	, 	,178.00
22 Apr 2025	,21 Apr 2025	,SALES:   MINDBODY, INC.            SAN LUIS OBISUS                                        	, 299.00	,2366.83
22 Apr 2025	,21 Apr 2025	,SALES:   CLOUDFLARE                SAN FRANCISCOUS                                        	, 30.00	,237.47
22 Apr 2025	,19 Apr 2025	,SALES:   APPLE.COM/BILL            CORK         IE                                        	, 	,238.00
22 Apr 2025	,17 Apr 2025	,RETURN:  AlipayHK*Taobao.com       Hong Kong    HK                                        	, 	,360.48
22 Apr 2025	,20 Apr 2025	,SALES:   AlipayHK*Taobao.com       Hong Kong    HK                                        	, 	,3646.82
*/

  const rawData = raw.slice(raw.indexOf(`\n`) + 1); // drop the first line (contains the card number)

  // parse the raw data into a 2d array of strings
  /* let csvData = parse(rawData, {
    //relax_column_count: true,
    columns: true,
    skip_empty_lines: true,
    trim: true,
    raw: true,
    cast: cast,
    onRecord: onRecord,
  });
 */

  let csvData: string[][] = [];
  let record: { raw: string; record: string[] };
  const options = {
    columns: false,
    skip_empty_lines: true,
    trim: true,
    raw: true,
    from: 2,
    cast: cast,
    relaxed_column_count: true,
  };
  let parser = parse(options);

  parser.on('readable', () => {
    while ((record = parser.read()) !== null) {
      // Process each record
      const sourceRow = record.record;
      try {
        isValidRecord(sourceRow);
        setSign(sourceRow);
        csvData.push(createOutputRow(sourceRow));
      } catch (error) {
        try {
          isCsvError(error);
          // Log the error but continue processing other rows
          console.warn('Skipping invalid row:', error.code, error.message);
          // Don't break out of the loop - continue with the next record
          continue;
        } catch (e) {
          if (isMissingDescription(sourceRow)) {
            console.warn('Skipping row with missing description:', sourceRow);
          } else {
            console.error('Unexpected error processing row:', sourceRow, (error as Error).message);
            throw error; // Unexpected/unknown error, rethrow it
          }
        }
      }
    }
  });

  parser.on('error', (err: CsvError) => {
    console.info('Handling parsing error:', err.code);
    if (
      err.code === 'CSV_RECORD_INCONSISTENT_COLUMNS' ||
      err.code === 'CSV_RECORD_INCONSISTENT_FIELDS_LENGTH'
    ) {
      // Make sure we have raw data to work with
      if (!err.raw) {
        console.warn('Error without raw data, skipping fix:', err.code);
        parser.resume(); // Try to continue anyway
        return;
      }

      const newRaw = handleCommaInDescription(err.raw);
      const [row, _] = syncParse(newRaw, {
        skip_empty_lines: true,
        cast: cast,
        columns: false,
        trim: true,
      });

      try {
        isValidRecord(row);
      } catch (error) {
        console.error('Could not handle parsing error:', (error as Error).message);
        parser.resume(); // Still try to continue
        return;
      }

      setSign(row);
      csvData.push(createOutputRow(row));
      parser.resume();
    } else {
      // For other types of errors, log and try to continue
      console.warn('Unhandled CSV parse error:', err.code, err.message);
      parser.resume();
    }
  });

  parser.on('end', () => {
    // Handle end of parsing
    console.log('CSV parsing completed successfully');
  });

  //parser.write(rawData);
  // Split raw data into lines and parse line by line
  /* const lines = rawData.split('\n');
  for (const line of lines) {
    if (line.trim()) {
      parser.write(line + '\n');
    }
  } */
  parser.write(rawData);
  parser.end();

  // Handle any errors that occurred during parsing
  if (parser.errored) {
    console.error('Error parsing CSV: parser destroyed');
    throw new Error(`CSV parsing error: parser destroyed`);
  }

  // Validate parsed data
  assertNotNull(csvData);

  // Even if no rows could be parsed, we should return at least the header
  // This ensures the test for invalid data still passes
  if (!Array.isArray(csvData)) {
    csvData = [];
  }
  // pre-pend the Xero header - note the HSBC header was previously stripped
  const rowCount = csvData.unshift(['Date', 'Amount', 'Payee', 'Description']);
  console.log(`Row count in parsed output: ${rowCount}`);

  // Sanitize all data to prevent XSS attacks before returning
  return sanitizeCsvData(csvData);
}
