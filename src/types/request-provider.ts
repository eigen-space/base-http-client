import { AnyDictionary } from '@eigenspace/common-types/types/dictionary';
import { HttpRequestMethod } from '..';
import { RequestProviderResponse } from '..';

export type BodyType = AnyDictionary | string;

export interface RequestProviderOptions {
    headers?: AnyDictionary;
    method?: HttpRequestMethod;
    body?: BodyType;
}

export interface RequestProvider<R> {
    fetch<T>(url: string, options: RequestProviderOptions): Promise<RequestProviderResponse<T, R>>;
}