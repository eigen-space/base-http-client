import { Logger } from '@eigenspace/logger';
import { EventSourceConverter } from '../../converters/event-source/event-source.converter';

export interface FetchAllResponse<T> {
    items: T[];
}

export interface EventEmitter {
    on(event: string, callback: (payload: string) => void): void;

    off(event: string, callback: Function): void;
}

type Binary = string;

export class StreamObserver<T> {
    stream: EventEmitter;

    private chunkConverter = new EventSourceConverter();

    private logger = new Logger({ component: 'StreamObserver' });

    constructor(stream: EventEmitter) {
        this.stream = stream;
    }

    fetchAll(headerEvent = 'header', payloadEvent = 'payload', endEvent = 'end'): Promise<FetchAllResponse<T>> {
        const chunkStore: string[] = [];

        return new Promise((resolve, reject) => {
            this.stream.on('data', (chunk: Binary) => chunkStore.push(chunk));

            this.stream.on('end', () => {
                try {
                    const data = this.convertData(chunkStore, headerEvent, payloadEvent, endEvent);
                    resolve(data);
                } catch (e) {
                    reject(e);
                }
            });

            this.stream.on('error', reject);
        });
    };

    private convertData(
        chunkStore: string[],
        headerEvent: string,
        payloadEvent: string,
        endEvent: string
    ): FetchAllResponse<T> {
        const messages = this.chunkConverter.convert(chunkStore.join(''));
        let data: FetchAllResponse<T> = { items: [] };

        messages.forEach(payload => {
            switch (payload.event) {
                case headerEvent:
                    data = { ...payload.data, items: data.items };
                    break;
                case payloadEvent:
                    data.items.push(payload.data);
                    break;
                case endEvent:
                    this.logger.info('fetchAll', 'consumed all data');
                    break;
                default:
                    const message = `event did not recognized or error was thrown ${JSON.stringify(payload)}`;
                    this.logger.info('fetchAll', message);
                    throw payload.data || message;
            }
        });

        return data;
    };
}