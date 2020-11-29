import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RadSideDrawer, SideDrawerLocation } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";

@Injectable({
    providedIn: 'root'
})
export class DrawerService {
    private _sideDrawerEnabled = new BehaviorSubject(false);

    constructor() {
    }

    set sideDrawer(value: boolean) {
        this._sideDrawerEnabled.next(value);
    }
    get sideDrawerEnabled(): BehaviorSubject<boolean> {
        return this._sideDrawerEnabled;
    }

    setdrawerLocation(rightToLeft) {
        (<RadSideDrawer>app.getRootView()).drawerLocation = rightToLeft ? SideDrawerLocation.Right : SideDrawerLocation.Left;

    }

    openDrawer() {
        (<RadSideDrawer>app.getRootView()).showDrawer()
    }

    closeDrawer(){
        (<RadSideDrawer>app.getRootView()).closeDrawer()
    }
}
