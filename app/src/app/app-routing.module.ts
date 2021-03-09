import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { MapComponent } from "./map/map.component";
import { MainTabsComponent } from "./main-tabs/main-tabs.component";
import { SignUpComponent } from "./account/signUp/signUp.component";
import { ResetPasswordComponent } from "./account/resetPassword/resetPassword.component";
import { SpringsFiltersComponent } from "./map/spring-filters/spring-filters.component";
import { SpringsViewComponent } from "./map/spring-view/spring-view.component";
import { ProfileComponent } from "./profile/profile.component";
import { HotelsFiltersComponent } from "./hotels/hotels-filters/hotels-filters.component";
import { HotelViewComponent } from "./hotels/hotel-view/hotel-view.component";
import { LoginComponent } from "./account/login/login.component";
import { getString } from '@nativescript/core/application-settings';

const loggedUser = getString('user_token');
const firstPage = 'mainTabs/' +  (loggedUser? '0' : '0');

const routes: Routes = [
    { path: "", redirectTo: firstPage, data: {}, pathMatch: "full" },
    { path: "map", component: MapComponent },
    { path: "springView", component: SpringsViewComponent },
    { path: "springView/:springId", component: SpringsViewComponent },
    { path: "mainTabs", component: MainTabsComponent},
    { path: "mainTabs/:page", component: MainTabsComponent},
    { path: "signUp", component: SignUpComponent},
    { path: "resetPassword/:email", component: ResetPasswordComponent },
    { path: "springsFilter", component: SpringsFiltersComponent },
    { path: "profile", component: ProfileComponent },
    { path: "hotelsFilters", component: HotelsFiltersComponent },
    { path: "hotelView", component: HotelViewComponent },
    { path: "hotelView/:hotelId", component: HotelViewComponent },
    { path: "login", component: LoginComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
