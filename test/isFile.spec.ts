import { describe, it, expect } from 'vitest';
import { isFile } from '../src/asserts.js';

describe('test isFile', function () {
  it('should return false for a string', function () {
    expect(isFile('test')).toBe(false);
  });

  it('should return true for a File object', function () {
    expect(isFile(new File([''], 'test'))).toBe(true);
  });

  it('should return false for an empty object', function () {
    expect(isFile({})).toBe(false);
  });

  it('should return false for a number', function () {
    expect(isFile(1)).toBe(false);
  });

  it('should return false for a boolean', function () {
    expect(isFile(true)).toBe(false);
  });

  it('should return false for null', function () {
    expect(isFile(null)).toBe(false);
  });

  it('should return false for undefined', function () {
    expect(isFile(undefined)).toBe(false);
  });
});
