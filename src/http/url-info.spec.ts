import {UrlInfo} from './url-info';

describe('UrlInfo.getUrl', () => {
    it('returns the url', () => {
        expect(UrlInfo.parse('http://example.com/api/').getUrl()).toBe('http://example.com/api/');
    });
});
