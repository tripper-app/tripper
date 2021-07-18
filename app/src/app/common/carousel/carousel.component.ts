import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { Image } from 'tns-core-modules/ui/image';
import { ImageSource } from "tns-core-modules/image-source";


@Component({
    selector: 'ns-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit, OnDestroy {
    ngOnInit(): void {
        this.loadImages();
        this.showingImage// = this.Images.map(a => "");
    }
    ngOnDestroy(): void {
        this.didNotLeft = false;
        this.imagesElements = [];
        // this.queryImages = new QueryList<Image>();
    }
    @Input() carouselHeight: number;
    @Input() Images: string[];
    @Output() imageTapped: EventEmitter<any> = new EventEmitter();

    // @ViewChildren('imagesQuery') queryImages: QueryList<Image>;
    imagesElements = [];
    showingImage = [];
    imagesCounter = 0;
    didNotLeft = true;

    // imagesUpdated() {
    //     //setTimeout(() => {
    //     this.imagesElements = this.queryImages.toArray();
    //     this.loadImages();
    //     //}, 0);
    // }

    loadImages() {
        try {
            if (this.imagesCounter < this.Images.length) {
                this.showingImage[this.imagesCounter] = this.Images[this.imagesCounter];
                this.imagesCounter++;
                setTimeout(() => {
                    this.loadImages();
                }, 500);
                // ImageSource.fromUrl(this.Images[this.imagesCounter]).then(res => {
                //     if (this.didNotLeft) {
                //         this.imagesElements[this.imagesCounter].nativeElement.imageSource = res;
                //         this.imagesCounter++;
                //         this.loadImages();
                //     }
                // })
            }
        } catch (error) {
            console.log('ERROR');
        }
    }

    click() {
        this.imageTapped.emit();
    }
}