import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { Router } from "@angular/router";
import { ModalDialogOptions, ModalDialogService } from "@nativescript/angular/modal-dialog";
import { GridLayout, Image, Page, PanGestureEventData, StackLayout } from "@nativescript/core";
import { LanguageService } from "~/app/common/services/language-service";
import { StartModalComponent } from "./startModal/startModal.component";
import { screen } from "tns-core-modules/platform";
import { GamesService } from "~/app/common/services/games-service";

@Component({
    selector: 'ns-landKing',
    templateUrl: './landKing.component.html',
    styleUrls: ['./landKing.component.scss']
})
export class LandKingComponent implements OnInit {
    timer = 180000;
    rightToLeft = true;
    waitingForResponse = false;
    // @ViewChild("dragGrid", { static: false }) dragGrid: ElementRef;
    // dragImageItem: GridLayout;
    // @ViewChild("container", { static: false }) container: ElementRef;
    // @ViewChild("dragImage", { static: false }) dragImage: ElementRef;
    // itemContainer: GridLayout;
    // prevDeltaX: number;
    // prevDeltaY: number;
    // first = true;
    // mapGap = 150;
    locations = [];
    allLocations = [];
    constructor(private page: Page,
        private modalService: ModalDialogService,
        private viewContainerRef: ViewContainerRef,
        private router: Router,
        private languageService: LanguageService,
        private gameService: GamesService) {
        this.page.actionBarHidden = true;
    }
    ngOnInit() {
        this.rightToLeft = this.languageService.getRightToLeft();
        this.openModal();
    }

    openModal() {
        const options: ModalDialogOptions = {
            viewContainerRef: this.viewContainerRef,
            fullscreen: false
        };
        this.modalService.showModal(StartModalComponent, options).then(ok => {
            if (ok) {
                this.waitingForResponse = true;
                this.gameService.getLocations().subscribe(res => {
                    this.allLocations = res;
                    this.waitingForResponse = false;
                    this.addLocation();
                    // this.initPanStats();
                    setInterval(() => {
                        this.timer -= 1000;
                        if (this.timer <= 0) {
                            this.exit();// score
                        }
                    }, 1000)
                }, err => {
                    // handle errors
                })
            } else {
                setTimeout(() => {
                    this.router.navigate(['mainTabs', 1]);
                }, 0);
            }
        });
    }

    // initPanStats() {
    //     this.dragImageItem = <GridLayout>this.dragGrid.nativeElement;
    //     this.dragImageItem.translateX = 0;
    //     this.dragImageItem.translateY = 0;
    //     this.dragImageItem.scaleX = 1;
    //     this.dragImageItem.scaleY = 1;

    //     this.itemContainer = <GridLayout>this.container.nativeElement;
    // }

    // onPan(args: PanGestureEventData) {
    //     // console.log("Pana: [" + args.deltaX + ", " + args.deltaY + "] state: " + args.state);        
    //     if (this.first) {
    //         this.first = false;
    //         this.dragGrid.nativeElement.androidElevation = 0;
    //         this.dragGrid.nativeElement.animate({ height: 70, duration: 200 }).then(() => {
    //             this.dragGrid.nativeElement.columns = "*,*,*";
    //             // this.dragGrid.nativeElement.backgroundColor = 'transparent';
    //         });
    //         this.dragGrid.nativeElement.animate({ backgroundColor: 'transparent', duration: 100 });
    //     }
    //     if (args.state === 1) // down
    //     {
    //         this.prevDeltaX = 0;
    //         this.prevDeltaY = 0;
    //     }
    //     else if (args.state === 2) // panning
    //     {
    //         this.dragImageItem.translateX += args.deltaX - this.prevDeltaX;
    //         this.dragImageItem.translateY += args.deltaY - this.prevDeltaY;

    //         this.prevDeltaX = args.deltaX;
    //         this.prevDeltaY = args.deltaY;

    //         if (this.dragImageItem.translateX < screen.mainScreen.widthDIPs / -2) {
    //             this.dragImageItem.translateX = screen.mainScreen.widthDIPs / -2;
    //         }
    //         else if (this.dragImageItem.translateX > screen.mainScreen.widthDIPs / 2) {
    //             this.dragImageItem.translateX = screen.mainScreen.widthDIPs / 2;
    //         }

    //         if (this.dragImageItem.translateY < (screen.mainScreen.heightDIPs - this.mapGap) / -2) {
    //             this.dragImageItem.translateY = (screen.mainScreen.heightDIPs - this.mapGap) / -2
    //         }
    //         else if (this.dragImageItem.translateY > (screen.mainScreen.heightDIPs - this.mapGap) / 2) {
    //             this.dragImageItem.translateY = (screen.mainScreen.heightDIPs - this.mapGap) / 2;
    //         }
    //     }
    //     else if (args.state === 3) // up
    //     {
    //         console.log("x: " + (this.dragImageItem.translateX + screen.mainScreen.widthDIPs / 2) / screen.mainScreen.widthDIPs);
    //         console.log("y: " + (this.dragImageItem.translateY + (screen.mainScreen.heightDIPs - this.mapGap) / 2) / (screen.mainScreen.heightDIPs - this.mapGap));

    //     }
    // }

    userLocate(data) {        
        this.gameService.locate(this.locations[this.locations.length-1], data);
        this.addLocation();
    }

    addLocation() {
        if (this.allLocations.length) {
            this.locations.push(this.allLocations.splice(Math.random() * this.allLocations.length - 1, 1)[0]);
        } else {
            this.navigateToScroe();
        }
    }

    alignVertical(label) {
        label.android.setGravity(17)
    }

    navigateToScroe() {
        this.router.navigate(['score']);
    }

    exit() {
        this.router.navigate(['mainTabs', 1]);
    }
}