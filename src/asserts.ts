export function isForm(element: unknown): asserts element is HTMLFormElement {
    if (!(element instanceof HTMLFormElement)) {
        throw new Error('Element is not a form!');
    }
}

export function assertNotNull<T>(arg: T): asserts arg is NonNullable<T> {
    if (arg === null || arg === undefined) {
        throw new Error('Element is null or undefined!');
    }
}

export function isFileList(arg: unknown): asserts arg is FileList {
    if (!(arg instanceof FileList) && (arg instanceof Object && Object.keys(arg).length === 0)) {
        throw new Error('Element is not a FileList!');
    }
}

export function isFile(arg: unknown): arg is File {
    return arg instanceof File;
}
// as HTMLInputElement;

export function isHTMLInputElement(arg: unknown): asserts arg is HTMLInputElement {
    if (!(arg instanceof HTMLInputElement)) {
        throw new Error('Element is not a HTMLInputElement!');
    }
}
