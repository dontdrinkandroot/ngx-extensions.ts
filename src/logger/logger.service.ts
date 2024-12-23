export abstract class Logger
{
    public debugEnabled = false;

    public infoEnabled = true;

    public warnEnabled = true;

    public errorEnabled = true;

    public abstract debug(...data: unknown[]): void;

    public abstract info(...data: unknown[]): void;

    public abstract warn(...data: unknown[]): void;

    public abstract error(...data: unknown[]): void;
}
