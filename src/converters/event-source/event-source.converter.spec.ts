import { EventSourceConverter } from './event-source.converter';

describe('EventSourceConverter', () => {
    const converter = new EventSourceConverter();

    describe('#convert', () => {

        it('should throw out field in a message with empty value', async () => {
            const chunk = ['event:custom-end', 'data:'].join('\n');

            const message = converter.convert(chunk);

            const expected = [{ event: 'custom-end' }];
            expect(message).toEqual(expected);
        });
    });
});