import { EventSourceConverter } from './event-source.converter';

describe('EventSourceConverter', () => {
    const converter = new EventSourceConverter();

    describe('#convert', () => {

        it('should throw out field in a message with empty value', async () => {
            const chunk = ['type:custom-end', 'data:'].join('\n');

            const message = converter.convert(chunk);

            const expected = [{ type: 'custom-end' }];
            expect(message).toEqual(expected);
        });
    });
});