import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page';
import { alert } from "tns-core-modules/ui/dialogs";
import { UserService } from '~/app/common/services/userService';
//import { localize } from "nativescript-localize";
import { ActivatedRoute, Router } from '@angular/router';
import { LanguageService } from '~/app/common/services/language-service';
import { AlertService } from '~/app/common/services/alert-service';
import { ErrorsService } from '~/app/common/services/errors-service';
import { OdedI18NPipe } from '~/app/common/pipes/i18nPipe';

@Component({
    selector: 'ns-resetPassword',
    templateUrl: './resetPassword.component.html',
    styleUrls: ['./resetPassword.component.scss']
})
export class ResetPasswordComponent implements OnInit {
    waitingForResponse = false;
    email = '';
    code = '';
    password = '';
    confirmPassword = '';

    constructor(private page: Page, 
                private userService: UserService, 
                private router: Router,
                private languageService: LanguageService,
                private alertService: AlertService,
                private errorService: ErrorsService,
                private odedi18n: OdedI18NPipe,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.page.actionBarHidden = true;
        this.email = this.route.snapshot.params.email;
    }

    submit() {
        if (!this.code || !this.password || !this.confirmPassword) {
            this.alertService.showError(this.odedi18n.transform('login.requireDetails'));
            return;
        }

        if (this.password !== this.confirmPassword) {
            this.alertService.showError(this.odedi18n.transform('login.passwordsNotMuch'));
            return
        }

        this.waitingForResponse = true;
        this.userService.resetPasswordRecieveCode(this.code, this.email, this.password).subscribe(() => {
            this.waitingForResponse = false;
            this.alertService.showSuccess(this.odedi18n.transform('login.passwordChanged'));
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
            case 400:
                this.alertService.showError(this.odedi18n.transform('login.requireDetails'));
                break;
            case 401:
                this.alertService.showError(this.odedi18n.transform('login.wrongDetails'));
                break;
            default:
                this.errorService.handleErorr(err);
                break;
        }
    }
}