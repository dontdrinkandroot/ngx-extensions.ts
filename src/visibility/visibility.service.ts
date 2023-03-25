import {Injectable} from '@angular/core';
import {fromEvent, merge, Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map, shareReplay, startWith} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class VisibilityService
{
    private readonly visibility$: Observable<boolean>;

    constructor()
    {
        this.visibility$ = merge(
            fromEvent(document, 'visibilitychange'),
            fromEvent(window, 'focus'),
            fromEvent(window, 'blur')
        ).pipe(
            debounceTime(50),
            startWith(true),
            map(() => document.hasFocus()),
            distinctUntilChanged(),
            shareReplay(1),
        );
    }

    public getVisibilityObservable(): Observable<boolean>
    {
        return this.visibility$;
    }
}
