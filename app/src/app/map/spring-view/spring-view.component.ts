import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page';
import { SpringsService } from '../../common/services/springs-service';
import { localize } from "nativescript-localize";
import { LanguageService } from '../../common/services/language-service';
import { AlertService } from '../../common/services/alert-service';
import { Router } from "@angular/router";
import { FullSpring } from '~/app/common/models/fullSpring';
import { ActivatedRoute } from "@angular/router";
import { openUrl } from "tns-core-modules/utils/utils";
import { ImageSource } from "tns-core-modules/image-source";
import * as SocialShare from "nativescript-social-share";
import { UserService } from '~/app/common/services/userService';
import { ModalDialogOptions, ModalDialogService } from 'nativescript-angular/modal-dialog';
import { UpdateSpringModalComponent } from './update-spring/updateSpringModal.component';

@Component({
    selector: 'ns-spring-view',
    templateUrl: './spring-view.component.html',
    styleUrls: ['./spring-view.component.scss']
})
export class SpringsViewComponent implements OnInit {
    commentHeight = 60;
    rightToLeft = true;
    shouldReverse = true;
    mainColor = "rgb(35, 204, 153)";
    spring: FullSpring;
    loading = true;
    currentSpring: any = {}
    googleMapsURL = "https://maps.google.com/?daddr=";
    wazeURL = "waze://?ll=";
    springLocation;
    fullComments = false;
    constructor(private page: Page,
        private router: Router,
        private route: ActivatedRoute,
        private springsService: SpringsService,
        private languageService: LanguageService,
        private alertService: AlertService,
        private userService: UserService,
        private modalService: ModalDialogService,
        private viewContainerRef: ViewContainerRef) {
    }

    ngOnInit(): void {
        this.page.actionBarHidden = true;
        this.rightToLeft = this.languageService.getRightToLeft();

        // this.springsService.getSpring("מעיין אביאל").subscribe((spring: FullSpring) => {
            this.springsService.getSpring(this.route.snapshot.params.springId).subscribe((spring: FullSpring) => {
            this.loading = false;
            this.currentSpring = spring;

            this.springLocation = `${this.currentSpring.location._latitude},${this.currentSpring.location._longitude}`;

        }, err => {
            console.log(err);
            this.handleErrors(err);
        })
    }

    clickOnFavorites() {
        if (this.currentSpring.isFavorite !== undefined) {
            if (this.currentSpring.isFavorite) {
                this.removeFromFavorites();
            } else {
                this.addToFavorites();
            }
        }
    }

    addToFavorites() {
        this.currentSpring.isFavorite = true;
        this.userService.addFavoriteSpring(this.currentSpring.ID).subscribe(res => {
            console.log("spring added to favorites");

        }, err => {
            this.handleErrors(err);
        })
    }

    removeFromFavorites() {
        this.currentSpring.isFavorite = false;
        this.userService.removeFavoriteSpring(this.currentSpring.ID).subscribe(res => {
            console.log("spring removed from favorites");

        }, err => {
            this.handleErrors(err)
        })
    }

    updateSpring() {
        const options: ModalDialogOptions = {
            viewContainerRef: this.viewContainerRef,
            fullscreen: false,
            context: this.currentSpring.name
        };
        this.modalService.showModal(UpdateSpringModalComponent, options).then(text => {
            if (text) {
                this.springsService.updateSpring(text + ".\n", this.currentSpring.ID).subscribe(() => {
                    this.alertService.showSuccess(localize('springView.thankYou'));
                }, err => this.handleErrors(err));
            }
        });
    }

    alignVertical(label) {
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

    async shareSpring() {
        const imgsrc = await ImageSource.fromUrl(this.currentSpring.images[0]);
        try {
            var springText = `*${this.currentSpring.name}*\n${this.currentSpring.description}
        \n${this.getTextFromFields()}\n${localize("springView.navigateWithWaze")}:
        https://www.waze.com/ul?ll=${this.currentSpring.location._latitude}%2C${this.currentSpring.location._longitude}&navigate=yes\n\n${localize("springView.shareLink")}:\n123456 just some link here lorem ipsum`; // to do - put here real link!!!
            SocialShare.shareImage(imgsrc, springText)
        } catch (error) {
            console.log(error);
        }
    }

    addComment(input) {
        if (input.text) {
            this.springsService.addComment(input.text, this.currentSpring.ID).subscribe(res => {
                input.text = "";
                console.log(res);
                res.date = { _seconds: new Date().getTime() / 1000 };
                this.currentSpring.comments.push(res);
            }, err => {
                this.handleErrors(err);
            })
        }
    }

    getTextFromFields() {
        var txt = "";
        if (this.currentSpring.depth) {
            txt += `${localize("springView.depth")}: ${this.currentSpring.depth}\n`;
        }

        if (this.currentSpring.distanceFromCar) {
            txt += `${localize("springView.walkingDistanceFromCar")}: ${this.currentSpring.distanceFromCar}\n`;
        }

        if (this.currentSpring.preferredSeason) {
            txt += `${localize("springView.preferredSeason")}: ${this.currentSpring.preferredSeason}\n`;
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
