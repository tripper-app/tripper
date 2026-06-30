import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Page } from "@nativescript/core";
import { Screen as screen } from "@nativescript/core";
import { LanguageService } from "~/app/common/services/language-service";

@Component({ standalone: false,
    selector: 'ns-winBingo',
    templateUrl: './winBingo.component.html',
    styleUrls: ['./winBingo.component.scss']
})
export class WinBingoComponent implements OnInit {
    screenHeight = 1;
    screenWidth = 1;
    timeToWin = '0';
    rigthToLeft = true;
    constructor(public page: Page,
        public router: Router,
        public route: ActivatedRoute,
        public languageService: LanguageService) {
        this.page.actionBarHidden = true;
    }

    ngOnInit(): void {
        this.screenHeight = screen.mainScreen.heightDIPs;
        this.screenWidth = screen.mainScreen.widthDIPs;
        this.timeToWin = this.route.snapshot.params.winTime;
        this.rigthToLeft = this.languageService.getRightToLeft();
    }

    exit() {
        this.router.navigate(['mainTabs', 1]);
    }
}