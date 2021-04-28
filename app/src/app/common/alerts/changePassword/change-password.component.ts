import { Component } from '@angular/core';
import { ModalDialogParams } from "nativescript-angular/modal-dialog";
import localize from 'nativescript-localize';
import { AlertService } from '../../services/alert-service';
import { ErrorsService } from '../../services/errors-service';
import { UserService } from '../../services/userService';

@Component({
    selector: 'ns-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss']
})

export class ChangePasswordModalComponent {
    oldPassword = "";
    newPassword = "";
    confirmPassword = "";
    constructor(private params: ModalDialogParams,
                private alertService: AlertService,
                private userService: UserService,
                private errorService: ErrorsService){}

    ok(){
        if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
            this.alertService.showError(localize('login.requireDetails'));
        } else{
            if (this.newPassword !== this.confirmPassword) {
                this.alertService.showError(localize('login.passwordsNotMuch'));
            } else {
                this.userService.changePassword(this.oldPassword, this.newPassword).subscribe(res => {
                    this.alertService.showSuccess(localize('login.passwordChanged'));
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

      handleError(err) {
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
                this.errorService.handleErorr(err);
                break;
        }
    }
}