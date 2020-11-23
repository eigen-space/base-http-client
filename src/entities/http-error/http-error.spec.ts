import { HttpError } from './http-error';
import { HttpStatusCode } from '../..';

describe('HttpError', () => {

    describe('#constructor', () => {

        it('should create error with defined values', () => {
            const error = new HttpError(HttpStatusCode.NO_CONTENT, 'no content');

            expect(error.code).toBe(HttpStatusCode.NO_CONTENT);
            expect(error.message).toBe('no content');
        });

        it('should create error with defined code and empty message', () => {
            const error = new HttpError(HttpStatusCode.NO_CONTENT);

            expect(error.code).toBe(HttpStatusCode.NO_CONTENT);
            expect(error.message).toBe('');
        });
    });
});