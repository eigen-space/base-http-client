import { BaseHttpClient } from './base-http-client';
import { AnyDictionary } from '@eigenspace/common-types';
import { RequestProvider } from '../../types/request-provider';
import { FormEntry, HttpRequestMethod } from '../..';
import { FormDataAppenderStub } from './form-appender.stub';

describe('BaseHttpClient', () => {
    const provider = {
        fetch: jest.fn(() => ({ data: jest.fn() }))
    } as RequestProvider<AnyDictionary>;

    const frozenTimestamp = 1605777416374;
    Date.now = jest.fn(() => frozenTimestamp);

    describe('#get', () => {

        it('should run fetch with default configuration', async () => {
            const baseUrl = 'https://example.com';
            const client = new BaseHttpClient<AnyDictionary>(provider);

            await client.get(baseUrl);

            const commonPayload = { headers: {} };
            const expectedUrl = `${baseUrl}?_=${frozenTimestamp}`;
            const expectedPayload = { method: HttpRequestMethod.GET, ...commonPayload };
            expect(provider.fetch).toBeCalledWith(expectedUrl, expectedPayload);
        });

        it('should use base url from constructor', async () => {
            const baseUrl = 'https://example.com';
            const client = new BaseHttpClient<AnyDictionary>(provider, undefined, undefined, baseUrl);
            const fragmentUrl = '/api';

            await client.get(fragmentUrl);

            const commonPayload = { headers: {} };
            const expectedUrl = `${baseUrl}${fragmentUrl}?_=${frozenTimestamp}`;
            const expectedPayload = { method: HttpRequestMethod.GET, ...commonPayload };
            expect(provider.fetch).toBeCalledWith(expectedUrl, expectedPayload);
        });

        it('should ignore anti-cache processing if the option is defined', async () => {
            const baseUrl = 'https://example.com';
            const client = new BaseHttpClient<AnyDictionary>(provider);
            const options = { isAntiCacheDisabled: true };
            const props = { options };

            await client.get(baseUrl, props);

            const commonPayload = { headers: {} };
            const expectedPayload = { method: HttpRequestMethod.GET, ...commonPayload };
            expect(provider.fetch).toBeCalledWith(baseUrl, expectedPayload);
        });

        it('should configure anti-cache token after params in url', async () => {
            const baseUrl = 'https://example.com?param=auth';
            const client = new BaseHttpClient<AnyDictionary>(provider);

            await client.get(baseUrl);

            const commonPayload = { headers: {} };
            const expectedPayload = { method: HttpRequestMethod.GET, ...commonPayload };
            const expectedUrl = `${baseUrl}&_=${frozenTimestamp}`;
            expect(provider.fetch).toBeCalledWith(expectedUrl, expectedPayload);
        });
    });

    describe('#post', () => {

        it('should prepare request if data is an object', async () => {
            const baseUrl = 'https://example.com';
            const client = new BaseHttpClient<AnyDictionary>(provider);
            const data = { payload: 123 };
            const props = { data };

            await client.post(baseUrl, props);

            const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' };
            const body = JSON.stringify(data);
            const expectedUrl = `${baseUrl}?_=${frozenTimestamp}`;
            const expectedPayload = { method: HttpRequestMethod.POST, headers, body };
            expect(provider.fetch).toBeCalledWith(expectedUrl, expectedPayload);
        });

        it('should throw error if we want to use form data but we had not defined deps', async () => {
            const baseUrl = 'https://example.com';
            const client = new BaseHttpClient<AnyDictionary>(provider, undefined, undefined);
            const data = [] as FormEntry[];
            const options = { isFormData: true };
            const props = { data, options };

            try {
                await client.post(baseUrl, props);
            } catch (e) {
                expect(e).toBeDefined();
            }
        });

        it('should configure form data', async () => {
            const baseUrl = 'https://example.com';
            const client = new BaseHttpClient<AnyDictionary>(provider, undefined, FormDataAppenderStub);
            const data = [['key', 'value', 'options']] as FormEntry[];
            const options = { isFormData: true };
            const props = { data, options };

            await client.post(baseUrl, props);

            const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' };
            const body = new FormDataAppenderStub([['key', 'value', 'options']]);
            const expectedUrl = `${baseUrl}?_=${frozenTimestamp}`;
            const expectedPayload = { method: HttpRequestMethod.POST, headers, body };
            expect(provider.fetch).toBeCalledWith(expectedUrl, expectedPayload);
        });
    });
});