import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { MapComponent } from "./map/map.component";
import { MainTabsComponent } from "./main-tabs/main-tabs.component";
import { SignUpComponent } from "./signUp/signUp.component";
import { ResetPasswordComponent } from "./signUp/resetPassword/resetPassword.component";
import { SpringsFiltersComponent } from "./map/spring-filters/spring-filters.component";
import { SpringsViewComponent } from "./map/spring-view/spring-view.component";
import { ProfileComponent } from "./profile/profile.component";
import { HotelsFiltersComponent } from "./hotels/hotels-filters/hotels-filters.component";
import { HotelViewComponent } from "./hotels/hotel-view/hotel-view.component";

const routes: Routes = [
    { path: "", redirectTo: "/hotelView", data: {}, pathMatch: "full" },
    { path: "map", component: MapComponent },
    { path: "springView", component: SpringsViewComponent },
    { path: "springView/:springId", component: SpringsViewComponent },
    { path: "mainTabs", component: MainTabsComponent},
    { path: "mainTabs/:page", component: MainTabsComponent},
    { path: "signUp", component: SignUpComponent},
    { path: "resetPassword", component: ResetPasswordComponent },
    { path: "springsFilter", component: SpringsFiltersComponent },
    { path: "profile", component: ProfileComponent },
    { path: "hotelsFilters", component: HotelsFiltersComponent },
    { path: "hotelView", component: HotelViewComponent },
    { path: "hotelView/:hotelId", component: HotelViewComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
