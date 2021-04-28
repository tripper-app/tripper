import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from "@angular/core";
import { Router } from "@angular/router";
import { ModalDialogOptions, ModalDialogService } from "@nativescript/angular/modal-dialog";
import { GridLayout, Image, Page, PanGestureEventData, StackLayout } from "@nativescript/core";
import { LanguageService } from "~/app/common/services/language-service";
import { screen } from "tns-core-modules/platform";
import { Location } from "~/app/common/models/location";

@Component({
    selector: 'ns-location-component',
    templateUrl: './locationComponent.component.html',
    styleUrls: ['./locationComponent.component.scss']
})
export class LocationComponentComponent implements OnInit {
    @Input() container: ElementRef;
    @Input() location: Location;
    @Output() draggedEmitter: EventEmitter<{x, y}> = new EventEmitter();
    @ViewChild("dragGrid", { static: false }) dragGrid: ElementRef;
    // @ViewChild("container", { static: false }) container: ElementRef;
    @ViewChild("dragImage", { static: false }) dragImage: ElementRef;
    rightToLeft = true;
    dragImageItem: GridLayout;
    itemContainer: GridLayout;
    prevDeltaX: number;
    prevDeltaY: number;
    mapGap = 150;
    first = true;
    placed = false;
    constructor(private page: Page,
        private languageService: LanguageService) {
    }

    ngOnInit() {
        this.rightToLeft = this.languageService.getRightToLeft();
        setTimeout(() => {
            this.initPanStats();
        }, 0);
    }

    initPanStats() {
        this.dragImageItem = <GridLayout>this.dragGrid.nativeElement;
        this.dragImageItem.translateX = 0;
        this.dragImageItem.translateY = 0;
        this.dragImageItem.scaleX = 1;
        this.dragImageItem.scaleY = 1;

        this.itemContainer = <GridLayout>this.container.nativeElement;
    }

    onPan(args: PanGestureEventData) {
        if (!this.placed) {
            if (this.first) {
                this.first = false;
                this.dragGrid.nativeElement.androidElevation = 0;
                this.dragGrid.nativeElement.animate({ height: 50, duration: 200 }).then(() => {
                    this.dragGrid.nativeElement.columns = "*,*,*";
                    // this.dragGrid.nativeElement.backgroundColor = 'transparent';
                });
                this.dragGrid.nativeElement.animate({ backgroundColor: 'transparent', duration: 100 });
            }
            if (args.state === 1) // down
            {
                this.prevDeltaX = 0;
                this.prevDeltaY = 0;
            }
            else if (args.state === 2) // panning
            {
                this.dragImageItem.translateX += args.deltaX - this.prevDeltaX;
                this.dragImageItem.translateY += args.deltaY - this.prevDeltaY;

                this.prevDeltaX = args.deltaX;
                this.prevDeltaY = args.deltaY;

                if (this.dragImageItem.translateX < screen.mainScreen.widthDIPs / -2) {
                    this.dragImageItem.translateX = screen.mainScreen.widthDIPs / -2;
                }
                else if (this.dragImageItem.translateX > screen.mainScreen.widthDIPs / 2) {
                    this.dragImageItem.translateX = screen.mainScreen.widthDIPs / 2;
                }

                if (this.dragImageItem.translateY < (screen.mainScreen.heightDIPs - this.mapGap) / -2) {
                    this.dragImageItem.translateY = (screen.mainScreen.heightDIPs - this.mapGap) / -2
                }
                else if (this.dragImageItem.translateY > (screen.mainScreen.heightDIPs - this.mapGap) / 2) {
                    this.dragImageItem.translateY = (screen.mainScreen.heightDIPs - this.mapGap) / 2;
                }
            }
            else if (args.state === 3) // up
            {
                const click = { x: (this.dragImageItem.translateX + screen.mainScreen.widthDIPs / 2) / screen.mainScreen.widthDIPs, y: 1-((this.dragImageItem.translateY + (screen.mainScreen.heightDIPs - this.mapGap) / 2) / (screen.mainScreen.heightDIPs - this.mapGap)) };
                // console.log("x: " + (this.dragImageItem.translateX + screen.mainScreen.widthDIPs / 2) / screen.mainScreen.widthDIPs);
                // console.log("y: " + (this.dragImageItem.translateY + (screen.mainScreen.heightDIPs - this.mapGap) / 2) / (screen.mainScreen.heightDIPs - this.mapGap));
                this.placed = true;
                this.draggedEmitter.emit(click);
            }
        }
    }

    alignVertical(label) {
        label.android.setGravity(17)
    }

    exit() {

    }
}