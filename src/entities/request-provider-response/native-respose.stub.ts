import { AnyDictionary } from '@eigenspace/common-types';
import { HttpStatusCode } from '../..';

export class NativeResponseStub {
    private data: AnyDictionary;
    private statusData: HttpStatusCode;
    private contentTypeHeader?: string;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(data: any, contentTypeHeader?: string, status = HttpStatusCode.OK) {
        this.data = data;
        this.statusData = status;
        this.contentTypeHeader = contentTypeHeader;
    }

    async json(): Promise<AnyDictionary> {
        return this.data;
    }

    get headers(): Map<string, string | undefined> {
        return new Map([['Content-Type', this.contentTypeHeader]]);
    }

    get status(): HttpStatusCode | number {
        return this.statusData;
    }
}