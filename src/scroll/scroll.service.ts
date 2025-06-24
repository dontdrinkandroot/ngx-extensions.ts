import {NavigationStart, Router} from '@angular/router';
import {ViewportScroller} from '@angular/common';
import {inject, Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ScrollService
{
    private router = inject(Router);
    private viewportScroller = inject(ViewportScroller);

    private scrollPositionMap: Map<string, [number, number]> = new Map<string, [number, number]>();

    constructor()
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
                const scrollPosition = this.scrollPositionMap.get(url);
                if (null != scrollPosition) this.viewportScroller.scrollToPosition(scrollPosition);
            }, 1);
        }
    }
}
