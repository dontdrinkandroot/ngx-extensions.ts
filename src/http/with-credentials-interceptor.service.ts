import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class WithCredentialsInterceptor implements HttpInterceptor
{
    /**
     * @override
     */
    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
    {
        const cloned = req.clone({
            withCredentials: true
        });

        return next.handle(cloned);
    }
}
