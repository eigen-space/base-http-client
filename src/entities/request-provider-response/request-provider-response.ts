import { HttpStatusCode } from '../..';
import { ContentType } from '../..';
import { Dictionary } from '@eigenspace/common-types';
import { Logger } from '@eigenspace/logger';
import { Blob, StreamObserver } from '../../types';

export type OutputData<T, R> = T | R | Blob | StreamObserver | undefined;

export abstract class RequestProviderResponse<T, R> {
    protected contentTypeToHandler = {
        [ContentType.JSON]: this.json.bind(this),
        [ContentType.JSON_LD]: this.json.bind(this),
        [ContentType.EVENT_STREAM]: this.observer.bind(this),
        [ContentType.PDF]: this.blob.bind(this)
    } as Dictionary<() => Promise<OutputData<T, R>>>;

    private logger = new Logger({ component: 'RequestProviderResponse' });

    constructor(protected nativeResponse: R) {
    }

    async data(): Promise<OutputData<T, R>> {
        if (this.status === HttpStatusCode.NO_CONTENT) {
            // In our case, we expect that consumer will define `undefined` as type of response
            return;
        }

        if (!this.contentTypeHeader) {
            throw new Error('Content type in response headers should be defined');
        }

        // Header can contain not only content type, but other is as well e.g. `multipart/mixed; boundary=abcde`
        const knownContentType = Object.keys(this.contentTypeToHandler)
            .find(key => this.contentTypeHeader!.includes(key));

        if (!knownContentType) {
            // Just return as is
            this.logger.warn('data', `unsupported content type: ${this.contentTypeHeader}`);
            return this.nativeResponse;
        }

        const handler = this.contentTypeToHandler[knownContentType];

        return handler();
    }

    abstract get status(): HttpStatusCode | number;

    protected abstract json(): Promise<T>;

    protected abstract blob(): Promise<Blob>;

    protected abstract observer(): Promise<StreamObserver>;

    protected abstract get contentTypeHeader(): ContentType | string | undefined;
}