import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { MapComponent } from "./map/map.component";
import { MainTabsComponent } from "./main-tabs/main-tabs.component";
import { SignUpComponent } from "./signUp/signUp.component";
import { ResetPasswordComponent } from "./signUp/resetPassword/resetPassword.component";


const routes: Routes = [
    { path: "", redirectTo: "/mainTabs", pathMatch: "full" },
    { path: "map", component: MapComponent },
    { path: "mainTabs", component: MainTabsComponent},
    { path: "signUp", component: SignUpComponent},
    { path: "resetPassword", component: ResetPasswordComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
