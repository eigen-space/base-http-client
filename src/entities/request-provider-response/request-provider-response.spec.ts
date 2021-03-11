import { RequestProviderResponseStub } from './request-provider-response.stub';
import { NativeResponseStub } from './native-respose.stub';
import { ContentType } from '../..';
import { HttpStatusCode } from '../..';
import { StreamObserverStub } from '../stream-observer/stream-observer.stub';

describe('RequestProviderResponse', () => {

    describe('#data', () => {

        it('should return processed json', async () => {
            const json = { data: 'json-data' };
            const nativeResponse = new NativeResponseStub(json, ContentType.JSON);
            const response = new RequestProviderResponseStub(nativeResponse);

            const data = await response.data();

            const expectedData = { data: 'json-data' };
            expect(data).toEqual(expectedData);
        });

        it('should return processed json if content type contains not only type', async () => {
            const json = { data: 'json-data' };
            const nativeResponse = new NativeResponseStub(json, 'application/json;charset=UTF-8');
            const response = new RequestProviderResponseStub(nativeResponse);

            const data = await response.data();

            const expectedData = { data: 'json-data' };
            expect(data).toEqual(expectedData);
        });

        it('should throw error for non-implemented default handler', async () => {
            const rawData = 'binary data';
            const nativeResponse = new NativeResponseStub(rawData, ContentType.PDF);
            const response = new RequestProviderResponseStub(nativeResponse);

            try {
                await response.data();
            } catch (e) {
                expect(e).toBeDefined();
            }
        });

        it('should throw error for empty content type', async () => {
            const rawData = 'plain-text';
            const nativeResponse = new NativeResponseStub(rawData, undefined);
            const response = new RequestProviderResponseStub(nativeResponse);

            try {
                await response.data();
            } catch (e) {
                expect(e).toBeDefined();
            }
        });

        it('should throw error for unprocessed response', async () => {
            const rawData = 'plain-text';
            const nativeResponse = new NativeResponseStub(rawData, ContentType.PLAIN_TEXT);
            const response = new RequestProviderResponseStub(nativeResponse);

            const data = await response.data();

            expect(data).toBeInstanceOf(NativeResponseStub);
        });

        it('should return empty for status code that means `no content`', async () => {
            const nativeResponse = new NativeResponseStub(undefined, undefined, HttpStatusCode.NO_CONTENT);
            const response = new RequestProviderResponseStub(nativeResponse);

            const data = await response.data();

            expect(data).toBeUndefined();
        });

        it('should return empty response if there are not data to stream', async () => {
            const chunk = JSON.stringify({ event: 'end' });
            const nativeResponse = new NativeResponseStub([chunk], ContentType.EVENT_STREAM);
            const response = new RequestProviderResponseStub(nativeResponse);

            const observer = await response.data();
            const data = await (observer as StreamObserverStub).fetchAll();

            const expected = { items: [] };
            expect(data).toEqual(expected);
        });

        it('should return entity list if there are list to stream', async () => {
            const chunks = [
                { event: 'payload', data: { key: 1 } },
                { event: 'payload', data: { key: 2 } },
                { event: 'payload', data: { key: 3 } },
                { event: 'end' }
            ].map(i => JSON.stringify(i));

            const nativeResponse = new NativeResponseStub(chunks, ContentType.EVENT_STREAM);
            const response = new RequestProviderResponseStub(nativeResponse);

            const observer = await response.data();
            const data = await (observer as StreamObserverStub).fetchAll();

            const expected = {
                items: [{ key: 1 }, { key: 2 }, { key: 3 }]
            };
            expect(data).toEqual(expected);
        });

        it('should process defined events to stream', async () => {
            const chunks = [
                { event: 'custom-header', data: { status: 200 } },
                { event: 'custom-payload', data: { key: 1 } },
                { event: 'custom-payload', data: { key: 2 } },
                { event: 'custom-payload', data: { key: 3 } },
                { event: 'custom-end' }
            ].map(i => JSON.stringify(i));

            const nativeResponse = new NativeResponseStub(chunks, ContentType.EVENT_STREAM);
            const response = new RequestProviderResponseStub(nativeResponse);

            const observer = await response.data();
            const events = ['custom-header', 'custom-payload', 'custom-end'];
            const data = await (observer as StreamObserverStub).fetchAll(...events);

            const expected = {
                status: 200,
                items: [{ key: 1 }, { key: 2 }, { key: 3 }]
            };
            expect(data).toEqual(expected);
        });

        it('should throw error if event is not familiar', async () => {
            const chunks = [
                { event: 'custom-end' }
            ].map(i => JSON.stringify(i));

            const nativeResponse = new NativeResponseStub(chunks, ContentType.EVENT_STREAM);
            const response = new RequestProviderResponseStub(nativeResponse);

            const observer = await response.data();

            try {
                await (observer as StreamObserverStub).fetchAll();
            } catch (e) {
                expect(e).toBeDefined();
            }
        });
    });
});