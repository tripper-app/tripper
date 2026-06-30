import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';


@Component({ standalone: false,
    selector: 'ns-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements AfterViewInit {
    @ViewChild('carouselEl', { static: false }) carouselEl: ElementRef;
    @Input() carouselHeight: number;
    @Input() Images: string[];
    @Output() imageTapped: EventEmitter<any> = new EventEmitter();

    ngAfterViewInit(): void {
        // When the spring detail loads via an async (off-zone) HTTP response the
        // carousel is created after the surrounding layout, and the ViewPager's
        // adapter can populate before the *ngFor slide children are attached ->
        // blank pages. (It works on a 2nd open only because the spring is then
        // cached and the carousel is built synchronously.) Once the view + children
        // are initialized, force the ViewPager to rebuild from the now-present
        // children. This is a native call, so it's safe outside Angular's zone.
        setTimeout(() => {
            const carousel: any = this.carouselEl && this.carouselEl.nativeElement;
            if (carousel && typeof carousel.refresh === 'function') {
                carousel.refresh();
            }
        }, 0);
    }

    click() {
        this.imageTapped.emit();
    }
}
