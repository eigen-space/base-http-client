import { AnyDictionary } from '@eigenspace/common-types';
import { UrlProcessor } from '../..';

type Matcher = (match: string, paramKey: string) => string;

export class UrlReplacer implements UrlProcessor {

    process(url: string, params: AnyDictionary = {}): string {
        const sanitized = url.replace(/:([a-zA-Z]+)/g, this.processMatching(params))
            .replace(/[a-zA-Z_-]*?=&/g, '')
            .replace(/[?&]?[a-zA-Z_-]*?=$/g, '');

        return decodeURIComponent(sanitized);
    }

    private processMatching(urlParams: AnyDictionary): Matcher {
        return (_: string, paramKey: string): string => {
            const param = urlParams[paramKey];
            if (param == null) {
                return '';
            }

            if (typeof param !== 'string') {
                return param;
            }

            return encodeURIComponent(param);
        };
    }
}
