import {NavigationStart, Router} from '@angular/router';
import {ViewportScroller} from '@angular/common';
import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ScrollService
{
    private scrollPositionMap: Map<string, [number, number]> = new Map<string, [number, number]>();

    constructor(private router: Router, private viewportScroller: ViewportScroller)
    {
        this.router.events
            .subscribe(e => {
                if (e instanceof NavigationStart) {
                    this.scrollPositionMap.set(this.router.url, this.viewportScroller.getScrollPosition());
                }
            });
    }

    public restore(): void
    {
        const url = this.router.url;
        if (this.scrollPositionMap.has(url)) {
            /* Restore after timeout so rendering was completed */
            setTimeout(() => {
                this.viewportScroller.scrollToPosition(this.scrollPositionMap.get(url));
            }, 1);
        }
    }
}
