import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from '@nativescript/angular';
import { Routes } from "@angular/router";
import { getString } from '@nativescript/core/application-settings';

import { AboutComponent } from "./about/about.component";
import { MapComponent } from "./map/map.component";
import { SpringsViewComponent } from "./map/spring-view/spring-view.component";
import { MainTabsComponent } from "./main-tabs/main-tabs.component";
import { SignUpComponent } from "./account/signUp/signUp.component";
import { ResetPasswordComponent } from "./account/resetPassword/resetPassword.component";
import { SpringsFiltersComponent } from "./map/spring-filters/spring-filters.component";
import { ProfileComponent } from "./profile/profile.component";
import { HotelsFiltersComponent } from "./hotels/hotels-filters/hotels-filters.component";
import { HotelViewComponent } from "./hotels/hotel-view/hotel-view.component";
import { LoginComponent } from "./account/login/login.component";
import { BingoComponent } from "./games/bingo/bingo.component";
import { KahootComponent } from "./games/kahoot/kahoot.component";
import { TriviaComponent } from "./games/trivia/trivia.component";
import { TriviaQuestionComponent } from "./games/trivia/trivia-question/trivia-question.component";
import { ScoreComponent } from "./games/score/score.component";
import { WinBingoComponent } from "./games/bingo/winBingo/winBingo.component";
import { LandKingComponent } from "./games/landKing/landKing.component";
import { SpringsService } from "./common/services/springs-service";

const loggedUser = getString('user_token');
const firstPage = 'mainTabs/' +  (loggedUser? '3' : '0');
const routes: Routes = [
    { path: "", redirectTo: firstPage, data: {}, pathMatch: "full" },
    { path: "map", component: MapComponent },
    { path: "springView", component: SpringsViewComponent },
    { path: "springView/:springId", component: SpringsViewComponent },
    { path: "mainTabs", component: MainTabsComponent},
    { path: "mainTabs/:page", component: MainTabsComponent},
    { path: "signUp", component: SignUpComponent},
    { path: "resetPassword/:email", component: ResetPasswordComponent },
    { path: "resetPassword", component: ResetPasswordComponent },
    { path: "springsFilter", component: SpringsFiltersComponent },
    { path: "profile", component: ProfileComponent },
    { path: "hotelsFilters", component: HotelsFiltersComponent },
    { path: "hotelView", component: HotelViewComponent },
    { path: "hotelView/:hotelId", component: HotelViewComponent },
    { path: "login", component: LoginComponent },
    { path: "bingo", component: BingoComponent },
    { path: "kahoot", component: KahootComponent },
    { path: "trivia", component: TriviaComponent },
    { path: "triviaQuestion", component: TriviaQuestionComponent },
    { path: "score", component: ScoreComponent },
    { path: "winBingo/:winTime", component: WinBingoComponent },
    { path: "landKing", component: LandKingComponent },
    { path: "about", component: AboutComponent }
];

@NgModule({
    providers: [SpringsService],
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
