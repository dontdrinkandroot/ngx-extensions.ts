import {InjectionToken} from "@angular/core";

export const DDR_STORAGE_PREFIX = new InjectionToken<string>('storage-prefix');

export abstract class StorageService
{
    public abstract store<T>(key: string, value: T): void;

    public abstract retrieve<T>(key: string, defaultValue?: T): T | null;

    public abstract remove(key: string): void;
}
