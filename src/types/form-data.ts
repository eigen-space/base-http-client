import { Dictionary } from '@eigenspace/common-types';

export type FormDataAppenderConstructor = new () => FormDataAppender;

export type FormEntry<O = string | undefined> = [string, string | Buffer, O];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface FormDataAppender<O = any> {
    append(...args: FormEntry<O>): void;
    getHeaders(): Dictionary<string>;
}
