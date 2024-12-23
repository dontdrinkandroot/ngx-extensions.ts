import {DDR_STORAGE_PREFIX, StorageService} from './storage.service';
import {Inject, Injectable} from '@angular/core';
import {Logger} from '../logger/logger.service';

@Injectable()
export class LocalStorageService extends StorageService
{
    constructor(
        @Inject(DDR_STORAGE_PREFIX) protected storagePrefix: string,
        protected logger: Logger
    )
    {
        super();
    }

    /**
     * @override
     */
    public retrieve<T>(key: string, defaultValue: T | null = null): T | null
    {
        const fullKey = this.getFullKey(key);
        const valueJson = localStorage.getItem(fullKey);
        if (null == valueJson) {
            return defaultValue;
        }

        try {
            return JSON.parse(valueJson);
        } catch (e) {
            this.logger.warn('Could not parse json value', valueJson, e);
            localStorage.removeItem(fullKey);
            return null;
        }
    }

    /**
     * @override
     */
    public store<T>(key: string, value: T): void
    {
        localStorage.setItem(this.getFullKey(key), JSON.stringify(value));
    }

    /**
     * @override
     */
    public remove(key: string)
    {
        localStorage.removeItem(this.getFullKey(key));
    }

    protected getFullKey(key: string): string
    {
        return this.storagePrefix + '.' + key;
    }
}
