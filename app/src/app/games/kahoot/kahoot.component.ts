import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Page } from "@nativescript/core";
import { KahootQuiz } from "~/app/common/models/kahootQuiz";
import { GamesService } from "~/app/common/services/games-service";
import { openUrl } from "@nativescript/core/utils";
import { ErrorsService } from "~/app/common/services/errors-service";
import { LanguageService } from "~/app/common/services/language-service";

@Component({ standalone: false,
    selector: 'ns-kahoot',
    templateUrl: './kahoot.component.html',
    styleUrls: ['./kahoot.component.scss']
})
export class KahootComponent implements OnInit {
    rightToLeft = true;
    waitingForResponse = false;
    quizes: KahootQuiz[] = [];

    constructor(public page: Page,
                public gameService: GamesService,
                public router: Router,
                public errorService: ErrorsService,
                public languageService: LanguageService,
                public cd: ChangeDetectorRef){
        this.page.actionBarHidden = true;
    }
    ngOnInit() {
        this.waitingForResponse = true;
        this.gameService.getKahootQuizes().subscribe((res: KahootQuiz[]) => {
            this.waitingForResponse = false;
            this.quizes = res;
            // HTTP response fires off Angular's zone -> force CD to render quizzes.
            this.cd.detectChanges();
        }, err => {
            this.waitingForResponse = false;
            this.errorService.handleErorr(err);
            this.cd.detectChanges();
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