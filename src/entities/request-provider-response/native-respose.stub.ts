import { AnyDictionary } from '@eigenspace/common-types';
import { HttpStatusCode, StreamObserver } from '../..';
import { Readable, Transform } from 'stream';
import { StreamObserverStub } from '../stream-observer/stream-observer.stub';
import { EventMessage } from '../event-message/event-message';

export class NativeResponseStub {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly data: any;
    private readonly statusData: HttpStatusCode;
    private readonly contentTypeHeader?: string;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(data: any, contentTypeHeader?: string, status = HttpStatusCode.OK) {
        this.data = data;
        this.statusData = status;
        this.contentTypeHeader = contentTypeHeader;
    }

    async json(): Promise<AnyDictionary> {
        return this.data as AnyDictionary;
    }

    async observer(): Promise<StreamObserver> {
        const source = new Readable();
        const stream = new Transform({
            readableObjectMode: true,
            transform: (data: string, _, done) => done(null, JSON.parse(data))
        });

        const messages = [...this.data as EventMessage<string>[], null];
        source._read = () => messages.forEach(d => setTimeout(() => source.push(d), 0));

        source.pipe(stream);

        return new StreamObserverStub(stream);
    }

    get headers(): Map<string, string | undefined> {
        return new Map([['Content-Type', this.contentTypeHeader]]);
    }

    get status(): HttpStatusCode | number {
        return this.statusData;
    }
}