import { HttpStatusCode } from '../..';
import { ContentType } from '../..';
import { Dictionary } from '@eigenspace/common-types';

export abstract class RequestProviderResponse<N, T> {
    protected contentTypeToHandler = {
        [ContentType.JSON]: this.json.bind(this),
        [ContentType.JSON_LD]: this.json.bind(this)
    } as Dictionary<() => Promise<T>>;

    constructor(protected nativeResponse: N) {
    }

    async data(): Promise<T> {
        if (this.status === HttpStatusCode.NO_CONTENT) {
            // In our case, we expect that consumer will define `undefined` as type of response
            // @ts-ignore
            return;
        }

        // Header can contain not only content type, but other is as well e.g. multipart/mixed; boundary=abcde
        const knownContentType = Object.keys(this.contentTypeToHandler)
            .find(key => key.includes(this.contentTypeHeader!));

        if (!knownContentType) {
            throw new Error(`Unsupported content type: ${this.contentTypeHeader}`);
        }

        const handler = this.contentTypeToHandler[knownContentType];

        return handler();
    }

    abstract get status(): HttpStatusCode | number;

    protected abstract json(): Promise<T>;

    protected abstract get contentTypeHeader(): ContentType | string | undefined;
}