import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { MapComponent } from "./map/map.component";
import { HomeComponent } from "./home/home.component";
import { SignUpComponent } from "./home/signUp/signUp.component";
import { ResetPasswordComponent } from "./home/signUp/resetPassword/resetPassword.component";


const routes: Routes = [
    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "map", component: MapComponent },
    { path: "home", component: HomeComponent},
    { path: "signUp", component: SignUpComponent},
    { path: "resetPassword", component: ResetPasswordComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
