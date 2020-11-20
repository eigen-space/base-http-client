import { RequestProviderResponseStub } from './request-provider-response.stub';
import { NativeResponseStub } from './native-respose.stub';
import { ContentType } from '../..';
import { HttpStatusCode } from '../..';

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

            try {
                await response.data();
            } catch (e) {
                expect(e).toBeDefined();
            }
        });

        it('should return empty for status code that means `no content`', async () => {
            const nativeResponse = new NativeResponseStub(undefined, undefined, HttpStatusCode.NO_CONTENT);
            const response = new RequestProviderResponseStub(nativeResponse);

            const data = await response.data();

            expect(data).toBeUndefined();
        });
    });
});