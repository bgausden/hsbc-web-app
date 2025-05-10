import { assert } from 'chai';
import { describe, it } from 'vitest';
import { isFile } from '../src/core/utils/asserts.js';

describe('test isFile', function () {
  it('should return false for a string', function () {
    assert.equal(isFile('test'), false);
  });

  it('should return true for a File object', function () {
    assert.equal(isFile(new File([''], 'test')), true);
  });

  it('should return false for an empty object', function () {
    assert.equal(isFile({}), false);
  });

  it('should return false for a number', function () {
    assert.equal(isFile(1), false);
  });

  it('should return false for a boolean', function () {
    assert.equal(isFile(true), false);
  });

  it('should return false for null', function () {
    assert.equal(isFile(null), false);
  });

  it('should return false for undefined', function () {
    assert.equal(isFile(undefined), false);
  });
});
