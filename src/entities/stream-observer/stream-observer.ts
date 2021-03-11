import { Logger } from '@eigenspace/logger';
import { EventSourceConverter } from '../../converters/event-source/event-source.converter';

export interface FetchAllResponse<T> {
    items: T[];
}

export interface EventEmitter {
    on(event: string, callback: (payload: string) => void): void;

    off(event: string, callback: Function): void;
}

export class StreamObserver<S extends EventEmitter = EventEmitter> {
    stream: S;

    private chunkConverter = new EventSourceConverter();

    private logger = new Logger({ component: 'StreamObserver' });

    constructor(stream: S) {
        this.stream = stream;

        this.extractData = this.extractData.bind(this);
    }

    fetchAll<T>(
        headerEvent = 'header',
        payloadEvent = 'payload',
        endEvent = 'end'
    ): Promise<FetchAllResponse<T>> {
        let data: FetchAllResponse<T> = { items: [] };
        const rawChunks: string[] = [];

        return new Promise((resolve, reject) => {

            const convertData = (unsubscribeFn: Function): void => {
                const messages = this.chunkConverter.convert(rawChunks.join(''));

                messages.forEach(payload => {
                    switch (payload.event) {
                        case headerEvent:
                            data = { ...payload.data, items: data.items };
                            break;
                        case payloadEvent:
                            data.items.push(payload.data);
                            break;
                        case endEvent:
                            resolve(data);
                            unsubscribeFn();
                            break;
                        default:
                            const message = `event did not recognized or error was thrown ${JSON.stringify(payload)}`;
                            this.logger.info('fetchAll', message);
                            reject(message);
                            unsubscribeFn();
                    }
                });
            };

            this.stream.on('data', (chunk: string) => this.extractData(chunk, rawChunks));

            this.stream.on(
                'end',
                () => convertData(() => this.unsubscribe('end', [convertData, this.extractData]))
            );
        });
    };

    // noinspection JSMethodCanBeStatic
    private extractData(rawChunk: string, chunkStore: string[]): void {
        chunkStore.push(rawChunk.toString());
    };

    private unsubscribe(event: string, callbacks: Function[]): void {
        callbacks.forEach(cb => this.stream.off(event, cb));
    }
}