import { ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { Page } from '@nativescript/core';
import { SpringsService } from '../../common/services/springs-service';
import { LanguageService } from '../../common/services/language-service';
import { AlertService } from '../../common/services/alert-service';
import { RouterExtensions } from '@nativescript/angular';
import { FullSpring } from '~/app/common/models/fullSpring';
import { ActivatedRoute } from "@angular/router";
import { openUrl } from "@nativescript/core/utils";
import { ImageSource } from '@nativescript/core';
import * as SocialShare from '@nativescript/social-share';
import { UserService } from '~/app/common/services/userService';
import { ModalDialogOptions, ModalDialogService } from '@nativescript/angular';
import { UpdateSpringModalComponent } from './update-spring/updateSpringModal.component';
import { ErrorsService } from '~/app/common/services/errors-service';
import { registerSoftKeyboardCallback } from 'nativescript-soft-keyboard';

@Component({ standalone: false,
    selector: 'ns-spring-view',
    templateUrl: './spring-view.component.html',
    styleUrls: ['./spring-view.component.scss']
})
export class SpringsViewComponent implements OnInit, OnDestroy {
    waitingForResponse = false;
    currentSpring: FullSpring = new FullSpring();
    googleMapsURL = "https://maps.google.com/?daddr=";
    wazeURL = "waze://?ll=";
    springLocation = "";
    expandComments = false;
    thereIsComment = false;
    isKeyboardOpen = false;
    navigated = false;

    constructor(public page: Page,
        public springsService: SpringsService,
        public languageService: LanguageService,
        public alertService: AlertService,
        public userService: UserService,
        public modalService: ModalDialogService,
        public viewContainerRef: ViewContainerRef,
        public errorService: ErrorsService,
        public route: ActivatedRoute,
        public cd: ChangeDetectorRef,
        public zone: NgZone,
        public routerExtensions: RouterExtensions) {
    }
    ngOnDestroy(): void {
        this.navigated = true;
    }

    ngOnInit(): void {
        this.page.actionBarHidden = true;
        registerSoftKeyboardCallback(h => {
            if (!this.navigated) {
                this.zone.run(() => {
                    this.isKeyboardOpen = h > 0;
                    this.cd.detectChanges();
                })
            }
        })

        this.waitingForResponse = true;
        this.springsService.getSpring(this.route.snapshot.params.springId).subscribe((spring: FullSpring) => {
            this.waitingForResponse = false;
            this.currentSpring = spring;
            this.springLocation = `${this.currentSpring.location._latitude},${this.currentSpring.location._longitude}`;
            // NativeScript's HTTP backend completes off Angular's zone, so without
            // forcing change detection the loading flag/details never render and the
            // spinner stays on a white screen forever.
            this.cd.detectChanges();
        }, err => {
            this.waitingForResponse = false;
            this.handleErrors(err);
            this.cd.detectChanges();
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
                    this.alertService.showSuccess(this.languageService.getText('springView.thankYou'));
                }, err => this.handleErrors(err));
            }
        });
    }

    alignVertical(label: any) {
        label.android.setGravity(17)
    }

    navigateToMap() {
        // Go BACK to the existing (still-mounted) map rather than navigating
        // forward to a new tabs page. A forward nav builds a fresh MapView that
        // re-fetches and shows white until the server responds; going back keeps
        // the map and its already-loaded markers from the last fetch. (Fall back to
        // a forward nav only when there's no back stack, e.g. opened via deep link.)
        if (this.routerExtensions.canGoBack()) {
            this.routerExtensions.back();
        } else {
            this.routerExtensions.navigate(["mainTabs", 3], { clearHistory: true });
        }
    }

    navigateWithMaps() {
        openUrl(this.googleMapsURL + this.springLocation);
    }

    navigateWithWaze() {
        openUrl(this.wazeURL + this.springLocation);
    }

    async shareSpring() {
        try {
            const imgsrc = await ImageSource.fromUrl(this.currentSpring.images[0]);
            const springText = `*${this.currentSpring.name}*\n${this.currentSpring.description}
        \n${this.getTextFromFields()}\n${this.languageService.getText("springView.navigateWithWaze")}:
        https://www.waze.com/ul?ll=${this.currentSpring.location._latitude}%2C${this.currentSpring.location._longitude}&navigate=yes\n\n${this.languageService.getText("springView.shareLink")}:\nhttps://play.google.com/store/apps/details?id=org.nativescript.tripper`;
            SocialShare.shareImage(imgsrc, springText)
        } catch (error) {
            console.log(error);
        }
    }

    addComment(input: any) {
        input.android.clearFocus();
        if (input.text) {
            this.springsService.addComment(input.text, this.currentSpring.ID).subscribe(res => {
                input.text = "";
                res.date = { _seconds: new Date().getTime() / 1000 };
                this.currentSpring.comments.push(res);
                // HTTP response fires off Angular's zone -> force CD so the new
                // comment renders.
                this.cd.detectChanges();
            }, err => {
                this.handleErrors(err);
            })
        }
    }

    commentTextChanged(text: string) {
        this.thereIsComment = text !== '';
    }

    getTextFromFields() {
        var txt = "";
        if (this.currentSpring.depth) {
            txt += `${this.languageService.getText("springView.depth")}: ${this.currentSpring.depth}\n`;
        }

        if (this.currentSpring.distanceFromCar) {
            txt += `${this.languageService.getText("springView.walkingDistanceFromCar")}: ${this.currentSpring.distanceFromCar}\n`;
        }

        if (this.currentSpring.preferredSeason) {
            txt += `${this.languageService.getText("springView.preferredSeason")}: ${this.currentSpring.preferredSeason}\n`;
        }

        return txt;
    }

    tapComment() {
        this.isKeyboardOpen = true;
    }

    handleErrors(error: any) {
        this.errorService.handleErorr(error);
    }
}
