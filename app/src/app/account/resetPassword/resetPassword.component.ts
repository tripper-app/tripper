import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page';
import { alert } from "tns-core-modules/ui/dialogs";
import { User } from '~/app/common/models/user';
import { UserService } from '~/app/common/services/userService';
import { localize } from "nativescript-localize";
import { ActivatedRoute, Router } from '@angular/router';
import { LanguageService } from '~/app/common/services/language-service';
import { AlertService } from '~/app/common/services/alert-service';

@Component({
    selector: 'ns-resetPassword',
    templateUrl: './resetPassword.component.html',
    styleUrls: ['./resetPassword.component.scss']
})
export class ResetPasswordComponent implements OnInit {
    rightToLeft = true;
    waitingForResponse = false;
    email = 'odedoded777@gmail.com';
    code = '';
    password = '';
    confirmPassword = '';

    constructor(private page: Page, 
                private userService: UserService, 
                private router: Router,
                private languageService: LanguageService,
                private route: ActivatedRoute,
                private alertService: AlertService) {
    }

    ngOnInit() {
        this.page.actionBarHidden = true;
        this.rightToLeft = this.languageService.getRightToLeft();
        // this.email = this.route.snapshot.params.email        
    }

    submit() {
        if (!this.code || !this.password || !this.confirmPassword) {
            this.alertService.showError(localize('login.requireDetails'));
            return;
        }

        if (this.password !== this.confirmPassword) {
            this.alertService.showError(localize('login.passwordsNotMuch'));
            return
        }

        this.waitingForResponse = true;
        this.userService.resetPasswordRecieveCode(this.code, this.email, this.password).subscribe(() => {
            this.waitingForResponse = false;
            this.alertService.showSuccess(localize('login.passwordChanged'));
            this.router.navigate(['login']);
        }, err => {
            this.handleError(err);
        })
    }

    navigateToLogin() {
        this.router.navigate(['login']);
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
            default:
                this.alertService.showError(localize('messages.error.serverError'));
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
}