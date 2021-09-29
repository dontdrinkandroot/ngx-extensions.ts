import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Router} from '@angular/router';
import {DDR_LOGIN_PATH} from '../ddr-extensions.module';

@Injectable()
export class RedirectToLoginInterceptor implements HttpInterceptor
{
    constructor(private router: Router, @Inject(DDR_LOGIN_PATH) private loginPath: string)
    {
    }

    /**
     * @override
     */
    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
    {
        return next.handle(req).pipe(catchError((err) => {

            if (err instanceof HttpErrorResponse) {
                if (err.status === 401) {
                    this.router.navigate([this.loginPath]);
                }
            }

            return throwError(err);
        }));
    }
}
