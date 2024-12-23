import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Inject, Injectable} from '@angular/core';
import {catchError} from 'rxjs/operators';
import {Router} from '@angular/router';
import {OAuth2Service} from './oauth2.service';
import {DDR_OAUTH2_CONFIG, OAuth2Config} from './oauth2-config';

@Injectable()
export class RedirectToOAuth2LoginInterceptor implements HttpInterceptor
{
    constructor(
        private oAuth2Service: OAuth2Service,
        private router: Router,
        @Inject(DDR_OAUTH2_CONFIG) private oAuth2Config: OAuth2Config
    )
    {
    }

    /**
     * @override
     */
    public intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>>
    {
        return next.handle(req).pipe(catchError((err) => {

            if (err instanceof HttpErrorResponse) {
                if (err.status === 401) {
                    if (!window.location.href.startsWith(this.oAuth2Config.redirectUri)) {
                        this.oAuth2Service.setReturnUrl(this.router.routerState.snapshot.url);
                        this.oAuth2Service.redirectToLogin();
                    }
                }
            }

            return throwError(err);
        }));
    }
}
