import {HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Inject, Injectable} from '@angular/core';
import {catchError, map, shareReplay, switchMap} from 'rxjs/operators';
import {JwtTokenResponse} from './jwt-token-response';
import {JwtService} from './jwt.service';
import {DDR_JWT_REFRESH_TOKEN_URL} from '../ddr-extensions.module';

@Injectable()
export class JwtRefreshTokenInterceptor implements HttpInterceptor
{
    private refreshTokenRequest$: Observable<JwtTokenResponse> | null = null;

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
    public intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>>
    {
        if (this.jwtService.isAboutToExpire() && !(req.url === this.jwtRefreshTokenUrl)) {
            const refreshToken = this.jwtService.getRefreshToken();
            if (null != refreshToken) {
                return this.getRefreshTokenRequest(refreshToken).pipe(
                    switchMap(() => next.handle(req))
                );
            }
        }


        return next.handle(req);
    }

    private getRefreshTokenRequest(refreshToken: string): Observable<JwtTokenResponse>
    {
        if (null == this.refreshTokenRequest$) {
            this.refreshTokenRequest$ = this.httpClient.post<JwtTokenResponse>(this.jwtRefreshTokenUrl, {refresh_token: refreshToken}).pipe(
                map(response => {
                    this.jwtService.setTokens(response.token, response.refresh_token);
                    this.refreshTokenRequest$ = null;
                    return response;
                }),
                catchError(error => {
                    this.jwtService.clear();
                    this.refreshTokenRequest$ = null;
                    return throwError(error)
                }),
                shareReplay(1)
            );
        }

        return this.refreshTokenRequest$;
    }
}
