import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {OAuth2Service} from './oauth2.service';

@Injectable()
export class OAuth2AccessTokenInterceptor implements HttpInterceptor
{
    constructor(private oAuth2Service: OAuth2Service)
    {
    }

    /**
     * @override
     */
    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
    {
        const accessTokenString = this.oAuth2Service.getAccessTokenString();

        if (null !== accessTokenString && !this.oAuth2Service.isAccessTokenExpired()) {
            req = req.clone({
                headers: req.headers.set('Authorization', 'Bearer ' + accessTokenString)
            });
        }

        return next.handle(req);
    }
}
