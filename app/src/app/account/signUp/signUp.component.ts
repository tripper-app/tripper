import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Page } from '@nativescript/core';
import { User } from '~/app/common/models/user';
import { UserService } from '~/app/common/services/userService';
import { Router } from '@angular/router';
import { OauthService } from '../../common/services/oauth-service';
import { HttpService } from '~/app/common/services/http-service';
import { LanguageService } from '~/app/common/services/language-service';
import { setString } from '@nativescript/core/application-settings';
import { GoogleLogin } from 'nativescript-google-login';
import { AlertService } from '../../common/services/alert-service';
import { ErrorsService } from '~/app/common/services/errors-service';
import { RouterExtensions } from '@nativescript/angular';

@Component({ standalone: false,
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

    constructor(public page: Page,
        public userService: UserService,
        public router: Router,
        public oathService: OauthService,
        public httpService: HttpService,
        public languageService: LanguageService,
        public alertService: AlertService,
        public errorService: ErrorsService,
        public routerExtensions: RouterExtensions,
        public cd: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.page.actionBarHidden = true;
        this.rightToLeft = this.languageService.getRightToLeft();
        this.user = new User();
        this.oathService.configureOAuthProviders();
    }

    changeLanguage(lan) {
        this.languageService.switchLanguage(lan);
    }

    navigateToLogin() {
        this.routerExtensions.navigate(["mainTabs", 0], {animated: true, transition: {duration: 200, name: "slideRight", curve: "easeOut"}})
    }

    submit() {
        if (!this.user.email || !this.user.password || !this.confirmPassword) {
            this.alertService.showError(this.languageService.getText('login.emailAndPasswordRequired'));
            return;
        }

        if (!this.user.userName) {
            this.alertService.showError(this.languageService.getText('login.requireDetails'));
            return;
        }

        if (this.user.password != this.confirmPassword) {
            this.alertService.showError(this.languageService.getText('login.passwordsNotMuch'));
            return;
        }

        this.signUp();
    }

    signUp() {
        this.waitingForResponse = true;
        this.userService.signUp(this.user).subscribe(res => {
            this.waitingForResponse = false;
            this.alertService.showSuccess(this.languageService.getText('login.accountCreated'));
            this.navigateToLogin();
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

        switch (err.status) {
            case 400:
                this.alertService.showError(this.languageService.getText('login.requireDetails'));
                break;
            case 401:
                this.alertService.showError(this.languageService.getText('login.wrongDetails'));
                break;
            case 407:
                this.alertService.showError(this.languageService.getText('login.emailNotVerified'))
                break;
            case 409:
                this.alertService.showError(this.languageService.getText('login.emailAlreadyExist'))
                break;
            case 422:
                this.alertService.showError(this.languageService.getText('login.wrongEmail'));
                break
            default:
                this.errorService.handleErorr(err);
                break;
        }
        // Error callbacks arrive off Angular's zone; force CD so the spinner clears.
        this.cd.detectChanges();
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

    goToMap(){
        this.routerExtensions.navigate(["mainTabs", 3])
    }

    exit() {
        this.router.navigate(['login'])
    }
}
    // activity: application.android.foregroundActivity
    // serverClientId: "761150329649-cd3pjk9elh5ncrhq4seah28c4as7qfl5.apps.googleusercontent.com",
