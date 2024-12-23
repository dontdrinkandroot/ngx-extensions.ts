import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {JwtService} from './jwt.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor
{
    constructor(private jwtService: JwtService)
    {
    }

    /**
     * @override
     */
    public intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>>
    {
        const token = this.jwtService.getToken();

        if (null !== token && !this.jwtService.isExpired()) {
            req = req.clone({
                headers: req.headers.set('Authorization', 'Bearer ' + token)
            });
        }

        return next.handle(req);
    }
}
