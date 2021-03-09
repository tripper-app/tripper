import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import { Router } from "@angular/router";
import { Page } from 'tns-core-modules/ui/page';
import { SettingModalComponent } from '../setting/setting.component';
import { LanguageService } from '../common/services/language-service';
import * as imagepicker from "nativescript-imagepicker";
import { ActivatedRoute } from "@angular/router";

import { ImageSource } from 'tns-core-modules/image-source';
import { HttpService } from '../common/services/http-service';
import * as btoa from 'btoa';
import { DrawerService } from '../common/services/drawer-service';
import { HotelsService } from '../common/services/hotels-service';
import { UserService } from '../common/services/userService';

declare let android: any; // or use tns-platform-declarations
declare let java: any;

@Component({
    selector: 'ns-mainTabs',
    templateUrl: './main-tabs.component.html',
    styleUrls: ['./main-tabs.component.css']
})
export class MainTabsComponent implements OnInit {
    // @ViewChild('tabs', {static: false}) tabs;
    selectedPageIndex = 0;
    tabsVisibility = true;
    showList = false;
    constructor(private router: Router,
        private route: ActivatedRoute,
        private page: Page,
        private viewContainerRef: ViewContainerRef,
        private modalService: ModalDialogService,
        private languageService: LanguageService,
        private httpService: HttpService,
        private drawerService: DrawerService,
        private hotelService: HotelsService,
        private userService: UserService) {
    }

    ngOnInit() {
        this.languageService.getCurrentLanguage();
        this.page.actionBarHidden = true;
        if (this.route.snapshot.params.page) {
            this.selectedPageIndex = this.route.snapshot.params.page;
        }
    }

    // goToMap() {
    //     this.router.navigate(['map']);
    // }

    // goToLogin() {
    //     this.router.navigate(['login']);
    // }

    // goToSignUp() {
    //     this.router.navigate(['signUp']);
    // }

    // navigatetoMap(){
    //     this.tabsVisibility = true;
    //     console.log(this.tabs.selecteIndex);
        
    //     this.tabs.selecteIndex = 3;
    //     console.log(this.tabs.selecteIndex);
    // }

    // openSetting() {
    //     const options: ModalDialogOptions = {
    //         viewContainerRef: this.viewContainerRef,
    //         fullscreen: false
    //     };
    //     this.modalService.showModal(SettingModalComponent, options);

    // }

    pageChange(index) {
        if (index != 2) {
            this.hotelService.showList = false;            
            if (index == 0 && !this.userService.showProfile) {
                this.tabsVisibility = false;
            }else{
                this.tabsVisibility = true;
            }
        } else {
            this.tabsVisibility = false;
        }
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
}