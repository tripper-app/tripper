import { Component, OnInit, ViewContainerRef, ViewChild, ElementRef, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import { Router } from "@angular/router";
import { Page } from 'tns-core-modules/ui/page';
import { SettingModalComponent } from '../setting/setting.component';
import { LanguageService } from '../common/services/language-service';
import * as imagepicker from "nativescript-imagepicker";
import { AnimationCurve } from "tns-core-modules/ui/enums";
import { GridLayout } from "tns-core-modules/ui/layouts/grid-layout";
import { isAndroid, screen } from "tns-core-modules/platform";
import { PanGestureEventData, GestureStateTypes, GestureEventData } from "tns-core-modules/ui/gestures";
import { SelectedIndexChangedEventData } from "tns-core-modules/ui/tab-view";

import { ImageSource } from 'tns-core-modules/image-source';
import { HttpService } from '../common/services/http-service';
import * as btoa from 'btoa';
import { DrawerService } from '../common/services/drawer-service';

declare let android: any; // or use tns-platform-declarations
declare let java: any;

@Component({
    selector: 'ns-mainTabs',
    templateUrl: './main-tabs.component.html',
    styleUrls: ['./main-tabs.component.css']
})
export class MainTabsComponent implements OnInit {
    @ViewChild('tabs', { static: true }) tabs: ElementRef;
    @ViewChild('centerCircle', { static: true }) centerCircle: ElementRef;
    @ViewChild('dragCircle', { static: true }) dragCircle: ElementRef;
    @ViewChild('leftTabs', { static: true }) leftTabs: ElementRef;
    @ViewChild('rightTabs', { static: true }) rightTabs: ElementRef;
    @ViewChild('centerPatch', { static: true }) centerPatch: ElementRef;
    @ViewChild('tabBGContainer', { static: true }) tabBGContainer: ElementRef;
    @ViewChildren('tabContents', { read: ElementRef }) tabContents: QueryList<ElementRef>;

    currentTabIndex: number = 2;
    defaultSelected: number = 2;

    tabContainer = {
        backgroundColor: '#fff',
        focusColor: '#fff'
    };
    tabList: { text: string, icon?: string, color?: string, backgroundColor: string, fadeColor?: string }[] = [
        { text: "A", backgroundColor: '#5B37B7', color: '#000' },
        { text: "B", backgroundColor: '#E6A938', color: '#000' },
        { text: "C", backgroundColor: '#C9449D', color: '#000' },
        { text: "D", backgroundColor: '#4195AA', color: '#000' },
        { text: "E", backgroundColor: '#4A9F6E', color: '#000' }
    ];


    // Tab Helper
    isAndroid = isAndroid;
    private prevDeltaX: number = 0;
    private animationCurve = AnimationCurve.cubicBezier(.38, .47, 0, 1);
    private androidTargetTabIndex: number = this.defaultSelected;

    constructor(private router: Router,
        private page: Page,
        private viewContainerRef: ViewContainerRef,
        private modalService: ModalDialogService,
        private languageService: LanguageService,
        private httpService: HttpService,
        private drawerService: DrawerService) {
    }

    ngOnInit() {
        this.languageService.getCurrentLanguage();
        this.page.actionBarHidden = true;
    }

    goToMap() {
        this.router.navigate(['map']);
    }

    goToLogin() {
        this.router.navigate(['login']);
    }

    goToSignUp() {
        this.router.navigate(['signUp']);
    }

    openSetting() {
        const options: ModalDialogOptions = {
            viewContainerRef: this.viewContainerRef,
            fullscreen: false
        };
        this.modalService.showModal(SettingModalComponent, options);

    }

    async uploadImage() {
        let context = imagepicker.create({
            mode: "single" // use "multiple" for multiple selection
        });
        context.authorize().then(() => {
            return context.present();
        }).then((selection) => {
            const image = selection[0];
            image.getImageAsync((img, err) => {
                if (err) {
                    console.log(err);
                } else {
                    let byteArrayOutputStream = new java.io.ByteArrayOutputStream();
                    img.compress(android.graphics.Bitmap.CompressFormat.JPEG, 100, byteArrayOutputStream);
                    let byteArray = byteArrayOutputStream.toByteArray();
                    var base64 = btoa(new Uint8Array(byteArray).reduce((data, byte) => data + String.fromCharCode(byte), ''));

                    this.httpService.updateProfile(base64).subscribe(res => {
                        console.log("MIRACLE");
                        console.log(res);
                    }, err => {
                        console.log("ERROR");
                        console.log(err);
                    })
                }
            })

        }).catch(function (e) {
            console.log("ERROR");
            console.log(e);
        });
    }


    onSelectedIndexChanged(args: SelectedIndexChangedEventData): void {
        if (isAndroid && args.newIndex !== this.androidTargetTabIndex) {
            this.drawerService.sideDrawer = this.androidTargetTabIndex === 0;
            // NOTE: this is a workaround for android firing this event multiple times,
            // and stopping on the wrong tab
            // TODO: fix this
            setTimeout(() => {
                this.tabs.nativeElement.selectedIndex = this.androidTargetTabIndex;
            })
        }
        // TODO: unocmment this if swipeEnabled
        // Figure out a way to differentiate between selected index is fired
        // from swipe event or from setting index programmatically
        // if (args.newIndex !== this.currentTabIndex) {
        //     this.onBottomNavTap(args.newIndex);
        // }
    }

    // Tap on a one of the tabs
    onBottomNavTap(index: number, duration: number = 300): void {
        if (index < 0) {
           index = 0;
        } else if (index > this.tabList.length-1) {
            index = this.tabList.length-1;
        }
        const currentIndex = this.tabs.nativeElement.selectedIndex;
        
        if (currentIndex !== index) {
            const tabContentsArr = this.tabContents.toArray();
            
            // set unfocus to previous index
            tabContentsArr[currentIndex].nativeElement.animate(this.getUnfocusAnimation(currentIndex, duration)).catch(e => { });
            
            // set focus to current index            
            tabContentsArr[index].nativeElement.animate(this.getFocusAnimation(index, duration)).catch(e => { });

            // set current index to new index
            this.androidTargetTabIndex = index;
            this.tabs.nativeElement.selectedIndex = index;
        }
        this.centerCircle.nativeElement.backgroundColor = '#fff';
        // this.centerCircle.nativeElement.backgroundColor = this.tabList[index].backgroundColor;
        this.centerCircle.nativeElement.animate(this.getSlideAnimation(index, duration)).catch(e => { });
        this.leftTabs.nativeElement.animate(this.getSlideAnimation(index, duration)).catch(e => { });
        this.rightTabs.nativeElement.animate(this.getSlideAnimation(index, duration)).catch(e => { });
        this.centerPatch.nativeElement.animate(this.getSlideAnimation(index, duration)).catch(e => { });
        this.dragCircle.nativeElement.animate(this.getSlideAnimation(index, duration)).catch(e => { });
    }

    // Drag the focus circle to one of the tabs
    onCenterCirclePan(args: PanGestureEventData): void {
        let grdLayout: GridLayout = <GridLayout>args.object;
        let newX: number = grdLayout.translateX + args.deltaX - this.prevDeltaX;

        if (args.state === 0) {
            // finger down
            this.prevDeltaX = 0;
        } else if (args.state === 2) {
            // finger moving
            grdLayout.translateX = newX;
            this.leftTabs.nativeElement.translateX = newX;
            this.rightTabs.nativeElement.translateX = newX;
            this.centerPatch.nativeElement.translateX = newX;
            this.centerCircle.nativeElement.translateX = newX;

            this.prevDeltaX = args.deltaX;
        } else if (args.state === 3) {
            // finger up
            this.prevDeltaX = 0;
            const tabWidth = screen.mainScreen.widthDIPs / this.tabList.length;
            const tabSelected: number = Math.round(Math.abs(newX / tabWidth));
            // const translateX: number = tabSelected * tabWidth;
            if (newX < 0) {
                // pan left
                this.onBottomNavTap(this.defaultSelected - tabSelected, 50);
            } else {
                // pan right
                this.onBottomNavTap(this.defaultSelected + tabSelected, 50);
            }
        }
    }

    // --------------------------------------------------------------------
    // Tab bar helpers

    onTabsLoaded(args): void {
        if (args.object.ios) {
            args.object.ios.tabBar.hidden = true;
        }
    }

    ontabContentsLoaded(args): void {       
        // set up base layer
        this.leftTabs.nativeElement.width = screen.mainScreen.widthDIPs;
        this.rightTabs.nativeElement.width = screen.mainScreen.widthDIPs;
        this.centerPatch.nativeElement.width = 100;

        this.tabBGContainer.nativeElement.translateX = - (screen.mainScreen.widthDIPs / 2) - (80 / 2);

        // set default selected tab
        this.centerCircle.nativeElement.backgroundColor = '#fff';
        // this.centerCircle.nativeElement.backgroundColor = this.tabList[this.defaultSelected].backgroundColor;
        const tabContentsArr = this.tabContents.toArray();
        tabContentsArr[this.androidTargetTabIndex].nativeElement.scaleX = 1.5;
        tabContentsArr[this.androidTargetTabIndex].nativeElement.scaleY = 1.5;
        tabContentsArr[this.androidTargetTabIndex].nativeElement.translateY = - 15;
        // tabContentsArr[this.androidTargetTabIndex].nativeElement.translateX = - 4;
        this.tabs.nativeElement.selectedIndex = this.currentTabIndex;
    }

    getSlideAnimation(index: number, duration: number) {
        return {
            translate: { x: this.getTabTranslateX(index), y: 0 },
            curve: this.animationCurve,
            duration: duration
        };
    }

    getFocusAnimation(index: number, duration: number) {
        return {
            scale: { x: 1.5, y: 1.5 },
            translate: { x: 0, y: -15 },
            duration: duration
        };
    }

    getUnfocusAnimation(index: number, duration: number) {
        return {
            scale: { x: 1, y: 1 },
            translate: { x: 0, y: 0 },
            duration: duration
        };
    }

    getTabTranslateX(index: number): number {
        return index * screen.mainScreen.widthDIPs / this.tabList.length - (screen.mainScreen.widthDIPs / 2) + (80 / 2);
    }
}