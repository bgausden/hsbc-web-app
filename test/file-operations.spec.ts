/**
 * Tests for file operations services
 */
import { expect, test, describe } from 'vitest';
import { getProcessedFilename } from '../src/features/file-handling/services/file-operations.js';

describe('file-operations', () => {
  describe('getProcessedFilename', () => {
    test('should add -processed before .csv extension', () => {
      expect(getProcessedFilename('test.csv')).toBe('test-processed.csv');
    });

    test('should maintain the original extension if it is .csv', () => {
      expect(getProcessedFilename('data.CSV')).toBe('data-processed.CSV');
    });

    test('should use .csv extension if original has different extension', () => {
      expect(getProcessedFilename('data.txt')).toBe('data-processed.csv');
    });

    test('should handle filenames without extension', () => {
      expect(getProcessedFilename('noextension')).toBe('noextension-processed.csv');
    });

    test('should handle empty filename', () => {
      expect(getProcessedFilename('')).toBe('processed.csv');
    });

    test('should handle filenames with multiple dots', () => {
      expect(getProcessedFilename('file.name.with.dots.csv')).toBe(
        'file.name.with.dots-processed.csv'
      );
    });
  });
});
