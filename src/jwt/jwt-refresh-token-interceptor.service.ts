import {HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Inject, Injectable} from '@angular/core';
import {map, shareReplay, switchMap} from 'rxjs/operators';
import {JwtTokenResponse} from './jwt-token-response';
import {JwtService} from './jwt.service';
import {DDR_JWT_REFRESH_TOKEN_URL} from '../ddr-extensions.module';

@Injectable()
export class JwtRefreshTokenInterceptor implements HttpInterceptor
{
    private refreshTokenRequest$: Observable<JwtTokenResponse>;

    constructor(
        private jwtService: JwtService,
        private httpClient: HttpClient,
        @Inject(DDR_JWT_REFRESH_TOKEN_URL) private jwtRefreshTokenUrl: string
    )
    {
    }

    /**
     * @override
     */
    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
    {
        if (this.jwtService.isAboutToExpire() && !req.url.endsWith('/login/refresh')) {
            let refreshToken = this.jwtService.getRefreshToken();
            if (null != refreshToken) {
                return this.getRefreshTokenRequest(refreshToken).pipe(
                    switchMap(() => next.handle(req))
                )
            }
        }


        return next.handle(req);
    }

    private getRefreshTokenRequest(refreshToken: string): Observable<JwtTokenResponse>
    {
        if (null == this.refreshTokenRequest$) {

            const refreshTokenRequest = this.httpClient.post<JwtTokenResponse>(this.jwtRefreshTokenUrl, {refresh_token: refreshToken}).pipe(
                map(response => {
                    this.jwtService.setTokens(response.token, response.refresh_token);
                    this.refreshTokenRequest$ = null;
                    return response;
                }),
                shareReplay(1)
            );
            this.refreshTokenRequest$ = refreshTokenRequest;
            return refreshTokenRequest;
        }

        return this.refreshTokenRequest$;
    }
}
