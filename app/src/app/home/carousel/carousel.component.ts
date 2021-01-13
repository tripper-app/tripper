import { Component, OnDestroy, OnInit } from '@angular/core';
import { isAndroid } from 'tns-core-modules/platform';

@Component({
    selector: 'ns-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit, OnDestroy {
    // images = [
    //     "https://firebasestorage.googleapis.com/v0/b/springs-289320.appspot.com/o/%D7%92%D7%9C%D7%A8%D7%99%D7%94%2Fgallery_image%201.jpeg?alt=media&token=d6caca6b-fe1d-41c3-88ca-bc40f00bc54b",
    //     "https://firebasestorage.googleapis.com/v0/b/springs-289320.appspot.com/o/%D7%92%D7%9C%D7%A8%D7%99%D7%94%2Fgallery_image%202.jpeg?alt=media&token=bd638209-0575-4c0c-82b4-f696657a4979",
    //     "https://firebasestorage.googleapis.com/v0/b/springs-289320.appspot.com/o/%D7%92%D7%9C%D7%A8%D7%99%D7%94%2F%D7%A2%D7%99%D7%9F%20%D7%A9%D7%95%D7%A7%D7%95.jpeg?alt=media&token=a8238e39-df29-4240-835e-152721277664",
    //     "https://firebasestorage.googleapis.com/v0/b/springs-289320.appspot.com/o/%D7%92%D7%9C%D7%A8%D7%99%D7%94%2Fgallery_image%203.jpeg?alt=media&token=d0482af3-2d01-4b80-8fa1-a63612fc8496",
    //     "https://firebasestorage.googleapis.com/v0/b/springs-289320.appspot.com/o/%D7%92%D7%9C%D7%A8%D7%99%D7%94%2Fgallery_image%204.jpeg?alt=media&token=d490ef1c-0143-45ad-82b6-3f0991e3c85a",
    //     "https://firebasestorage.googleapis.com/v0/b/springs-289320.appspot.com/o/%D7%92%D7%9C%D7%A8%D7%99%D7%94%2Fgallery_image%205.jpeg?alt=media&token=bea200e9-4ea6-48bc-9d6d-11c521028193",
    //     "https://firebasestorage.googleapis.com/v0/b/springs-289320.appspot.com/o/%D7%92%D7%9C%D7%A8%D7%99%D7%94%2Fgallery_image%206.jpeg?alt=media&token=02da90aa-ed26-4f5a-b6b1-cb1094495e82"
    // ]

    images = [
        "~/assets/gallery_image 1.png",
        "~/assets/gallery_image 2.png",
        "~/assets/gallery_image 3.png",
        "~/assets/gallery_image 4.png",
        "~/assets/gallery_image 5.png",
        "~/assets/gallery_image 6.png",
    ]
    

    imageIndex = 0;
    interval;
    constructor() {
    }

    ngOnInit() {
        this.resetInterval();
    }

    resetInterval(){
        clearInterval(this.interval);
        this.interval = setInterval(() => {
            if (!this.moveForward()) {
                this.imageIndex = 0;
            }
        }, 4000);
    }

    moveForward() {
        this.resetInterval();
        if (this.imageIndex < this.images.length - 1) {
            this.imageIndex++;
            return true;
        }
        return false;
    }

    moveBackward() {
        this.resetInterval();
        if (this.imageIndex > 0) {
            this.imageIndex--;
        }
    }

    moveByIndex(index){
        this.resetInterval();
        this.imageIndex = index;
    }

    onLabelLoaded(args) {
        const lbl = args.object;
        if (isAndroid) {
            lbl.android.setGravity(17)
        }
    }

    ngOnDestroy(){
        clearInterval(this.interval);
    }
}