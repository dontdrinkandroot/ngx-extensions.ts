export class StringUtils
{
    public static capitalizeFirstLetter(text: string): string
    {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    public static stripTrailingSlash(text: string): string
    {
        const lastChar = text.charAt(text.length - 1);
        if ('/' === lastChar) {
            return text.slice(0, text.length - 1);
        }

        return text;
    }

    public static updateUrlParameter(uri: string, key: string, value: string): string
    {
        // remove the hash part before operating on the uri
        const i = uri.indexOf('#');
        const hash = i === -1 ? '' : uri.substr(i);
        uri = i === -1 ? uri : uri.substr(0, i);

        const re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
        const separator = uri.indexOf('?') !== -1 ? '&' : '?';
        if (uri.match(re)) {
            uri = uri.replace(re, '$1' + key + '=' + value + '$2');
        } else {
            uri = uri + separator + key + '=' + value;
        }
        return uri + hash;  // finally append the hash as well
    }
}
