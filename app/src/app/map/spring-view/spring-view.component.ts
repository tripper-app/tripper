import { ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
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
import { ErrorsService } from '~/app/common/services/errors-service';
import { registerSoftKeyboardCallback } from 'nativescript-soft-keyboard';

@Component({
    selector: 'ns-spring-view',
    templateUrl: './spring-view.component.html',
    styleUrls: ['./spring-view.component.scss']
})
export class SpringsViewComponent implements OnInit, OnDestroy {
    commentHeight = 60;
    rightToLeft = true;
    mainColor = "rgb(35, 204, 153)";
    spring: FullSpring;
    waitingForResponse = false;
    currentSpring: any = {}
    googleMapsURL = "https://maps.google.com/?daddr=";
    wazeURL = "waze://?ll=";
    springLocation;
    fullComments = false;
    thereIsComment = false;
    isKeyboardOpen = false;
    navigated = false;

    constructor(private page: Page,
        private router: Router,
        private springsService: SpringsService,
        private languageService: LanguageService,
        private alertService: AlertService,
        private userService: UserService,
        private modalService: ModalDialogService,
        private viewContainerRef: ViewContainerRef,
        private errorService: ErrorsService,
        private route: ActivatedRoute,
        private cd: ChangeDetectorRef,
        private zone: NgZone) {
    }
    ngOnDestroy(): void {
        this.navigated = true;
    }

    ngOnInit(): void {
        registerSoftKeyboardCallback(h => {
            if (this.navigated) {
                this.zone.run(() => {
                    this.isKeyboardOpen = h > 0;
                    this.cd.detectChanges();
                })
            }
        })
        this.page.actionBarHidden = true;
        this.rightToLeft = this.languageService.getRightToLeft();
        this.waitingForResponse = true;
        // this.springsService.getSpring("מעיין אביאל").subscribe((spring: FullSpring) => {
        this.springsService.getSpring(this.route.snapshot.params.springId).subscribe((spring: FullSpring) => {
            this.waitingForResponse = false;
            this.currentSpring = spring;

            this.springLocation = `${this.currentSpring.location._latitude},${this.currentSpring.location._longitude}`;

        }, err => {
            this.waitingForResponse = false;
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
        input.android.clearFocus();
        if (input.text) {
            this.springsService.addComment(input.text, this.currentSpring.ID).subscribe(res => {
                input.text = "";
                res.date = { _seconds: new Date().getTime() / 1000 };
                this.currentSpring.comments.push(res);
            }, err => {
                this.handleErrors(err);
            })
        }
    }

    commentTextChanged(text) {
        this.thereIsComment = text !== '';
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

    tapComment() {
        this.isKeyboardOpen = true;
    }

    closeKeyboard() {

    }

    handleErrors(error) {
        this.errorService.handleErorr(error);
    }
}
