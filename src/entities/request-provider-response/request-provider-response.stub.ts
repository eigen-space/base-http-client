import { Blob, HttpStatusCode, StreamObserver } from '../..';
import { ContentType } from '../..';
import { AnyDictionary } from '@eigenspace/common-types';
import { RequestProviderResponse } from './request-provider-response';
import { NativeResponseStub } from './native-respose.stub';

export class RequestProviderResponseStub extends RequestProviderResponse<AnyDictionary, NativeResponseStub> {

    get status(): HttpStatusCode | number {
        return this.nativeResponse.status;
    }

    protected json(): Promise<AnyDictionary> {
        return this.nativeResponse.json();
    }

    protected observer(): Promise<StreamObserver<AnyDictionary>> {
        return this.nativeResponse.observer();
    }

    protected get contentTypeHeader(): ContentType | string {
        return this.nativeResponse.headers.get('Content-Type')!;
    }

    protected blob(): Promise<Blob> {
        throw new Error('Not implemented');
    }
}