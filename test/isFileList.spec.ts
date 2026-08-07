import { describe, it, afterAll, expect } from 'vitest';
import { isFileList } from '../src/asserts.js';

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
      },
    };
  }
}

describe('test isFileList', function () {
  (globalThis as Record<string, unknown>).FileList = MockFileList;
  let fileList = new MockFileList(Array<File>(new File([''], 'test')));

  it('should not throw for FileList', function () {
    expect(() => isFileList(fileList)).not.toThrow();
  });

  it('should throw for {}', function () {
    expect(() => isFileList({})).toThrow();
  });

  afterAll(() => {
    Reflect.deleteProperty(globalThis, 'FileList');
  });
});
