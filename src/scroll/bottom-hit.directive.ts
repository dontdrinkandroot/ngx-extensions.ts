import {Directive, EventEmitter, HostListener, Output} from '@angular/core';
import {Limit} from '../methoddecorator/limit';

@Directive({
    selector: '[ddrBottomHit]',
    standalone: false
})
export class BottomHitDirective
{
    public offset = 1000;

    @Output()
    public windowBottomHit = new EventEmitter();

    @Output()
    private elementBottomHit = new EventEmitter();

    @HostListener('scroll', ['$event'])
    @Limit()
    public scrolled($event: Event): void
    {
        this.elementScrollEvent($event);
    }

    @HostListener('window:scroll', ['$event'])
    @Limit()
    public windowScrolled(): void
    {
        this.windowScrollEvent();
    }

    protected windowScrollEvent(): void
    {
        const pageHeight = Math.max(
            document.body.scrollHeight, document.documentElement.scrollHeight,
            document.body.offsetHeight, document.documentElement.offsetHeight,
            document.body.clientHeight, document.documentElement.clientHeight
        );
        const viewportHeight = document.documentElement.clientHeight;
        const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
        const distanceToBottom = pageHeight - (scrollPosition + viewportHeight);
        if (distanceToBottom < this.offset) {
            this.windowBottomHit.emit();
        }
    }

    protected elementScrollEvent($event: Event): void
    {
        const target = $event.target as HTMLElement;
        const scrollPosition = target.scrollHeight - target.scrollTop;
        const offsetHeight = target.offsetHeight;
        const isReachingBottom = (scrollPosition - offsetHeight) < this.offset;
        if (isReachingBottom) {
            this.elementBottomHit.emit();
        }
    }
}
