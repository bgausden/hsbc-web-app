import { assert } from 'chai';
import { describe, it } from 'mocha';
import { isFileList } from '../src/index.js';

class MockFileList {
    length: number;
    item: (index: number) => File;

    constructor(files: File[]) {
        this.length = files.length;
        this.item = (index: number) => files[index];
    }

    [Symbol.iterator]() {
        let index = 0;
        const files = this.item;
        return {
            next(): IteratorResult<File> {
                if (index < files.length) {
                    return { value: files(index++), done: false };
                } else {
                    return { value: null, done: true };
                }
            }
        }
    }
}



describe('test isFileList', function () {
    // @ts-ignore
    global.FileList = MockFileList;
    let fileList = new MockFileList(Array<File>(new File([''], 'test')));
    it('should not throw for FileList', function (done) {
        assert.doesNotThrow(() => isFileList(fileList))
        done();
    })
    it('should throw for {}', function (done) {
        assert.throws(function () {
            isFileList({});
        });
        done();
    })

    after(() => {
        Reflect.deleteProperty(global, 'FileList')
    })
})