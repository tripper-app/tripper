import { Component } from "@angular/core";
import { GamesService } from "~/app/common/services/games-service";
import { screen } from "tns-core-modules/platform";
import { Router } from "@angular/router";
import { LanguageService } from "~/app/common/services/language-service";
import { Page } from "@nativescript/core";

@Component({
    selector: 'ns-score',
    templateUrl: './score.component.html',
    styleUrls: ['./score.component.scss']
})
export class ScoreComponent {
    rigthToLeft = true;
    constructor(private page: Page,
        private gameService: GamesService,
        private router: Router,
        private languageService: LanguageService) {

    }

    ngOnInit(): void {
        this.page.actionBarHidden = true;
        this.rigthToLeft = this.languageService.getRightToLeft();
    }

    exit() {
        this.gameService.score = 0;
        this.router.navigate(['mainTabs', 1]);
    }
}