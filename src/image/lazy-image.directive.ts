import {
    ChangeDetectorRef,
    Directive,
    ElementRef,
    HostBinding,
    HostListener,
    Input,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import {NumberUtils} from '../util/number-utils';
import {StringUtils} from '../util/string-utils';
import {Debounce} from '../methoddecorator/debounce';
import {Limit} from '../methoddecorator/limit';


@Directive({selector: '[ddrLazyImage]'})
export class LazyImageDirective implements OnChanges
{
    @Input('ddrLazyImage')
    public src!: string;

    @Input()
    public objectFit: 'cover' | 'contain' = 'contain';

    @Input()
    public offset = 1000;

    @HostBinding('src')
    public hostSrc = 'assets/placeholder.gif';

    @HostBinding('style.width.px')
    public hostStyleWidthPx!: number;

    @HostBinding('style.height.px')
    public hostStyleHeightPx!: number;

    @HostBinding('style.object-fit')
    public hostStyleObjectFit = 'contain';

    private displayed = false;

    private maxLoadedDimension: { width: number, height: number } | null = null;

    constructor(private element: ElementRef, private changeDetectorRef: ChangeDetectorRef)
    {
    }

    @HostListener('window:resize', ['$event'])
    @Debounce()
    public windowResized($event: Event): void
    {
        this.displayed = false;
        this.check();
    }

    @HostListener('window:scroll', ['$event'])
    @Limit()
    public windowScroll($event: Event): void
    {
        this.check();
    }

    /**
     * @override
     */
    public ngOnChanges(changes: SimpleChanges): void
    {
        this.displayed = false;
        this.maxLoadedDimension = null;
        this.check();
    }

    private check(): void
    {
        if (this.element.nativeElement.parentElement.offsetWidth > 0) {
            this.doCheck();
        } else {
            setTimeout(() => this.doCheck(), 1);
        }
    }

    private doCheck(): void
    {
        if (this.displayed || this.isHidden(this.element.nativeElement)) {
            return;
        }

        if (this.isInsideViewport(this.element.nativeElement, this.offset)) {
            this.displayed = true;
            const dimension = this.getDimension();
            this.hostStyleWidthPx = dimension.width;
            this.hostStyleHeightPx = dimension.height;

            if (
                this.maxLoadedDimension != null
                && this.maxLoadedDimension!.width >= dimension.width
                && this.maxLoadedDimension!.height >= dimension.height
            ) {
                // console.log('has smaller dimension');
                return;
            }

            this.maxLoadedDimension = dimension;

            let wantedSize;
            if (this.objectFit === 'cover') {
                wantedSize = NumberUtils.getNextPowerOfTwo(Math.max(dimension.width, dimension.height));
                this.hostStyleObjectFit = 'cover';
            } else {
                wantedSize = NumberUtils.getNextPowerOfTwo(Math.min(dimension.width, dimension.height));
                this.hostStyleObjectFit = 'contain';
            }
            this.hostSrc = StringUtils.updateUrlParameter(this.src, 'size', String(wantedSize));
            this.changeDetectorRef.markForCheck();
        }
    }

    private isInsideViewport(element: HTMLElement, threshold: number): boolean
    {
        const ownerDocument = element.ownerDocument;
        const documentTop = window.pageYOffset || ownerDocument.body.scrollTop;
        const documentLeft = window.pageXOffset || ownerDocument.body.scrollLeft;

        const documentWidth = window.innerWidth || (ownerDocument.documentElement.clientWidth || document.body.clientWidth);
        const documentHeight = window.innerHeight || (ownerDocument.documentElement.clientHeight || document.body.clientHeight);
        const topOffset = element.getBoundingClientRect().top + documentTop - ownerDocument.documentElement.clientTop;
        const leftOffset = element.getBoundingClientRect().left + documentLeft - ownerDocument.documentElement.clientLeft;

        const isBelowViewport = documentHeight + documentTop <= topOffset - threshold;
        const isAtRightOfViewport = documentWidth + window.pageXOffset <= leftOffset - threshold;
        const isAboveViewport = documentTop >= topOffset + threshold + element.offsetHeight;
        const isAtLeftOfViewport = documentLeft >= leftOffset + threshold + element.offsetWidth;

        return !isBelowViewport && !isAboveViewport && !isAtRightOfViewport && !isAtLeftOfViewport;
    }

    private getDimension(): { width: number, height: number }
    {
        return {
            width: this.element.nativeElement.parentElement.offsetWidth,
            height: this.element.nativeElement.parentElement.offsetHeight,
        };
    }

    private isHidden(element: HTMLElement): boolean
    {
        return window.getComputedStyle(element).display === 'none';
    }
}
