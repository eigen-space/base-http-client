import { FormDataAppender, FormEntry } from '../..';
import { Dictionary } from '@eigenspace/common-types';

export class FormDataAppenderStub implements FormDataAppender {
    entries = [] as FormEntry[];

    constructor(entries: FormEntry[] = []) {
        this.entries = entries;
    }

    append(...args: FormEntry): void {
        this.entries.push(args);
    }

    getHeaders(): Dictionary<string> {
        return {};
    }
}