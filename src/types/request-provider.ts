import { AnyDictionary } from '@eigenspace/common-types/types/dictionary';
import { HttpRequestMethod } from '..';
import { RequestProviderResponse } from '..';

export type BodyType = AnyDictionary | string | number;

interface RequestProviderOptions {
    headers?: AnyDictionary;
    method?: HttpRequestMethod;
    body?: BodyType;
}

export interface RequestProvider<N> {
    fetch<T>(url: string, options: RequestProviderOptions): RequestProviderResponse<N, T>;
}