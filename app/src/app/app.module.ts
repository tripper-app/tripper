import { registerElement } from '@nativescript/angular';
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from '@nativescript/angular';
import { NativeScriptFormsModule } from '@nativescript/angular'
import { NativeScriptHttpClientModule } from '@nativescript/angular';
import { AppRoutingModule } from "./app-routing.module";
import { NativeScriptRouterModule } from '@nativescript/angular';
import { TNSCheckBoxModule } from '@nstudio/nativescript-checkbox/angular';
import { Carousel, CarouselItem } from 'nativescript-carousel';
import { LottieView } from '@nativescript-community/ui-lottie';
// NOTE: nativescript-range-seek-bar is abandoned and its Angular module is not a
// valid Ivy NgModule on Angular 21, so it is no longer imported here. The
// <RangeSeekBar> usages in the filter screens need a maintained replacement
// (e.g. @nativescript-community/ui-range-seekbar or a core Slider) + retesting.
import { SVGView } from '@nativescript-community/ui-svg';
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
import { CarouselComponent } from "./common/carousel/carousel.component";

registerElement('LottieView', () => LottieView);
registerElement('Carousel', () => Carousel);
registerElement('CarouselItem', () => CarouselItem);
registerElement('SVGImage', () => SVGView);
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
        TNSCheckBoxModule
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
        MapComponent,
        CarouselComponent
    ],
    providers: [],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})

export class AppModule { }
