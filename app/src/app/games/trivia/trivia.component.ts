import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { Page } from "@nativescript/core";
import { TriviaSubject } from "~/app/common/models/triviaSubject";
import { ErrorsService } from "~/app/common/services/errors-service";
import { GamesService } from "~/app/common/services/games-service";

@Component({
    selector: 'ns-trivia',
    templateUrl: './trivia.component.html',
    styleUrls: ['./trivia.component.scss']
})
export class TriviaComponent {

    rightToLeft = true;
    waitingForResponse = false;
    subjects: TriviaSubject[] = [];

    constructor(private page: Page,
        private gameService: GamesService,
        private router: Router,
        private errorService: ErrorsService) {
        this.page.actionBarHidden = true;
    }

    ngOnInit() {
        this.waitingForResponse = true;
        this.gameService.getTriviasubjects().subscribe((res: TriviaSubject[]) => {
            this.waitingForResponse = false;
            this.subjects = res;
        }, err => {
            this.waitingForResponse = false;
            this.errorService.handleErorr(err);
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