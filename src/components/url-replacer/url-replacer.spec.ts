import { UrlReplacer } from './url-replacer';

describe('UrlReplacer', () => {
    const replacer = new UrlReplacer();

    describe('#process', () => {

        it('shouldn\'t remove `=&` symbol if value contains `=` in the end', () => {
            const rawUrl = 'https://ya.ru/search?jql=:jql&fields=:fields&expand=:expand';
            const params = { jql: 'cf[11906]=', fields: 'customfield_12402,customfield_12249' };

            const url = replacer.process(rawUrl, params);

            const expectedUrl = 'https://ya.ru/search?jql=cf[11906]=&fields=customfield_12402,customfield_12249';
            expect(url).toEqual(expectedUrl);
        });

        it('should remove empty params in the end of the path', () => {
            const rawUrl = '/export?status=:status&page=:pageNumber&page_size=:pageSize';
            const params = { status: 'exported' };

            const url = replacer.process(rawUrl, params);

            const expected = '/export?status=exported';
            expect(url).toEqual(expected);
        });

        it('should clean url from unprocessed params', () => {
            const rawUrl = '/export?status=:status';

            const url = replacer.process(rawUrl);

            const expected = '/export';
            expect(url).toEqual(expected);
        });

        it('should remove empty params in the middle of path', () => {
            const rawUrl = '/export?status=:status&page=:pageNumber&page_size=:pageSize';
            const params = { pageSize: 22 };

            const url = replacer.process(rawUrl, params);

            const expected = '/export?page_size=22';
            expect(url).toEqual(expected);
        });
    });
});