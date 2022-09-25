import {Inject, Injectable} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpParams, HttpRequest} from '@angular/common/http';
import {catchError, map, shareReplay} from 'rxjs/operators';
import {TokenResponse} from './token-response';
import {JsonWebToken} from './json-web-token';
import {DDR_OAUTH2_CONFIG, OAuth2Config} from './oauth2-config';
import {OAuth2Error} from './oauth2-error';
import {TypeUtils} from '../util/type-utils';
import {StringUtils} from '../util/string-utils';

@Injectable()
export class OAuth2Service
{
    private static STORAGE_KEY_CHALLENGE = 'ddr_oauth2_challenge';

    private static STORAGE_KEY_REFRESH_TOKEN = 'ddr_oauth2_refresh_token';

    public static STORAGE_KEY_RETURN_URL = 'ddr_oauth2_return_url';

    private accessTokenString: string | null = null;

    private accessToken: JsonWebToken | null = null;

    private readonly REFRESH_MARGIN_SECONDS = 60 * 10;

    private refreshTokenRequest$: Observable<JsonWebToken> | null = null;

    constructor(
        private route: ActivatedRoute,
        private httpClient: HttpClient,
        @Inject(DDR_OAUTH2_CONFIG) private config: OAuth2Config
    )
    {
    }

    public redirectToLogin()
    {
        const challenge = this.createChallenge();
        localStorage.setItem(OAuth2Service.STORAGE_KEY_CHALLENGE, challenge);

        const params = new HttpParams()
            .set('client_id', this.config.clientId)
            .set('response_type', 'code')
            .set('redirect_uri', this.config.redirectUri)
            .set('code_challenge', challenge)
            .set('code_challenge_method', 'plain');

        window.location.href = this.config.authorizeUri + '?' + params.toString();
    }

    public handleCode(): Observable<JsonWebToken>
    {
        if (this.route.snapshot.queryParamMap.has('error')) {
            const error = this.route.snapshot.queryParamMap.get('error');
            return throwError(() => new OAuth2Error(error ?? 'Unknown error'));
        }

        if (!this.route.snapshot.queryParamMap.has('code')) {
            return throwError(() => new OAuth2Error(OAuth2Error.CODE_NOT_FOUND));
        }

        const code = TypeUtils.notNull(this.route.snapshot.queryParamMap.get('code'));
        const params = new HttpParams()
            .set('grant_type', 'authorization_code')
            .set('code', code)
            .set('redirect_uri', this.config.redirectUri)
            .set('code_verifier', TypeUtils.notNull(localStorage.getItem(OAuth2Service.STORAGE_KEY_CHALLENGE)))
            .set('client_id', this.config.clientId);
        return this.httpClient.post<TokenResponse>(this.config.tokenUri, params).pipe(
            map(tokenResponse => this.processTokenResponse(tokenResponse))
        );
    }

    private createChallenge()
    {
        return StringUtils.createRandomString(64, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-._~');
    }

    private getRefreshToken(): string | null
    {
        return localStorage.getItem(OAuth2Service.STORAGE_KEY_REFRESH_TOKEN);
    }

    public getAccessTokenString(): string | null
    {
        return this.accessTokenString;
    }

    public isAccessTokenExpired(): boolean
    {
        return (
            null == this.accessToken
            || this.accessToken.exp * 1000 < Date.now()
        );
    }

    public isRefreshPossibleAndRequired(req: HttpRequest<any> | null = null): boolean
    {
        return (
            (null == req || !req.url.endsWith(this.config.tokenUri))
            && null != this.getRefreshToken()
            && (
                null == this.accessToken
                || (this.accessToken.exp - this.REFRESH_MARGIN_SECONDS) * 1000 < Date.now()
            )
        );
    }

    public performRefresh(): Observable<JsonWebToken>
    {
        if (null == this.refreshTokenRequest$) {

            console.log('Performing token refesh');

            const params = new HttpParams()
                .set('grant_type', 'refresh_token')
                .set('refresh_token', TypeUtils.notNull(this.getRefreshToken()))
                .set('client_id', this.config.clientId);

            this.refreshTokenRequest$ = this.httpClient.post<TokenResponse>(this.config.tokenUri, params).pipe(
                map(tokenResponse => this.processTokenResponse(tokenResponse)),
                catchError(error => {
                    this.accessTokenString = null;
                    this.accessToken = null;
                    localStorage.removeItem(OAuth2Service.STORAGE_KEY_REFRESH_TOKEN);
                    this.refreshTokenRequest$ = null;
                    return throwError(error);
                }),
                shareReplay(1)
            );
        }

        return this.refreshTokenRequest$;
    }

    private processTokenResponse(tokenResponse: TokenResponse): JsonWebToken
    {
        localStorage.removeItem(OAuth2Service.STORAGE_KEY_CHALLENGE);
        this.accessTokenString = tokenResponse.access_token;
        this.accessToken = JSON.parse(atob(tokenResponse.access_token.split('.')[1]));
        console.log('Access Token Expiry', new Date(this.accessToken!.exp * 1000));
        localStorage.setItem(OAuth2Service.STORAGE_KEY_REFRESH_TOKEN, tokenResponse.refresh_token);

        return this.accessToken!;
    }

    public clear()
    {
        this.accessToken = null;
        this.accessTokenString = null;
        localStorage.removeItem(OAuth2Service.STORAGE_KEY_REFRESH_TOKEN);
        localStorage.removeItem(OAuth2Service.STORAGE_KEY_RETURN_URL);
    }

    public setReturnUrl(url: string)
    {
        localStorage.setItem(OAuth2Service.STORAGE_KEY_RETURN_URL, url);
    }

    public getReturnUrl(): string | null
    {
        return localStorage.getItem(OAuth2Service.STORAGE_KEY_RETURN_URL);
    }
}
