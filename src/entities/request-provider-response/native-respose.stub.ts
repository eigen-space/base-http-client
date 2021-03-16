import { AnyDictionary } from '@eigenspace/common-types';
import { HttpStatusCode, StreamObserver } from '../..';
import { Readable, Transform } from 'stream';
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

    get headers(): Map<string, string | undefined> {
        return new Map([['Content-Type', this.contentTypeHeader]]);
    }

    get status(): HttpStatusCode | number {
        return this.statusData;
    }

    async json(): Promise<AnyDictionary> {
        return this.data as AnyDictionary;
    }

    async observer(): Promise<StreamObserver<AnyDictionary>> {
        const source = new Readable();
        const stream = new Transform({
            readableObjectMode: true,
            transform: (data: string, _, done) => {
                // Convert to event source chunk
                const entries = Object.entries(JSON.parse(data));

                const partOfChunks = entries.map(([key, value]) => {
                    let formattedValue = value;
                    if (typeof value === 'object') {
                        formattedValue = JSON.stringify(value);
                    }
                    return `${key}:${formattedValue}`;
                });

                const eventSeparator = '\n\n';
                done(null, `${partOfChunks.join('\n')}${eventSeparator}`);
            }
        });

        const messages = [...this.data as EventMessage<string>[], null];
        source._read = () => messages.forEach(d => setTimeout(() => source.push(d), 0));

        source.pipe(stream);

        return new StreamObserver(stream);
    }
}