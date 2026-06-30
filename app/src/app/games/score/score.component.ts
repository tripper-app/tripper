import { Component } from "@angular/core";
import { GamesService } from "~/app/common/services/games-service";
import { Screen as screen } from "@nativescript/core";
import { Router } from "@angular/router";
import { LanguageService } from "~/app/common/services/language-service";
import { Page } from "@nativescript/core";

@Component({ standalone: false,
    selector: 'ns-score',
    templateUrl: './score.component.html',
    styleUrls: ['./score.component.scss']
})
export class ScoreComponent {
    rigthToLeft = true;
    constructor(public page: Page,
        public gameService: GamesService,
        public router: Router,
        public languageService: LanguageService) {

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