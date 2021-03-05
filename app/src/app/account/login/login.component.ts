import { Component, ViewContainerRef, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page';
import { User } from '~/app/common/models/user';
import { UserService } from '~/app/common/services/userService';
import { localize } from "nativescript-localize";
import { Router } from '@angular/router';
import { OauthService } from '../../common/services/oauthService';
import { HttpService } from '~/app/common/services/http-service';
import { LanguageService } from '~/app/common/services/language-service';
import { setString, getString } from '@nativescript/core/application-settings';
import { GoogleLogin } from 'nativescript-google-login';
import * as application from "tns-core-modules/application";
import { AlertService } from '../../common/services/alert-service';
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import { ResetPasswordModalComponent } from '../resetPassword/resetPasswordModal/resetPasswordModal.component';

@Component({
    selector: 'ns-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    waitingForResponse = false;
    // isLoggingIn = true;
    rightToLeft = true;
    // localizeSignUp = localize('login.signUp');
    // localizeLogin = localize('login.login');
    // localizeBackToLogin = localize('login.backToLogin');
    // localizedontHaveAcount = localize('login.dontHaveAcount');
    user: User;

    constructor(private page: Page,
        private userService: UserService,
        private router: Router,
        private oathService: OauthService,
        private httpService: HttpService,
        private languageService: LanguageService,
        private alertService: AlertService,
        private modalService: ModalDialogService,
        private viewContainerRef: ViewContainerRef,) {
    }

    ngOnInit() {
        this.page.actionBarHidden = true;
        this.rightToLeft = this.languageService.getRightToLeft();
        this.user = new User();
        this.user.email = "odedoded777@gmail.com";
        this.user.password = "1234";

        // this.oathService.configureOAuthProviders();
        // GoogleLogin.init({
        //     google: {
        //         initialize: true,
        //         clientId: undefined,
        //         serverClientId: "597122793226-4p5ki7crvpk9a9h0k9plh4n89fvnjmg4.apps.googleusercontent.com",
        //         isRequestAuthCode: true
        //     },
        //     viewController: application.android.foregroundActivity
        // });
    }

    goToSignUp(){
        this.router.navigate(['signUp']);
    }

    submit() {
        if (!this.user.email || !this.user.password) {
            this.alertService.showError(localize('login.emailAndPasswordRequired'));
            return;
        }

        this.login();
    }

    login() {
        this.waitingForResponse = true;
        this.userService.login(this.user).subscribe(data => {
            this.waitingForResponse = false;
            console.log(data.token);
            this.saveTokenToCache(data.token);
            // this.router.navigate(['mainTabs', 3]);
        }, err => this.handleError(err))
    }

    forgotPassword() {
        const options: ModalDialogOptions = {
                viewContainerRef: this.viewContainerRef,
                fullscreen: false
              };
              this.modalService.showModal(ResetPasswordModalComponent, options);
        // this.router.navigate(['resetPassword']);
    }

    // getLocalizeBackToLogin() {
    //     return localize('login.backToLogin')
    // }

    loginWithFacebook() {
        this.oathService.tnsOauthLogin("facebook", data => {
            console.log("logged in to facebook");
            this.loginWithThirdParty(data.accessToken, 'facebook')
        }, err => {
            this.handleError(err);
            console.log("error while logging to facebook");
            console.log(err);
        })
    }

    loginWithGoogle() {
        GoogleLogin.login(res => {
            console.log(res);
        })
        // this.oathService.tnsOauthLogin("google", data => {
        //     alert(data)
        //     console.log(data);
        //     this.httpService.getEmailByFacebookToken(data.accessToken).subscribe(res => {
        //         console.log("SUCCESS!!");

        //         console.log(res);

        //     }, err => this.handleError(err))
        // }, err => {
        //     console.log("in error callback");
        //     console.log(err);

        // })
    }

    loginWithThirdParty(token, thirdParty) {
        // waiting gif
        //setString("facebook_token", token);
        this.httpService.loginWithThirdPartyToken(token, thirdParty).subscribe((res: { token: string }) => {
            this.saveTokenToCache(res.token);
        }, err => this.handleError(err))
    }

    saveTokenToCache(token) {
        setString("user_token", token);
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

    // alert(message: string) {
    //     return alert({
    //         title: localize('app.name'),
    //         okButtonText: localize('labels.OK'),
    //         message: message
    //     });
    // }

    logout() {
        // this.httpService.logoutFacebook(getString("facebook_token")).subscribe(data => {
        //     console.log("good");
        // }, err => {
        //     console.log("BAD");
        //     console.log(err);


        // })
        //this.oathService.disConnect();
    }

    exit(){
        this.router.navigate(['mainTabs', 3])
    } 
}
    // activity: application.android.foregroundActivity
    // serverClientId: "761150329649-cd3pjk9elh5ncrhq4seah28c4as7qfl5.apps.googleusercontent.com",
