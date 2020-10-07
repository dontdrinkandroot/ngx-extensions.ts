import {InjectionToken, NgModule} from '@angular/core';
import {LazyImageDirective} from './image/lazy-image.directive';
import {BottomHitDirective} from './scroll/bottom-hit.directive';

export const DDR_STORAGE_PREFIX = new InjectionToken<string>('DDR_STORAGE_PREFIX');

export const DDR_JWT_REFRESH_TOKEN_URL = new InjectionToken<string>('DDR_JWT_REFRESH_TOKEN_URL');

@NgModule({
    declarations: [
        LazyImageDirective,
        BottomHitDirective
    ],
    imports: [],
    exports: [
        LazyImageDirective,
        BottomHitDirective
    ]
})
export class DdrExtensionsModule
{
}
