import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { LanguageService } from '../common/services/language-service';
import { UserService } from '../common/services/userService';
import { device, screen, isAndroid, isIOS } from "tns-core-modules/platform";
import { User } from '../common/models/user';
import { ModalDialogService, ModalDialogOptions } from 'nativescript-angular/modal-dialog';
import { ChangeLanguageModalComponent } from '../common/alerts/changeLanguage/change-language.component';
import * as imagepicker from "nativescript-imagepicker";
import * as btoa from 'btoa';
import localize from 'nativescript-localize';
import { AlertService } from '../common/services/alert-service';
import { ChangePasswordModalComponent } from '../common/alerts/changePassword/change-password.component';
import { Router } from '@angular/router';
import { SpringsService } from '../common/services/springs-service';

declare let android: any; // or use tns-platform-declarations
declare let java: any;

@Component({
    selector: 'ns-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    @ViewChild('showFavoritesImage', { static: false }) showFavoritesImage: ElementRef;
    @ViewChild('favoritesStack', { static: false }) favoritesStack: ElementRef;
    @ViewChild('showHistoryImage', { static: false }) showHistoryImage: ElementRef;
    @ViewChild('historyStack', { static: false }) historyStack: ElementRef;
    @Output() goToMap: EventEmitter<any> = new EventEmitter();

    // @ViewChild('usernameInput', {static: false}) usernameInput: TextField;
    animationTime = 150;
    favoritesGifHeight = 320;
    usernameInput;
    currentUser: User;
    favoriteSprings: [];
    historySprings: [];
    rightToLeft = true;
    widthHalf = screen.mainScreen.widthDIPs / 2;
    editingUsername = false;
    waitingForResponse = false;
    waitingForFavorites = false;
    waitingForHistory = false;
    springHeight = 160;
    mainColor = "rgb(35, 204, 153)";
    checkBoxScale = 0.7;
    showingFavorites = false;
    showingHistory = false;
    constructor(private userService: UserService,
        private languageService: LanguageService,
        private modalService: ModalDialogService,
        private viewContainerRef: ViewContainerRef,
        private alertService: AlertService,
        private springService: SpringsService,
        private router: Router,) {
    }

    ngOnInit(): void {
        this.rightToLeft = this.languageService.getRightToLeft();
        console.log(this.languageService.getCurrentLanguage());

        this.getUser();
    }

    getUser() {
        this.currentUser = new User();
        this.currentUser.profile = "https://cdn.mos.cms.futurecdn.net/VSy6kJDNq2pSXsCzb6cvYF.jpg";
        this.currentUser.email = "blablabla@gmail.com";
        this.currentUser.password = "1234";
        this.currentUser.userName = "ישראל ישראלי";
        this.currentUser.favorites = ["מעיין אביאל", "בור דותן", "מעיין הגבורה"];
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

                    this.userService.updateProfilePicture(base64).subscribe(res => {
                        console.log("MIRACLE");
                        this.currentUser.profile = res.imageUrl;
                    }, err => {
                        console.log("ERROR");
                        this.handleError(err);
                    })
                }
            })

        }).catch(function (e) {
            console.log("ERROR");
            this.handleError(e);
        });
    }

    getFavorites() {
        this.waitingForFavorites = true;
        return this.userService.getFavoriteSprings().subscribe(springs => {
            this.waitingForFavorites = false;            
            this.favoriteSprings = springs;
            this.expandToFavorites();
        })
    }

    showFavorites() {
        this.showFavoritesImage.nativeElement.animate({ scale: { x: 1, y: 0 }, duration: this.animationTime / 2 }).then(() => {
            this.showFavoritesImage.nativeElement.rotate = this.showingFavorites ? 180 : 0;
        }).then(() => {
            this.showFavoritesImage.nativeElement.animate({ scale: { x: 1, y: 1 }, duration: this.animationTime / 2 })
        });

        if (this.showingFavorites) {
            this.favoritesStack.nativeElement.animate({ height: 0, duration: this.animationTime, curve: 'easeOut' })
        } else {

            if (!this.favoriteSprings) {
                this.favoritesStack.nativeElement.animate({ height: this.favoritesGifHeight, duration: this.animationTime, curve: 'easeOut' })
                this.getFavorites();
            } else {
                this.expandToFavorites();
            }

        }
        this.showingFavorites = !this.showingFavorites;
    }

    expandToFavorites() {
        this.favoritesStack.nativeElement.animate({ height: this.springHeight*((this.favoriteSprings.length+1)/2), duration: this.animationTime, curve: 'easeOut' })
    }

    getHistory(){
        this.waitingForHistory = true;
        return this.userService.getHistorySpriings().subscribe(springs => { // change to history!
            this.waitingForHistory = false;            
            this.historySprings = springs;
            this.expandToHistory();
        })
    }

    showHistory(){
        this.showHistoryImage.nativeElement.animate({ scale: { x: 1, y: 0 }, duration: this.animationTime / 2 }).then(() => {
            this.showHistoryImage.nativeElement.rotate = this.showHistory ? 180 : 0;
        }).then(() => {
            this.showHistoryImage.nativeElement.animate({ scale: { x: 1, y: 1 }, duration: this.animationTime / 2 })
        });

        if (this.showingHistory) {
            this.historyStack.nativeElement.animate({ height: 0, duration: this.animationTime, curve: 'easeOut' })
        } else {

            if (!this.historySprings) {
                this.historyStack.nativeElement.animate({ height: this.favoritesGifHeight, duration: this.animationTime, curve: 'easeOut' })
                this.getHistory();
            } else {
                this.expandToHistory();
            }

        }
        this.showingHistory = !this.showingHistory;
    }

    expandToHistory(){
        this.historyStack.nativeElement.animate({ height: this.springHeight*((this.historySprings.length+1)/2), duration: this.animationTime, curve: 'easeOut' })
    }

    ontTextFieldLoaded(event) {
        if (event.object.android) {
            this.usernameInput = event.object;
            event.object.android.clearFocus();
        }
    }

    editUsername() {
        setTimeout(() => {
            this.editingUsername = true;
            this.usernameInput.text = this.currentUser.userName;
            setTimeout(() => {
                this.usernameInput.focus();
                this.usernameInput.android.setSelection(this.currentUser.userName.length)
            }, 0);
        }, this.editingUsername ? 0 : 10);
    }

    submitUsername() {
        this.currentUser.userName = this.usernameInput.text;
        this.editingUsername = false;
    }

    tappedAnywhere() {
        setTimeout(() => {
            if (this.editingUsername) {
                this.editingUsername = false;
            }
        }, this.editingUsername ? 10 : 0);
    }

    navigatetoAbout() {
        console.log("in about");

    }

    navigateToSpring(spring) {        
        this.springService.showSingleSpring = true;
        this.springService.singleSpring = spring;
        this.goToMap.emit();
    }

    changeLanguage(lan) {
        this.languageService.switchLanguage(lan);
        const options: ModalDialogOptions = {
            viewContainerRef: this.viewContainerRef,
            fullscreen: false,
            cancelable: false
        };
        this.modalService.showModal(ChangeLanguageModalComponent, options);
    }

    changePassword(){
        const options: ModalDialogOptions = {
            viewContainerRef: this.viewContainerRef,
            fullscreen: false
        };
        this.modalService.showModal(ChangePasswordModalComponent, options);
    }

    alignVertical(label) {
        label.android.setGravity(17)
    }

    handleError(err) {
        this.waitingForResponse = false;
        console.log(err);

        switch (err.status) {
            case 0:
                this.alertService.showError(localize('messages.error.connectionError'))
                break;
            case 400:
                this.alertService.showError(localize('login.requireDetails'));
                break;
            case 401:
                this.alertService.showError(localize('login.wrongDetails'));
                break;
            case 404:
                this.alertService.showError(localize('login.wrongEmail'));
                break;
            case 407:
                this.alertService.showError(localize('login.emailNotVerified'))
                break;
            case 409:
                this.alertService.showError(localize('login.emailAlreadyExist'))
                break;
            default:
                this.alertService.showError(localize('messages.error.serverError'));
                break;
        }
    }
}
