import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {OAuth2Service} from './oauth2.service';

@Injectable()
export class OAuth2RefreshTokenInterceptor implements HttpInterceptor
{
    constructor(private oAuth2Service: OAuth2Service)
    {
    }

    /**
     * @override
     */
    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
    {
        if (this.oAuth2Service.isRefreshPossibleAndRequired(req)) {
            return this.oAuth2Service.performRefresh().pipe(
                switchMap(() => next.handle(req))
            );
        }

        return next.handle(req);
    }
}
