import { Component, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page';
import { alert } from "tns-core-modules/ui/dialogs";
import { User } from '~/app/common/models/user';
import { UserService } from '~/app/common/services/userService';
import { localize } from "nativescript-localize";
import { Router } from '@angular/router';
import { OauthService } from '../../common/services/oauth-service';
import { HttpService } from '~/app/common/services/http-service';
import { LanguageService } from '~/app/common/services/language-service';
import { setString } from '@nativescript/core/application-settings';
import { GoogleLogin } from 'nativescript-google-login';
import { AlertService } from '../../common/services/alert-service';
import { ErrorsService } from '~/app/common/services/errors-service';

@Component({
    selector: 'ns-signUp',
    templateUrl: './signUp.component.html',
    styleUrls: ['./signUp.component.scss']
})
export class SignUpComponent implements OnInit {
    waitingForResponse = false;
    mainColor = "rgb(35, 204, 153)";
    rightToLeft = true;
    user: User;
    confirmPassword = '';

    constructor(private page: Page,
        private userService: UserService,
        private router: Router,
        private oathService: OauthService,
        private httpService: HttpService,
        private languageService: LanguageService,
        private alertService: AlertService,
        private errorService: ErrorsService) {
    }

    ngOnInit() {
        this.page.actionBarHidden = true;
        this.rightToLeft = this.languageService.getRightToLeft();
        this.user = new User();
        this.oathService.configureOAuthProviders();
    }

    navigateToLogin() {
        this.router.navigate(['login']);
    }

    submit() {
        if (!this.user.email || !this.user.password || !this.confirmPassword) {
            this.alertService.showError(localize('login.emailAndPasswordRequired'));
            return;
        }

        if (!this.user.userName) {
            this.alertService.showError(localize('login.requireDetails'));
            return;
        }

        if (this.user.password != this.confirmPassword) {
            this.alertService.showError(localize('login.passwordsNotMuch'));
            return;
        }

        this.signUp();
    }

    signUp() {
        this.waitingForResponse = true;
        this.userService.signUp(this.user).subscribe(res => {
            this.waitingForResponse = false;
            this.alertService.showSuccess(localize('login.accountCreated'));
            this.router.navigate(['login']);
        }, err => this.handleError(err))
    }

    loginWithFacebook() {
        this.oathService.tnsOauthLogin("facebook", data => {
            console.log("logged in to facebook");
            this.loginWithThirdParty(data.accessToken, 'facebook')
        }, err => {
            console.log("error while logging to facebook");
            console.log(err);
            this.handleError(err);
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
            case 422:
                this.alertService.showError(localize('login.wrongEmail'));
                break
            default:
                this.errorService.handleErorr(err);
                break;
        }
    }

    alignVertical(label) {
        label.android.setGravity(17)
    }

    logout() {
        // this.httpService.logoutFacebook(getString("facebook_token")).subscribe(data => {
        //     console.log("good");
        // }, err => {
        //     console.log("BAD");
        //     console.log(err);


        // })
        //this.oathService.disConnect();
    }

    exit() {
        this.router.navigate(['mainTabs', 3])
    }
}
    // activity: application.android.foregroundActivity
    // serverClientId: "761150329649-cd3pjk9elh5ncrhq4seah28c4as7qfl5.apps.googleusercontent.com",
