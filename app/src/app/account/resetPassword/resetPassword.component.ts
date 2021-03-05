import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page';
import { alert } from "tns-core-modules/ui/dialogs";
import { User } from '~/app/common/models/user';
import { UserService } from '~/app/common/services/userService';
import { localize } from "nativescript-localize";
import { Router } from '@angular/router';

@Component({
    selector: 'ns-resetPassword',
    templateUrl: './resetPassword.component.html',
    styleUrls: ['./resetPassword.component.css']
})
export class ResetPasswordComponent implements OnInit {
    localizeProceed = localize('login.proceed');
    localizeSubmitNewPassword = localize('login.submitNewPassword');
    waitingForResponse = false;
    beforeCode = true;
    user: User;
    code = '';
    @ViewChild("password", { static: false }) password: ElementRef;
    @ViewChild("confirmPassword", { static: false }) confirmPassword: ElementRef;

    constructor(private page: Page, private userService: UserService, private router: Router) {
    }


    submit() {
        if (this.beforeCode) {
            if (!this.user.email) {
                this.alert(localize('login.requireEmail'));
            } else {
                this.waitingForResponse = true;
                this.userService.resetPasswordCreateCode(this.user.email).subscribe(data => {
                    this.alert(localize('login.insertCode'))
                    this.waitingForResponse = false;
                    this.beforeCode = false;
                }, err => this.handleError(err))
            }
        } else {
            if (!this.user.email || !this.user.password) {
                this.alert(localize('login.requireDetails'));
            } else {
                if (!this.code) {
                    this.alert(localize('login.requireCode'));
                } else {
                    if (this.user.password != this.confirmPassword.nativeElement.text) {
                        this.alert(localize('login.passwordsNotMuch'));
                    } else {
                        this.waitingForResponse = true;
                        this.userService.resetPasswordRecieveCode(this.code, this.user.email, this.user.password).subscribe(data => {
                            this.waitingForResponse = false;
                            this.alert(localize('login.passwordChanged'));
                            this.backToLogin();
                        }, err => this.handleError(err))
                    }
                }
            }
        }

    }

    focusPassword() {
        this.password.nativeElement.focus();
    }

    focusConfirmPassword() {
        this.confirmPassword.nativeElement.focus();
    }

    backToLogin() {
        this.router.navigate(['signUp']);
    }

    handleError(err) {
        this.waitingForResponse = false;
        console.log(err);

        switch (err.status) {
            case 0:
                this.alert(localize('messages.error.connectionError'))
                break;
            case 400:
                this.alert(localize('login.requireDetails'));
                break;
            case 401:
                this.alert(localize('login.wrongDetails'));
                break;
            case 409:
                this.alert(localize('login.emailAlreadyExist'))
                break;
            default:
                this.alert(localize('messages.error.serverError'));
                break;
        }
    }

    alert(message: string) {
        return alert({
            title: localize('app.name'),
            okButtonText: localize('labels.OK'),
            message: message
        });
    }

    ngOnInit() {
        this.page.actionBarHidden = true;
        this.user = new User();
        this.user.email = "odedoded777@gmail.com";
    }
}