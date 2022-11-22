import {LoggerService} from './logger.service';

export class ConsoleLoggerService extends LoggerService
{
    /**
     * @override
     */
    public debug(message?: any, ...optionalParams: any[]): void
    {
        if (this.debugEnabled) {
            console.debug(message, optionalParams);
        }
    }

    /**
     * @override
     */
    public info(message?: any, ...optionalParams: any[]): void
    {
        if (this.infoEnabled) {
            console.info(message, optionalParams);
        }
    }

    /**
     * @override
     */
    public warn(message?: any, ...optionalParams: any[]): void
    {
        if (this.warnEnabled) {
            console.warn(message, optionalParams);
        }
    }

    /**
     * @override
     */
    public error(message?: any, ...optionalParams: any[]): void
    {
        if (this.errorEnabled) {
            console.error(message, optionalParams);
        }
    }
}
