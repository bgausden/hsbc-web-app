import { assert } from 'chai';
import { isFile } from '../src/index.js';

describe('test isFile', function () {
    /* it('test isFile', function (done) {
        assert.equal(isFile('test'), false);
        assert.equal(isFile(new File([''], 'test')), true);
        assert.equal(isFile({}), false);
        assert.equal(isFile(1), false);
        assert.equal(isFile(true), false);
        assert.equal(isFile(null), false);
        assert.equal(isFile(undefined), false);
        done();
    }) */
    it('should return false for a string', function (done) {
        assert.equal(isFile('test'), false);
        done();
      });
      
      it('should return true for a File object', function (done) {
        assert.equal(isFile(new File([''], 'test')), true);
        done();
      });
      
      it('should return false for an empty object', function (done) {
        assert.equal(isFile({}), false);
        done();
      });
      
      it('should return false for a number', function (done) {
        assert.equal(isFile(1), false);
        done();
      });
      
      it('should return false for a boolean', function (done) {
        assert.equal(isFile(true), false);
        done();
      });
      
      it('should return false for null', function (done) {
        assert.equal(isFile(null), false);
        done();
      });
      
      it('should return false for undefined', function (done) {
        assert.equal(isFile(undefined), false);
        done();
      });
})
