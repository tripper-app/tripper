import { Component, OnInit } from "@angular/core";
import { on, launchEvent } from '@nativescript/core/application';
import { androidLaunchEventLocalizationHandler } from 'nativescript-localize/localize';


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

    constructor() {
    }

    ngOnInit(): void {      
    }
}
