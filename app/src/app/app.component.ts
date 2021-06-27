import { Component, NgZone, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { registerUniversalLinkCallback } from "@nativescript-community/universal-links";

import { on as applicationOn, resumeEvent, ApplicationEventData, android } from "tns-core-modules/application";

@Component({
    selector: "ns-app",
    templateUrl: "./app.component.html"
})
export class AppComponent implements OnInit {
    constructor(private router: Router,
        private zone: NgZone) { }

    ngOnInit() {
        this.listenToLink();
    }

    listenToLink() {
        applicationOn(resumeEvent, (args: ApplicationEventData) => {
            if (args.android) {
                const activity = args.android.getIntent().getData();
                if (activity) {
                    const url = activity.toString();
                    const splitted = url.split('/');
                    const query = splitted[splitted.length - 1]
                    const params = query.split('?');
                    if (params[0] == "springView") {
                        this.zone.run(() => {
                            const springId = params[1].split('=')[1].replace('+', ' ');
                            this.router.navigate(["springView", springId]);
                        });
                    }
                }

            } else if (args.ios) {
                // For iOS applications, args.ios is UIApplication.
                console.log("UIApplication: " + args.ios);
            }
        });
    }
}