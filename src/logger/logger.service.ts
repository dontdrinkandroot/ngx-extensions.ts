export abstract class LoggerService
{
    public debugEnabled = false;

    public infoEnabled = true;

    public warnEnabled = true;

    public errorEnabled = true;

    public abstract debug(message?: any, ...optionalParams: any[]): void;

    public abstract info(message?: any, ...optionalParams: any[]): void;

    public abstract warn(message?: any, ...optionalParams: any[]): void;

    public abstract error(message?: any, ...optionalParams: any[]): void;
}
