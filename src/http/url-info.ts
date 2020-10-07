export class UrlInfo
{
    protocol: string;
    host: string;
    hostname: string;
    port: string;
    pathname: string;
    hash: string;
    search: string;

    public static parse(urlString: string): UrlInfo
    {
        const parser = document.createElement('a');
        parser.href = urlString;

        const urlInfo: UrlInfo = new UrlInfo();
        urlInfo.protocol = parser.protocol;
        urlInfo.host = parser.host;
        urlInfo.hostname = parser.hostname;
        urlInfo.port = parser.port;
        urlInfo.pathname = parser.pathname;
        urlInfo.hash = parser.hash;
        urlInfo.search = parser.search;

        return urlInfo;
    }

    public getRoot(): string
    {
        let root = this.protocol + '//' + this.hostname;
        if (this.port != null && this.port !== '' && this.port !== '80') {
            root += ':' + this.port;
        }

        return root;
    }

    public getUrl(): string
    {
        return this.getRoot() + this.pathname;
    }
}
