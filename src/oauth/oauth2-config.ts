import {InjectionToken} from '@angular/core';

export const DDR_OAUTH2_CONFIG = new InjectionToken<OAuth2Config>('DDR_OAUTH2_CONFIG');

export class OAuth2Config
{
    constructor(
        public readonly clientId: string,
        public readonly redirectUri: string,
        public readonly authorizeUri: string,
        public readonly tokenUri: string
    )
    {
    }
}
