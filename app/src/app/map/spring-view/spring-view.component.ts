import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page';
import { SpringsService } from '../../common/services/springs-service';
import { localize } from "nativescript-localize";
import { LanguageService } from '../../common/services/language-service';
import * as application from "tns-core-modules/application";
import { AlertService } from '../../common/services/alert-service';
import { Router } from "@angular/router";
import { FullSpring } from '~/app/common/models/fullSpring';
import { ActivatedRoute } from "@angular/router";
import { openUrl } from "tns-core-modules/utils/utils";
import { ImageSource } from "tns-core-modules/image-source";
import * as SocialShare from "nativescript-social-share";
import {  device } from "tns-core-modules/platform";

@Component({
    selector: 'ns-spring-view',
    templateUrl: './spring-view.component.html',
    styleUrls: ['./spring-view.component.scss']
})
export class SpringsViewComponent implements OnInit {
    rightToLeft = true;
    shouldReverse = true;
    mainColor = "rgb(146, 226, 131)";
    spring: FullSpring;
    loading = true;
    currentSpring: any = {}
    googleMapsURL = "https://maps.google.com/?daddr=";
    wazeURL = "waze://?ll=";
    springLocation;
    constructor(private page: Page,
        private router: Router,
        private route: ActivatedRoute,
        private springsService: SpringsService,
        private languageService: LanguageService,
        private alertService: AlertService) {
    }

    ngOnInit(): void {
        this.page.actionBarHidden = true;
        this.shouldReverse = this.languageService.getCurrentLanguage() == device.language;

        // this.springsService.getSpring("עינות דקלים").subscribe((spring: FullSpring) => {
            this.springsService.getSpring(this.route.snapshot.params.springId).subscribe((spring: FullSpring) => {
            this.loading = false;
            this.currentSpring = spring;
            this.springLocation = `${this.currentSpring.location._latitude},${this.currentSpring.location._longitude}`;
            
        }, err => {
            console.log(err);
            this.handleErrors(err);
        })
    }

    favorites() {

    }

    alignVertical(label){
        label.android.setGravity(17)
    }

    navigateToMap() {        
        this.router.navigate(["mainTabs/", 3]);
    }

    navigateWithMaps() {
        openUrl(this.googleMapsURL + this.springLocation);
    }

    navigateWithWaze() {
        openUrl(this.wazeURL + this.springLocation);
    }

    async share() {
        const imgsrc = await ImageSource.fromUrl(this.currentSpring.images[0]);
        try {
            var springText = `*${this.currentSpring.name}*\n${this.currentSpring.description}
    \n${this.getTextFromFields()}
    ${localize("springModal.navigateWithWaze")}:
    https://www.waze.com/ul?ll=${this.currentSpring.location._latitude}%2C${this.currentSpring.location._longitude}&navigate=yes\n
    ${localize("springModal.shareLink")}:
    123456 just some link here lorem ipsum`; // to do - put here real link!!!
            SocialShare.shareImage(imgsrc, springText)
        } catch (error) {
            console.log(error);
        }
    }

    addComment(text){
        this.springsService.addComment(text, this.currentSpring.ID).subscribe(res => {
          console.log("good");
          console.log(res);
          
        }, err => {
          console.log("not good");
          console.log(err);
          
        })
      }


    getTextFromFields() {
        var txt = "";
        if (this.currentSpring.depth) {
            txt += `${localize("springModal.depth")}: ${this.currentSpring.depth}\n`;
        }

        if (this.currentSpring.distanceFromCar) {
            txt += `${localize("springModal.walkingDistanceFromCar")}: ${this.currentSpring.distanceFromCar}\n`;
        }

        if (this.currentSpring.preferredSeason) {
            txt += `${localize("springModal.preferredSeason")}: ${this.currentSpring.preferredSeason}\n`;
        }

        return txt;
    }

    handleErrors(error) {
        console.log(error);
        switch (error.status) {
            case 0:
                this.alertService.showError(localize('messages.error.connectionError'));
                break;
            case 500:
                this.alertService.showError(localize("messages.error.serverError"));
            default:
                // alert default message
                break;
        }
    }
}
