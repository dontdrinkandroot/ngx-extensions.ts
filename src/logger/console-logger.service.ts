import {Logger} from './logger.service';
import {Injectable} from '@angular/core';

@Injectable()
export class ConsoleLogger extends Logger
{
    /**
     * @override
     */
    public debug(...data: unknown[]): void
    {
        if (this.debugEnabled) {
            console.debug(...data);
        }
    }

    /**
     * @override
     */
    public info(...data: unknown[]): void
    {
        if (this.infoEnabled) {
            console.info(...data);
        }
    }

    /**
     * @override
     */
    public warn(...data: unknown[]): void
    {
        if (this.warnEnabled) {
            console.warn(...data);
        }
    }

    /**
     * @override
     */
    public error(...data: unknown[]): void
    {
        if (this.errorEnabled) {
            console.error(...data);
        }
    }
}
