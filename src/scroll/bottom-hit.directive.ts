import {Directive, EventEmitter, HostListener, Output} from '@angular/core';
import {Limit} from '../methoddecorator/limit';

@Directive({
    selector: '[ddrBottomHit]'
})
export class BottomHitDirective
{
    public offset = 1000;

    @Output()
    public onWindowBottomHit = new EventEmitter();

    @Output()
    private onElementBottomHit = new EventEmitter();

    constructor()
    {
    }

    @HostListener('scroll', ['$event'])
    @Limit()
    public scrolled($event: Event): void
    {
        this.elementScrollEvent($event);
    }

    @HostListener('window:scroll', ['$event'])
    @Limit()
    public windowScrolled($event: Event): void
    {
        this.windowScrollEvent($event);
    }

    protected windowScrollEvent($event: Event): void
    {
        const pageHeight = Math.max(
            document.body.scrollHeight, document.documentElement.scrollHeight,
            document.body.offsetHeight, document.documentElement.offsetHeight,
            document.body.clientHeight, document.documentElement.clientHeight
        );
        const viewportHeight = document.documentElement.clientHeight;
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        const distanceToBottom = pageHeight - (scrollPosition + viewportHeight);
        if (distanceToBottom < this.offset) {
            this.onWindowBottomHit.emit();
        }
    }

    protected elementScrollEvent($event: Event): void
    {
        const target = $event.target as HTMLElement;
        const scrollPosition = target.scrollHeight - target.scrollTop;
        const offsetHeight = target.offsetHeight;
        const isReachingBottom = (scrollPosition - offsetHeight) < this.offset;
        if (isReachingBottom) {
            this.onElementBottomHit.emit();
        }
    }
}
