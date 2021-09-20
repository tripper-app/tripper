import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { LanguageService } from '../common/services/language-service';
import { UserService } from '../common/services/userService';
import { screen } from "tns-core-modules/platform";
import { User } from '../common/models/user';
import { ModalDialogService, ModalDialogOptions } from 'nativescript-angular/modal-dialog';
import * as imagepicker from "nativescript-imagepicker";
import * as btoa from 'btoa';
import { AlertService } from '../common/services/alert-service';
import { ChangePasswordModalComponent } from '../common/alerts/changePassword/change-password.component';
import { SpringsService } from '../common/services/springs-service';
import { ErrorsService } from '../common/services/errors-service';

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
    @Output() goToAbout: EventEmitter<any> = new EventEmitter();
    @Output() logOutEmitter: EventEmitter<any> = new EventEmitter();

    animationTime = 200;
    favoritesGifHeight = 320;
    usernameInput;
    currentUser = new User();
    widthHalf = screen.mainScreen.widthDIPs / 2;
    editingUsername = false;
    waitingForResponse = false;
    waitingForFavorites = false;
    waitingForHistory = false;
    waitingForUserPic = false;
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
        private errorService: ErrorsService) {
    }

    ngOnInit(): void {
        this.getUser();
    }

    getUser() {
        this.waitingForResponse = true;
        this.userService.getUserProfile().subscribe(res => {
            this.waitingForResponse = false;
            this.currentUser.userName = res.userName;
            this.currentUser.email = res.email;
            this.currentUser.profile = res.profileImage;
        })
    }

    async uploadImage() {
        let context = imagepicker.create({
            mode: "single", // use "multiple" for multiple selection
            mediaType: imagepicker.ImagePickerMediaType.Image
        });
        context.authorize().then(() => {
            return context.present();
        }).then((selection) => {
            const image = selection[0];
            image.getImageAsync((img, err) => {
                if (err) {
                    console.log(err);
                    this.alertService.showError(this.languageService.getText('profile.cantPickImage'));
                } else {
                    this.waitingForUserPic = true;
                    let byteArrayOutputStream = new java.io.ByteArrayOutputStream();
                    img.compress(android.graphics.Bitmap.CompressFormat.JPEG, 50, byteArrayOutputStream);
                    let byteArray = byteArrayOutputStream.toByteArray();
                    var base64 = btoa(new Uint8Array(byteArray).reduce((data, byte) => data + String.fromCharCode(byte), ''));

                    this.userService.updateProfilePicture(base64).subscribe(res => {
                        console.log("MIRACLE");
                        this.waitingForUserPic = false;
                        this.currentUser.profile = res.imageUrl;
                        this.userService.setUserPicture(res.imageUrl);
                    }, err => {
                        this.waitingForUserPic = false;
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
            this.currentUser.favorites = springs;
            if (this.showingFavorites) {
                this.expandToFavorites();
            }
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

            if (!this.currentUser.favorites) {
                this.favoritesStack.nativeElement.animate({ height: this.favoritesGifHeight, duration: this.animationTime, curve: 'easeOut' })
                this.getFavorites();
            } else {
                this.expandToFavorites();
            }

        }
        this.showingFavorites = !this.showingFavorites;
    }

    expandToFavorites() {
        this.favoritesStack.nativeElement.animate({ height: this.springHeight * Math.floor(((this.currentUser.favorites.length + 1) / 2)), duration: this.animationTime, curve: 'easeOut' })
    }

    getHistory() {
        this.waitingForHistory = true;
        return this.userService.getHistorySprings().subscribe(springs => {
            this.waitingForHistory = false;
            this.currentUser.history = springs;

            if (this.showingHistory) {
                this.expandToHistory();
            }
        })
    }

    showHistory() {
        this.showHistoryImage.nativeElement.animate({ scale: { x: 1, y: 0 }, duration: this.animationTime / 2 }).then(() => {
            this.showHistoryImage.nativeElement.rotate = this.showingHistory ? 180 : 0;
        }).then(() => {
            this.showHistoryImage.nativeElement.animate({ scale: { x: 1, y: 1 }, duration: this.animationTime / 2 })
        });

        if (this.showingHistory) {
            this.historyStack.nativeElement.animate({ height: 0, duration: this.animationTime, curve: 'easeOut' })
        } else {
            if (!this.currentUser.history) {
                this.historyStack.nativeElement.animate({ height: this.favoritesGifHeight, duration: this.animationTime, curve: 'easeOut' })
                this.getHistory();
            } else {
                this.expandToHistory();
            }

        }
        this.showingHistory = !this.showingHistory;
    }

    expandToHistory() {
        this.historyStack.nativeElement.animate({ height: this.springHeight * Math.floor(((this.currentUser.history.length + 1) / 2)), duration: this.animationTime, curve: 'easeOut' })
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
        this.userService.updateUserName(this.usernameInput.text).subscribe(res => {
            console.log("user name changed successfuly");
        }, err => {
            this.handleError(err);
        })
    }

    tappedAnywhere() {
        setTimeout(() => {
            if (this.editingUsername) {
                this.editingUsername = false;
            }
        }, this.editingUsername ? 10 : 0);
    }

    navigatetoAbout() {
        this.goToAbout.emit();
    }

    navigateToSpring(spring) {
        this.springService.showSingleSpring(spring);
        this.goToMap.emit();
    }

    changeLanguage(lan) {
        this.languageService.switchLanguage(lan);
        this.currentUser.favorites = undefined;
        this.currentUser.history = undefined;
        if (this.showingHistory) {
            this.showHistory();
        }

        if (this.showingFavorites) {
            this.showFavorites();
        }
        // const options: ModalDialogOptions = {
        //     viewContainerRef: this.viewContainerRef,
        //     fullscreen: false,
        //     cancelable: false
        // };
        // this.modalService.showModal(ChangeLanguageModalComponent, options);
    }

    changePassword() {
        const options: ModalDialogOptions = {
            viewContainerRef: this.viewContainerRef,
            fullscreen: false
        };
        this.modalService.showModal(ChangePasswordModalComponent, options);
    }

    alignVertical(label) {
        label.android.setGravity(17)
    }

    logOut(){
        this.logOutEmitter.emit();
        // this.userService.logOut();
        // this.userService.userLoggedIn = false;
    }

    handleError(err) {
        this.waitingForResponse = false;

        switch (err.status) {
            case 400:
                this.alertService.showError(this.languageService.getText('login.requireDetails'));
                break;
            case 401:
                this.alertService.showError(this.languageService.getText('login.wrongDetails'));
                break;
            case 404:
                this.alertService.showError(this.languageService.getText('login.wrongEmail'));
                break;
            case 407:
                this.alertService.showError(this.languageService.getText('login.emailNotVerified'))
                break;
            case 409:
                this.alertService.showError(this.languageService.getText('login.emailAlreadyExist'))
                break;
            default:
                this.errorService.handleErorr(err);
                break;
        }
    }
}
