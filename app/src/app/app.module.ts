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
import { SpringModalComponent } from './map/spring-modal/spring-modal.component';
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
import { GamesComponent } from "./games/games.component";
import { BingoComponent } from "./games/bingo/bingo.component";
import { KahootComponent } from "./games/kahoot/kahoot.component";
import { LandKingComponent } from "./games/landKing/landKing.component";
import { TriviaComponent } from "./games/trivia/trivia.component";

registerElement('Carousel', () => Carousel);
import { from } from "rxjs";
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
        SpringModalComponent,
        ResetPasswordModalComponent,
        ChangeLanguageModalComponent,
        ChangePasswordModalComponent,
        UpdateSpringModalComponent
    ],
    declarations: [
        AppComponent,
        MapComponent,
        SpringModalComponent,
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
        GamesComponent,
        BingoComponent,
        KahootComponent,
        LandKingComponent,
        TriviaComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule { }
