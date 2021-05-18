import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { GridLayout, Page, PanGestureEventData } from "@nativescript/core";
import { LanguageService } from "~/app/common/services/language-service";
import { screen } from "tns-core-modules/platform";
import { Location } from "~/app/common/models/location";

@Component({
    selector: 'ns-location-component',
    templateUrl: './locationComponent.component.html',
    styleUrls: ['./locationComponent.component.scss']
})
export class LocationComponentComponent implements OnInit {
    @Input() container;
    @Input() location: Location;
    @Input() feedback;
    @Output() draggedEmitter: EventEmitter<{ x, y }> = new EventEmitter();
    @Output() draggStartEmitter: EventEmitter<any> = new EventEmitter();
    @ViewChild("dragGrid", { static: false }) dragGrid: ElementRef;
    @ViewChild("dragImage", { static: false }) dragImage: ElementRef;
    rightToLeft = true;
    dragImageItem: GridLayout;
    itemContainer: GridLayout;
    prevDeltaX: number;
    prevDeltaY: number;
    showFeedback = true;
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

        setTimeout(() => {
            this.feedback = undefined;
        }, 1000);
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
                this.draggStartEmitter.emit();
                this.dragGrid.nativeElement.androidElevation = 0;
                this.dragGrid.nativeElement.animate({ height: 40, duration: 200 }).then(() => {
                    this.dragGrid.nativeElement.columns = "*,*,*";
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

                if (this.dragImageItem.translateY < (this.container.getActualSize().height) / -2) {
                    this.dragImageItem.translateY = (this.container.getActualSize().height) / -2
                }
                else if (this.dragImageItem.translateY > (this.container.getActualSize().height) / 2) {
                    this.dragImageItem.translateY = (this.container.getActualSize().height) / 2;
                }
            }
            else if (args.state === 3) // up
            {
                const click = {
                    x: (this.dragImageItem.translateX + screen.mainScreen.widthDIPs / 2) / screen.mainScreen.widthDIPs,
                    y: 1 - ((this.dragImageItem.translateY + (this.container.getActualSize().height) / 2) / (this.container.getActualSize().height))
                };
                this.placed = true;
                this.draggedEmitter.emit(click);
            }
        }
    }

    alignVertical(label) {
        label.android.setGravity(17)
    }
}