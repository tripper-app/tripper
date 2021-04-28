import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Page } from "@nativescript/core";
import { KahootQuiz } from "~/app/common/models/kahootQuiz";
import { GamesService } from "~/app/common/services/games-service";
import { openUrl } from "tns-core-modules/utils/utils";
import { ErrorsService } from "~/app/common/services/errors-service";

@Component({
    selector: 'ns-kahoot',
    templateUrl: './kahoot.component.html',
    styleUrls: ['./kahoot.component.scss']
})
export class KahootComponent implements OnInit {
    rightToLeft = true;
    waitingForResponse = false;
    quizes: KahootQuiz[] = [];

    constructor(private page: Page,
                private gameService: GamesService,
                private router: Router,
                private errorService: ErrorsService){
        this.page.actionBarHidden = true;
    }
    ngOnInit() {
        this.waitingForResponse = true;
        this.gameService.getKahootQuizes().subscribe((res: KahootQuiz[]) => {
            this.waitingForResponse = false;
            this.quizes = res;
        }, err => {
            this.waitingForResponse = false;
            this.errorService.handleErorr(err);
        })
    }

    openUrl(url){
        openUrl(url);
    }

    navigateToGames(){
        this.router.navigate(['mainTabs', 1]);
    }

    exit(){
        this.router.navigate(['mainTabs', 1]);
    }
}