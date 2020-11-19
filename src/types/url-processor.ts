import { AnyDictionary } from '@eigenspace/common-types';

export interface UrlProcessor {
    process(url: string, params?: AnyDictionary): string;
}