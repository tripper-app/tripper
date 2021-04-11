import { Component, ElementRef, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Page } from "@nativescript/core";
import { TriviaQuestion } from "~/app/common/models/triviaQuestion";
import { ErrorsService } from "~/app/common/services/errors-service";
import { GamesService } from "~/app/common/services/games-service";

@Component({
    selector: 'ns-trivia-question',
    templateUrl: './trivia-question.component.html',
    styleUrls: ['./trivia-question.component.scss']
})
export class TriviaQuestionComponent {
    @ViewChild("wrongAnswer", { static: false }) wrongAnswer: ElementRef;
    @ViewChild("rightAnswer", { static: false }) rightAnswer: ElementRef;
    rightToLeft = true;
    waitingForResponse = false;
    question = new TriviaQuestion();
    name = "ארץ ישראל";

    constructor(private page: Page,
        private gameService: GamesService,
        private router: Router,
        private route: ActivatedRoute,
        private errorService: ErrorsService) {
        this.page.actionBarHidden = true;
    }

    ngOnInit() {
        this.nextQuestion();
    }

    checkAnswer(answer) {
        if (answer == this.question.rightAnswer) {
            this.gameService.score += 50;
            this.animateAnswer(this.rightAnswer);
        } else {
            this.animateAnswer(this.wrongAnswer);
        }
    }

    animateAnswer(stack: ElementRef) {
        stack.nativeElement.animate({ opacity: 0.9, duration: 200 });
        setTimeout(() => {
            stack.nativeElement.animate({ opacity: 0, duration: 200 });
            this.nextQuestion();
        }, 1800);
    }

    nextQuestion() {
        const questionGetter = this.gameService.getTriviaQuestion();
        
        if (questionGetter !== undefined) {
            this.waitingForResponse = true;
            questionGetter.subscribe((res: TriviaQuestion) => {
                this.waitingForResponse = false;
                this.question = res;
            }, err => {
                this.waitingForResponse = false;
                this.errorService.handleErorr(err);
            })
        } else {            
            this.exit();
        }
    }

    exit() {
        this.router.navigate(['score']);        
    }
}