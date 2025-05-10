/**
 * Type definitions for CSV processing
 */

/**
 * Represents a row in the HSBC CSV format
 */
export interface HSBCCsvRow {
  postDate: string;
  transactionDate: string;
  description: string;
  foreignAmount: string;
  amountHKD: string;
}

/**
 * Represents a row in the Xero CSV format
 */
export interface XeroCsvRow {
  date: string;
  amount: string;
  payee: string;
  description: string;
}

/**
 * Represents the header structure for HSBC CSV
 */
export interface HSBCCsvHeader {
  cardNumber: string;
  columns: string[];
}

/**
 * Represents the header structure for Xero CSV
 */
export type XeroCsvHeader = ['Date', 'Amount', 'Payee', 'Description'];
