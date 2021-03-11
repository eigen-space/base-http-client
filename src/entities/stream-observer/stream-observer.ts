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
    }

    fetchAll<T>(
        headerEvent = 'header',
        payloadEvent = 'payload',
        endEvent = 'end'
    ): Promise<FetchAllResponse<T>> {
        let data: FetchAllResponse<T> = { items: [] };

        return new Promise((resolve, reject) => {
            const extractData = (rawPayload: string, unsubscribeFn: Function): void => {
                const messages = this.chunkConverter.convert(rawPayload.toString());

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

            this.stream.on(
                'data',
                (payload: string) => extractData(payload, () => this.unsubscribe('data', extractData))
            );
        });
    };

    private unsubscribe(event: string, callback: Function): void {
        this.stream.off(event, callback);
    }
}