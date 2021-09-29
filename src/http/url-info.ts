export class UrlInfo
{
    protected constructor(
        public readonly protocol: string,
        public readonly host: string,
        public readonly hostname: string,
        public readonly port: number,
        public readonly pathname: string,
        public readonly hash: string,
        public readonly search: string
    )
    {
    }

    public static parse(urlString: string): UrlInfo
    {
        const parser = document.createElement('a');
        parser.href = urlString;

        return new UrlInfo(
            parser.protocol,
            parser.host,
            parser.hostname,
            +parser.port,
            parser.pathname,
            parser.hash,
            parser.search,
        );
    }

    public getRoot(): string
    {
        let root = this.protocol + '//' + this.hostname;
        if (this.port != null && this.port !== 80) {
            root += ':' + this.port;
        }

        return root;
    }

    public getUrl(): string
    {
        return this.getRoot() + this.pathname;
    }
}
