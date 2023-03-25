export abstract class Logger
{
    public debugEnabled = false;

    public infoEnabled = true;

    public warnEnabled = true;

    public errorEnabled = true;

    public abstract debug(...data: any[]): void;

    public abstract info(...data: any[]): void;

    public abstract warn(...data: any[]): void;

    public abstract error(...data: any[]): void;
}
