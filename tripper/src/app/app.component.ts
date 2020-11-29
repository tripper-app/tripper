import { Component, OnInit } from "@angular/core";
import { DrawerTransitionBase, SlideInOnTopTransition } from "nativescript-ui-sidedrawer";
import { on, launchEvent } from '@nativescript/core/application';
import { androidLaunchEventLocalizationHandler } from 'nativescript-localize/localize';
import { DrawerService } from './common/services/drawer-service';


on(launchEvent, (args) => {
  if (args.android) {
    androidLaunchEventLocalizationHandler();
  }
});

@Component({
    selector: "ns-app",
    templateUrl: "app.component.html"
})
export class AppComponent implements OnInit {
    private _sideDrawerTransition: DrawerTransitionBase;
    sideDrawerEnabled = false;

    constructor(private drawerService: DrawerService) {
    }

    ngOnInit(): void {      
        this._sideDrawerTransition = new SlideInOnTopTransition();

        this.drawerService.sideDrawerEnabled.subscribe(x =>     
          this.sideDrawerEnabled = x
        );
    }

    get sideDrawerTransition(): DrawerTransitionBase {
        return this._sideDrawerTransition;
    }
}
