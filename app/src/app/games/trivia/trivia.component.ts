import { ChangeDetectorRef, Component } from "@angular/core";
import { Router } from "@angular/router";
import { Page } from "@nativescript/core";
import { TriviaSubject } from "~/app/common/models/triviaSubject";
import { ErrorsService } from "~/app/common/services/errors-service";
import { GamesService } from "~/app/common/services/games-service";
import { LanguageService } from "~/app/common/services/language-service";

@Component({ standalone: false,
    selector: 'ns-trivia',
    templateUrl: './trivia.component.html',
    styleUrls: ['./trivia.component.scss']
})
export class TriviaComponent {

    rightToLeft = true;
    waitingForResponse = false;
    subjects: TriviaSubject[] = [];

    constructor(public page: Page,
        public gameService: GamesService,
        public languageService: LanguageService,
        public router: Router,
        public errorService: ErrorsService,
        public cd: ChangeDetectorRef) {
        this.page.actionBarHidden = true;
    }

    ngOnInit() {
        this.waitingForResponse = true;
        this.gameService.getTriviasubjects().subscribe((res: TriviaSubject[]) => {
            this.waitingForResponse = false;
            this.subjects = res;
            // HTTP response fires off Angular's zone -> force CD to render subjects.
            this.cd.detectChanges();
        }, err => {
            this.waitingForResponse = false;
            this.errorService.handleErorr(err);
            this.cd.detectChanges();
        })
    }

    goToQuestion(subject: TriviaSubject) {
        let subjects: TriviaSubject[];
        if (subject.id === 'all') {
            this.subjects.splice(this.subjects.indexOf(subject), 1);
            subjects = this.subjects
        } else {
            subjects = [subject];
        }
        this.gameService.chooseSubjects(subjects);
        this.router.navigate(['triviaQuestion']);
    }

    navigateToGames() {
        this.router.navigate(['mainTabs', 1]);
    }
}