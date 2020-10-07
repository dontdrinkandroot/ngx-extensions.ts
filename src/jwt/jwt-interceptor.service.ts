import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {JwtService} from './jwt.service';
import {Router} from '@angular/router';
import {catchError} from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor
{
    constructor(private jwtService: JwtService, private router: Router)
    {
    }

    /**
     * @override
     */
    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
    {
        const token = this.jwtService.getToken();

        if (null !== token && !this.jwtService.isExpired()) {
            req = req.clone({
                headers: req.headers.set('Authorization', 'Bearer ' + token)
            });
        }

        // TODO: Mix of concerns, refactor to own interceptor if needed
        return next.handle(req).pipe(catchError((err) => {

            if (err instanceof HttpErrorResponse) {
                if (err.status === 401) {
                    this.router.navigate(['login']);
                }
            }

            return throwError(err);
        }));
    }
}
