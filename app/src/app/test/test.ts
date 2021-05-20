import { Component, EventEmitter, OnInit, Output, ViewContainerRef } from "@angular/core";
import { Router } from "@angular/router";
import { ModalDialogService } from "@nativescript/angular/modal-dialog";
import { Page } from "@nativescript/core";
import { User } from "../common/models/user";
import { OdedI18NPipe } from "../common/pipes/i18nPipe";
import { AlertService } from "../common/services/alert-service";
import { ErrorsService } from "../common/services/errors-service";
import { HttpService } from "../common/services/http-service";
import { LanguageService } from "../common/services/language-service";
import { OauthService } from "../common/services/oauth-service";
import { UserService } from "../common/services/userService";

@Component({
    selector: 'ns-test',
    templateUrl: './test.html',
    styleUrls: ['./test.scss']
})
export class TestComponent implements OnInit {
    @Output() goToMap: EventEmitter<any> = new EventEmitter();
    @Output() goToAbout: EventEmitter<any> = new EventEmitter();
    waitingForResponse = false;
    mainColor = "rgb(35, 204, 153)";
    user: User;
    first = false;

    constructor(private page: Page,
        private userService: UserService,
        private router: Router,
        private oathService: OauthService,
        private httpService: HttpService,
        private languageService: LanguageService,
        private alertService: AlertService,
        private modalService: ModalDialogService,
        private viewContainerRef: ViewContainerRef,
        private errorService: ErrorsService,
        private odedi18n: OdedI18NPipe) {
    }

    ngOnInit() {
        this.page.actionBarHidden = true;
        this.user = new User();
        this.user.email = "odedoded777@gmail.com";
        this.user.password = "12";

        this.oathService.configureOAuthProviders();
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

    goToSignUp() {
        this.router.navigate(['signUp']);
    }

    submit() {
        if (!this.user.email || !this.user.password) {
            this.alertService.showError(this.odedi18n.transform('login.emailAndPasswordRequired'));
            return;
        }

        this.login();
    }

    login() {
        this.waitingForResponse = true;
        this.userService.login(this.user).subscribe(data => {
            this.waitingForResponse = false;
            this.saveTokenToCache(data.token);
            this.userService.setUserPicture(data.profile_picture);
            this.userService.userLoggedIn = true;
            this.navigateToMap();
        }, err => this.handleError(err))
    }

    forgotPassword() {
        // const options: ModalDialogOptions = {
        //     viewContainerRef: this.viewContainerRef,
        //     fullscreen: false
        // };
        // this.modalService.showModal(ResetPasswordModalComponent, options).then(email => {            
        //     if (email) {
        //         this.waitingForResponse = true;
        //         this.userService.resetPasswordCreateCode(email).subscribe(() => {
        //             this.router.navigate(['resetPassword', email]);
        //         }, err => this.handleError(err));
        //     }
        // });
    }

    loginWithFacebook() {
        this.oathService.tnsOauthLogin("facebook", data => {
            this.loginWithThirdParty(data.accessToken, 'facebook')
        }, err => {
            //this.handleError(err);
            console.log("error while logging to facebook");
            console.log(err);
            this.handleError(err);
        })
    }



    loginWithThirdParty(token, thirdParty) {
        this.waitingForResponse = true;
        console.log("logged in with: " + thirdParty);
        
        this.httpService.loginWithThirdPartyToken(token, thirdParty).subscribe((res: any) => {
            this.waitingForResponse = false;
            console.log("token is: " + res.token);
            this.saveTokenToCache(res.token);
            this.userService.setUserPicture(res.profile_picture);
            this.userService.userLoggedIn = true;
            this.navigateToMap();
        }, err => this.handleError(err))
    }

    saveTokenToCache(token) {
        //setString("user_token", token);
    }

    changeLanguage(lan) {
        this.languageService.switchLanguage(lan);
        // const options: ModalDialogOptions = {
        //     viewContainerRef: this.viewContainerRef,
        //     fullscreen: false
        // };
        //this.modalService.showModal(ChangeLanguageModalComponent, options);
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
            case 404:
                this.alertService.showError(this.odedi18n.transform('login.wrongEmail'));
                break;
            case 407:
                this.alertService.showError(this.odedi18n.transform('login.emailNotVerified'))
                break;
            case 409:
                this.alertService.showError(this.odedi18n.transform('login.emailAlreadyExist'))
                break;
            default:
                this.errorService.handleErorr(err);
                break;
        }
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

    alignVertical(label) {
        label.android.setGravity(17)
    }

    navigateToMap() {
        this.goToMap.emit();
    }

    navigateToAbout(){
        this.goToAbout.emit();
    }
}