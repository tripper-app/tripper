import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptFormsModule } from "nativescript-angular/forms"
import { NativeScriptUISideDrawerModule } from "nativescript-ui-sidedrawer/angular";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { Gif } from 'nativescript-gif';
import { AppRoutingModule } from "./app-routing.module";
import { NativeScriptLocalizeModule } from "nativescript-localize/angular";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { TNSCheckBoxModule } from '@nstudio/nativescript-checkbox/angular';
import { Carousel, CarouselItem } from 'nativescript-carousel';
// import { NativeScriptFacebookModule } from "nativescript-facebook/angular";
// import { init, initAnalytics } from "nativescript-facebook";
import { LottieView } from 'nativescript-lottie';
import { NativeScriptUIRangeSeekBarModule } from "nativescript-range-seek-bar/angular";

registerElement('LottieView', () => LottieView);
import { AppComponent } from "./app.component";
import { MainTabsComponent } from "./main-tabs/main-tabs.component";
import { MapComponent } from "./map/map.component";
import { registerElement } from "nativescript-angular/element-registry";
// import { HomeComponent } from './home/home.component';
// import { CarouselComponent } from './home/carousel/carousel.component';
import { SignUpComponent } from "./account/signUp/signUp.component";
import { ResetPasswordComponent } from "./account/resetPassword/resetPassword.component";
import { SpringsFiltersComponent } from "./map/spring-filters/spring-filters.component";
import { SpringsViewComponent } from "./map/spring-view/spring-view.component";
import { WaitingGifComponent } from "./common/waiting-gif/waiting-gif.component";
import { ProfileComponent } from "./profile/profile.component";
import { HotelsFiltersComponent } from "./hotels/hotels-filters/hotels-filters.component";
import { HotelsListComponent } from "./hotels/hotels-list/hotels-list.component";
import { HotelViewComponent } from "./hotels/hotel-view/hotel-view.component";
import { LoginComponent } from "./account/login/login.component";
import { ResetPasswordModalComponent } from "./account/resetPassword/resetPasswordModal/resetPasswordModal.component";
import { ChangeLanguageModalComponent } from "./common/alerts/changeLanguage/change-language.component";
import { ChangePasswordModalComponent } from "./common/alerts/changePassword/change-password.component";
import { UpdateSpringModalComponent } from "./map/spring-view/update-spring/updateSpringModal.component";
import { StartModalComponent } from "./games/landKing/startModal/startModal.component";
import { WrongAnswerComponent } from "./games/trivia/trivia-question/wrong-answer/wrongAnswer.component";
import { RightAnswerComponent } from "./games/trivia/trivia-question/right-answer/rightAnswer.component";
import { GamesComponent } from "./games/games.component";
import { BingoComponent } from "./games/bingo/bingo.component";
import { KahootComponent } from "./games/kahoot/kahoot.component";
import { LandKingComponent } from "./games/landKing/landKing.component";
import { TriviaComponent } from "./games/trivia/trivia.component";
import { TriviaQuestionComponent } from "./games/trivia/trivia-question/trivia-question.component";
import { ScoreComponent } from "./games/score/score.component";
import { WinBingoComponent } from "./games/bingo/winBingo/winBingo.component";
import { LocationComponentComponent } from "./games/landKing/locationComponent/locationComponent.component";
import { AboutComponent } from "./about/about.component";
import { NotificationsModalComponent } from "./main-tabs/notificationsModal/notificationsModal.component";

registerElement('Carousel', () => Carousel);
registerElement('CarouselItem', () => CarouselItem);
// registerElement("Carousel", () => require("nativescript-carousel").Carousel);
// registerElement("CarouselItem", () => require("nativescript-carousel").CarouselItem);

registerElement('Gif', () => Gif);
registerElement("MapView", () => require("nativescript-google-maps-sdk").MapView);
// init facebook
// application.on(application.launchEvent, function (args) {
//     init("680048289611186");
//     initAnalytics();
// });

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        AppRoutingModule,
        NativeScriptModule,
        NativeScriptUISideDrawerModule,
        NativeScriptHttpClientModule,
        NativeScriptFormsModule,
        NativeScriptLocalizeModule,
        NativeScriptRouterModule,
        TNSCheckBoxModule,
        NativeScriptUIRangeSeekBarModule
        // NativeScriptFacebookModule
    ],
    entryComponents: [
        ResetPasswordModalComponent,
        ChangeLanguageModalComponent,
        ChangePasswordModalComponent,
        UpdateSpringModalComponent,
        StartModalComponent,
        NotificationsModalComponent
    ],
    declarations: [
        AppComponent,
        MapComponent,
        // HomeComponent,
        // CarouselComponent,
        SignUpComponent,
        ResetPasswordComponent,
        MainTabsComponent,
        SpringsFiltersComponent,
        SpringsViewComponent,
        WaitingGifComponent,
        ProfileComponent,
        HotelsFiltersComponent,
        HotelsListComponent,
        HotelViewComponent,
        LoginComponent,
        ResetPasswordModalComponent,
        ChangeLanguageModalComponent,
        ChangePasswordModalComponent,
        UpdateSpringModalComponent,
        StartModalComponent,
        NotificationsModalComponent,
        WrongAnswerComponent,
        RightAnswerComponent,
        GamesComponent,
        BingoComponent,
        KahootComponent,
        LandKingComponent,
        TriviaComponent,
        TriviaQuestionComponent,
        ScoreComponent,
        WinBingoComponent,
        LocationComponentComponent,
        AboutComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule { }
