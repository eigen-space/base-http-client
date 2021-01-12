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

        it('should remove empty params', () => {
            const rawUrl = '/export?status=:status&page=:pageNumber';
            const params = { status: 'exported' };

            const url = replacer.process(rawUrl, params);

            const expected = '/export?status=exported';
            expect(url).toEqual(expected);
        });

        it('should remove empty params in any case', () => {
            const rawUrl = '/export?status-type=:status&page=:pageNumber&page_size=:pageSize';
            const params = { pageNumber: '1' };

            const url = replacer.process(rawUrl, params);

            const expected = '/export?page=1';
            expect(url).toEqual(expected);
        });

        it('should remove empty params in the middle of query', () => {
            const rawUrl = '/export?status=:status&page_size=:pageSize&page=:pageNumber';
            const rawUrlWithKebabCaseAtTheEnd = '/export?status-type=:status&page_size=:pageSize&page=:pageNumber';
            const rawUrlWithUnderscoreAtTheEnd = '/export?status_type=:status&page_size=:pageSize&page=:pageNumber';
            const params = { pageNumber: 22 };

            const url = replacer.process(rawUrl, params);
            const urlWithKebabCaseAtTheEnd = replacer.process(rawUrlWithKebabCaseAtTheEnd, params);
            const urlWithUnderscoreAtTheEnd = replacer.process(rawUrlWithUnderscoreAtTheEnd, params);

            const expected = '/export?page=22';
            expect(url).toEqual(expected);
            expect(urlWithKebabCaseAtTheEnd).toEqual(expected);
            expect(urlWithUnderscoreAtTheEnd).toEqual(expected);
        });

        it('should remove empty params in any case at the end of query', () => {
            const rawUrl = '/export?page=:pageNumber&statusType=:pageSize';
            const rawUrlWithKebabCaseAtTheEnd = '/export?page=:pageNumber&status-type=:pageSize';
            const rawUrlWithUnderscoreAtTheEnd = '/export?page=:pageNumber&status_type=:pageSize';
            const params = { pageNumber: '1' };

            const url = replacer.process(rawUrl, params);
            const urlWithKebabCaseAtTheEnd = replacer.process(rawUrlWithKebabCaseAtTheEnd, params);
            const urlWithUnderscoreAtTheEnd = replacer.process(rawUrlWithUnderscoreAtTheEnd, params);

            const expected = '/export?page=1';
            expect(url).toEqual(expected);
            expect(urlWithKebabCaseAtTheEnd).toEqual(expected);
            expect(urlWithUnderscoreAtTheEnd).toEqual(expected);
        });

        it('should not apply anything if params has excess fields', () => {
            const rawUrl = '/export?status=:status';
            const params = { status: 'exported', pageNumber: '1', name: 'John' };

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
    });
});
