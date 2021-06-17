import { registerElement } from "nativescript-angular/element-registry";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptFormsModule } from "nativescript-angular/forms"
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { AppRoutingModule } from "./app-routing.module";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { TNSCheckBoxModule } from '@nstudio/nativescript-checkbox/angular';
import { Carousel, CarouselItem } from 'nativescript-carousel';
import { LottieView } from 'nativescript-lottie';
import { NativeScriptUIRangeSeekBarModule } from "nativescript-range-seek-bar/angular";
import { NativeScriptSvgModule } from '@teammaestro/nativescript-svg/angular';
import { OdedI18NPipe } from './common/pipes/i18nPipe';

import { AppComponent } from "./app.component";
import { ResetPasswordModalComponent } from "./account/resetPassword/resetPasswordModal/resetPasswordModal.component";
import { AboutComponent } from "./about/about.component";
import { MainTabsComponent } from "./main-tabs/main-tabs.component";
import { MapComponent } from "./map/map.component";
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
import { NotificationsModalComponent } from "./main-tabs/notificationsModal/notificationsModal.component";

registerElement('LottieView', () => LottieView);
registerElement('Carousel', () => Carousel);
registerElement('CarouselItem', () => CarouselItem);
registerElement("MapView", () => require("nativescript-google-maps-sdk").MapView);

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        NativeScriptFormsModule,
        NativeScriptHttpClientModule,
        NativeScriptRouterModule,
        TNSCheckBoxModule,
        NativeScriptUIRangeSeekBarModule,
        NativeScriptSvgModule
    ],
    entryComponents: [
        ResetPasswordModalComponent,
        NotificationsModalComponent,
        StartModalComponent,
        UpdateSpringModalComponent,
        ChangePasswordModalComponent
    ],
    declarations: [
        NotificationsModalComponent,
        LocationComponentComponent,
        WinBingoComponent,
        ScoreComponent,
        TriviaQuestionComponent,
        TriviaComponent,
        LandKingComponent,
        KahootComponent,
        BingoComponent,
        GamesComponent,
        RightAnswerComponent,
        WrongAnswerComponent,
        StartModalComponent,
        UpdateSpringModalComponent,
        ChangePasswordModalComponent,
        ChangeLanguageModalComponent,
        LoginComponent,
        HotelViewComponent,
        HotelsListComponent,
        HotelsFiltersComponent,
        ProfileComponent,
        WaitingGifComponent,    
        ResetPasswordComponent,
        SpringsViewComponent,
        SpringsFiltersComponent,
        SignUpComponent,
        OdedI18NPipe,
        AppComponent,
        ResetPasswordModalComponent,
        AboutComponent,
        MainTabsComponent,
        MapComponent
    ],
    providers: [],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})

export class AppModule { }
