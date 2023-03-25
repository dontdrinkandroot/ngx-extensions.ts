import {Logger} from './logger.service';
import {Injectable} from '@angular/core';

@Injectable()
export class ConsoleLogger extends Logger
{
    /**
     * @override
     */
    public debug(...data: any[]): void
    {
        if (this.debugEnabled) {
            console.debug(...data);
        }
    }

    /**
     * @override
     */
    public info(...data: any[]): void
    {
        if (this.infoEnabled) {
            console.info(...data);
        }
    }

    /**
     * @override
     */
    public warn(...data: any[]): void
    {
        if (this.warnEnabled) {
            console.warn(...data);
        }
    }

    /**
     * @override
     */
    public error(...data: any[]): void
    {
        if (this.errorEnabled) {
            console.error(...data);
        }
    }
}
