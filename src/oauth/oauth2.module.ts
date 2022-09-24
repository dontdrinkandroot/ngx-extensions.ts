import {ModuleWithProviders, NgModule} from '@angular/core';
import {DDR_OAUTH2_CONFIG, OAuth2Config} from './oauth2-config';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {OAuth2RefreshTokenInterceptor} from './oauth2-refresh-token-interceptor.service';
import {RedirectToOAuth2LoginInterceptor} from './redirect-to-oauth2-login-interceptor.service';
import {OAuth2AccessTokenInterceptor} from './oauth2-access-token-interceptor.service';
import {OAuth2Service} from './oauth2.service';

@NgModule()
export class OAuth2Module
{
    static forRoot(config: OAuth2Config): ModuleWithProviders<OAuth2Module>
    {
        return {
            ngModule: OAuth2Module,
            providers: [
                OAuth2Service,
                {
                    provide: DDR_OAUTH2_CONFIG,
                    useValue: config
                },
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: OAuth2RefreshTokenInterceptor,
                    multi: true
                },
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: RedirectToOAuth2LoginInterceptor,
                    multi: true
                },
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: OAuth2AccessTokenInterceptor,
                    multi: true
                }
            ],
        };
    }
}
