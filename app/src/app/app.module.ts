import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptFormsModule } from "nativescript-angular/forms"
import { NativeScriptUISideDrawerModule } from "nativescript-ui-sidedrawer/angular";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { Gif } from 'nativescript-gif';
import { AppRoutingModule } from "./app-routing.module";
import { NativeScriptLocalizeModule } from "nativescript-localize/angular";
import { NativeScriptRouterModule } from "nativescript-angular/router";
// import { NativeScriptFacebookModule } from "nativescript-facebook/angular";
// import { init, initAnalytics } from "nativescript-facebook";
// import * as application from 'tns-core-modules/application';

import { AppComponent } from "./app.component";
import { MainTabsComponent } from "./main-tabs/main-tabs.component";
import { MapComponent } from "./map/map.component";
import { FiltersComponent } from "./filters/filters.component"
import { registerElement } from "nativescript-angular/element-registry";
import { HomeComponent } from './home/home.component';
import { SpringModalComponent } from './map/spring-modal/spring-modal.component';
import { SettingModalComponent } from './setting/setting.component';
import { CarouselComponent } from './home/carousel/carousel.component';
import { SignUpComponent } from "./signUp/signUp.component";
import { ResetPasswordComponent } from "./signUp/resetPassword/resetPassword.component";
// registerElement('Carousel', () => Carousel);
// registerElement('CarouselItem', () => CarouselItem);
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
        // NativeScriptFacebookModule
    ],
    entryComponents: [
        SpringModalComponent,
        SettingModalComponent
    ],
    declarations: [
        AppComponent,
        MapComponent,
        SpringModalComponent,
        FiltersComponent,
        HomeComponent,
        SettingModalComponent,
        CarouselComponent,
        SignUpComponent,
        ResetPasswordComponent,
        MainTabsComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule { }
