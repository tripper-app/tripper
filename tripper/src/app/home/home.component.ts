import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
// import { PoolsService } from '../common/services/pools-service';
// import { RadSideDrawer } from "nativescript-ui-sidedrawer";
// import { getRootView } from "tns-core-modules/application";
import { Router } from "@angular/router";
import { Page } from 'tns-core-modules/ui/page';
import { SettingModalComponent } from '../setting/setting.component';
import { LanguageService } from '../common/services/language-service';
import { RadSideDrawer, SideDrawerLocation } from "nativescript-ui-sidedrawer";
import * as imagepicker from "nativescript-imagepicker";
import * as SocialShare from "nativescript-social-share";

import { ImageSource } from 'tns-core-modules/image-source';
import { HttpService } from '../common/services/http-service';
import * as btoa from 'btoa';

declare let android: any; // or use tns-platform-declarations
declare let java: any;

@Component({
    selector: 'ns-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


    constructor(private router: Router,
        private page: Page,
        private viewContainerRef: ViewContainerRef,
        private modalService: ModalDialogService,
        private languageService: LanguageService,
        private httpService: HttpService) {
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

    async share() {
        var image = await ImageSource.fromUrl("https://firebasestorage.googleapis.com/v0/b/springs-289320.appspot.com/o/springs%2F%D7%9E%D7%A2%D7%99%D7%99%D7%9F%20%D7%90%D7%91%D7%99%D7%90%D7%9C%2F%D7%9E%D7%A2%D7%99%D7%99%D7%9F%20%D7%90%D7%91%D7%99%D7%90%D7%9C%201.jpeg?alt=media&token=93a0454d-47de-4354-9efe-ffabd54f43d8");
        SocialShare.shareImage(image, "123")
        // SocialShare.shareImage(image, "456")
        //SocialShare.shareUrl("https://firebasestorage.googleapis.com/v0/b/springs-289320.appspot.com/o/springs%2F%D7%9E%D7%A2%D7%99%D7%99%D7%9F%20%D7%90%D7%91%D7%99%D7%90%D7%9C%2F%D7%9E%D7%A2%D7%99%D7%99%D7%9F%20%D7%90%D7%91%D7%99%D7%90%D7%9C%201.jpeg?alt=media&token=93a0454d-47de-4354-9efe-ffabd54f43d8", "some text", "some subject")
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