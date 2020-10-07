import {StringUtils} from './string-utils';

describe('StringUtils.capitalizeFirstLetter', () => {
    it('capitalizes the first letter', () => {
        expect(StringUtils.capitalizeFirstLetter('abcd')).toBe('Abcd');
    });
});

describe('StringUtils.stripTrailingSlash', () => {
    it('strips a trailing slash', () => {
        expect(StringUtils.stripTrailingSlash('abcd/')).toBe('abcd');
        expect(StringUtils.stripTrailingSlash('abcd')).toBe('abcd');
    });
});
