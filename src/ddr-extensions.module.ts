import {InjectionToken, NgModule} from '@angular/core';
import {BottomHitDirective} from './scroll/bottom-hit.directive';
import {Logger} from './logger/logger.service';
import {ConsoleLogger} from './logger/console-logger.service';
import {DDR_STORAGE_PREFIX, StorageService} from './storage/storage.service';
import {LocalStorageService} from './storage/local-storage.service';

export const DDR_JWT_REFRESH_TOKEN_URL = new InjectionToken<string>('DDR_JWT_REFRESH_TOKEN_URL');

export const DDR_LOGIN_PATH = new InjectionToken<string>('DDR_LOGIN_PATH');

@NgModule({
    declarations: [
        BottomHitDirective
    ],
    imports: [],
    providers: [
        {
            provide: DDR_LOGIN_PATH,
            useValue: '/login'
        },
        {
            provide: Logger,
            useClass: ConsoleLogger
        },
        {
            provide: DDR_STORAGE_PREFIX,
            useValue: 'ddr'
        },
        {
            provide: StorageService,
            useClass: LocalStorageService
        },
    ],
    exports: [
        BottomHitDirective
    ]
})
export class DdrExtensionsModule
{
}
