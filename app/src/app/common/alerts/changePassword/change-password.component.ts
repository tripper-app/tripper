import { Component } from '@angular/core';
import { ModalDialogParams } from '@nativescript/angular';
import { AlertService } from '../../services/alert-service';
import { ErrorsService } from '../../services/errors-service';
import { LanguageService } from '../../services/language-service';
import { UserService } from '../../services/userService';

@Component({ standalone: false,
    selector: 'ns-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss']
})

export class ChangePasswordModalComponent {
    oldPassword = "";
    newPassword = "";
    confirmPassword = "";
    rightToLeft = true;
    constructor(public params: ModalDialogParams,
        public alertService: AlertService,
        public userService: UserService,
        public errorService: ErrorsService,
        public languageService: LanguageService) { 
            this.rightToLeft = this.languageService.getRightToLeft();
        }

    ok() {
        if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
            this.alertService.showError(this.languageService.getText('login.requireDetails'));
        } else {
            if (this.newPassword !== this.confirmPassword) {
                this.alertService.showError(this.languageService.getText('login.passwordsNotMuch'));
            } else {
                this.userService.changePassword(this.oldPassword, this.newPassword).subscribe(res => {
                    this.alertService.showSuccess(this.languageService.getText('login.passwordChanged'));
                    this.exit();
                }, err => {
                    this.handleError(err);
                });
            }
        }
    }

    exit() {
        this.params.closeCallback();
    }

    alignVertical(label) {
        label.android.setGravity(17)
    }

    handleError(err) {
        console.log(err);
        switch (err.status) {
            case 0:
                this.alertService.showError(this.languageService.getText('messages.error.connectionError'))
                break;
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