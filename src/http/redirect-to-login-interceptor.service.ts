import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Router} from '@angular/router';
import {DDR_LOGIN_PATH} from '../ddr-extensions.module';

@Injectable()
export class RedirectToLoginInterceptor implements HttpInterceptor
{
    private router = inject(Router);
    private loginPath = inject(DDR_LOGIN_PATH);

    /**
     * @override
     */
    public intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>>
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
