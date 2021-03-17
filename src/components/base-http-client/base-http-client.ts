import { Dictionary } from '@eigenspace/common-types';
import { RequestProvider } from '../../types';
import { CommonQueryProps, HttpRequestMethod, OutputData, QueryProvider } from '../..';
import { FormDataAppenderConstructor, FormEntry } from '../..';
import { UrlProcessor } from '../..';
import { UrlReplacer } from '@eigenspace/url-replacer';

interface Options {
    isFormData?: boolean;
    isAntiCacheEnabled?: boolean;
}

export interface BaseHttpClientRequestProps extends CommonQueryProps {
    options?: Options;
}

export class BaseHttpClient<R> implements QueryProvider<R> {
    private readonly baseUrl: string;

    private replacer: UrlProcessor;

    constructor(
        private requestProvider: RequestProvider<R>,
        urlReplacer?: UrlProcessor,
        private formDataAppender?: FormDataAppenderConstructor,
        baseUrl = ''
    ) {
        this.replacer = urlReplacer || new UrlReplacer();
        this.baseUrl = baseUrl;
    }

    get<T>(url: string, props?: BaseHttpClientRequestProps): Promise<OutputData<T, R>> {
        return this.request(url, HttpRequestMethod.GET, props);
    }

    post<T>(url: string, props?: BaseHttpClientRequestProps): Promise<OutputData<T, R>> {
        return this.request(url, HttpRequestMethod.POST, props);
    }

    /* istanbul ignore next */
    put<T>(url: string, props?: BaseHttpClientRequestProps): Promise<OutputData<T, R>> {
        return this.request(url, HttpRequestMethod.PUT, props);
    }

    /* istanbul ignore next */
    patch<T>(url: string, props?: BaseHttpClientRequestProps): Promise<OutputData<T, R>> {
        return this.request(url, HttpRequestMethod.PATCH, props);
    }

    /* istanbul ignore next */
    delete<T>(url: string, props?: BaseHttpClientRequestProps): Promise<OutputData<T, R>> {
        return this.request(url, HttpRequestMethod.DELETE, props);
    }

    private async request<T>(
        fragmentUrl: string,
        method: HttpRequestMethod,
        props: BaseHttpClientRequestProps = {}
    ): Promise<OutputData<T, R>> {
        const { params, options, data } = props;
        const url = this.replacer.process(`${this.baseUrl}${fragmentUrl}`, params);

        let body = data;
        let headers: Dictionary<string> = props.headers || {};

        const isAntiCacheEnabled = options?.isAntiCacheEnabled ?? true;
        if (isAntiCacheEnabled) {
            headers = { ...headers, 'Cache-Control': 'no-store, max-age=0' };
        }

        if (data && typeof data === 'object') {
            headers = {
                ...headers,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            };
            body = JSON.stringify(data);

            if (options?.isFormData) {
                if (!this.formDataAppender) {
                    throw new Error('To use FormData you have to define `FormDataAppender` dependency');
                }

                const formData = new this.formDataAppender();
                headers = {
                    ...headers,
                    'Content-Type': 'multipart/form-data',
                    ...formData.getHeaders()
                };
                (data as FormEntry[]).forEach(([key, value, entryOptions]) => {
                    formData.append(key, value, entryOptions);
                });

                body = formData;
            }
        }

        const response = await this.requestProvider.fetch<T>(url, { method, headers, body });
        return response.data();
    }
}
