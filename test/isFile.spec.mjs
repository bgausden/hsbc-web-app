import {assert} from 'chai';
import {isFile} from '../dist/index.js';

describe('test hsbc_web_app', function() {
    it('test hsbc-web-app.isFile', function(done) {
        assert.equal(isFile('test'), false);
        assert.equal(isFile(new File([''], 'test')), true);
        assert.equal(isFile({}), false);
        assert.equal(isFile(1), false);
        assert.equal(isFile(true), false);
        assert.equal(isFile(null), false);
        assert.equal(isFile(undefined), false);
        done();
    })
})