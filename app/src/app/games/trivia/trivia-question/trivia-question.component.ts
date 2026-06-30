import { ChangeDetectorRef, Component, ElementRef, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Page } from "@nativescript/core";
import { TriviaQuestion } from "~/app/common/models/triviaQuestion";
import { ErrorsService } from "~/app/common/services/errors-service";
import { GamesService } from "~/app/common/services/games-service";
import { LanguageService } from "~/app/common/services/language-service";
import { UserService } from "~/app/common/services/userService";

@Component({ standalone: false,
    selector: 'ns-trivia-question',
    templateUrl: './trivia-question.component.html',
    styleUrls: ['./trivia-question.component.scss']
})
export class TriviaQuestionComponent {
    @ViewChild("wrongAnswer", { static: false }) wrongAnswer: ElementRef;
    @ViewChild("rightAnswer", { static: false }) rightAnswer: ElementRef;
    waitingForResponse = false;
    showingAnswer = false;
    question = new TriviaQuestion();
    pendingQuestion: TriviaQuestion;
    highScore = 0;
    timer = 0;
    quizName = "trivia";
    constructor(public page: Page,
        public languageService: LanguageService,
        public gameService: GamesService,
        public router: Router,
        public errorService: ErrorsService,
        public userService: UserService,
        public cd: ChangeDetectorRef) {
        this.page.actionBarHidden = true;
    }

    ngOnInit() {
        setInterval(() => {
            this.timer += 1000;
        }, 1000)
        this.getHighScore();
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
        this.showingAnswer = true;
        stack.nativeElement.animate({ opacity: 0.9, duration: 200 });
        this.nextQuestion();
        setTimeout(() => {
            stack.nativeElement.animate({ opacity: 0, duration: 200 }).then(() => {
                this.showingAnswer = false;
                this.afetrAnswer();
            });
        }, 1800);
    }

    nextQuestion() {
        const questionGetter = this.gameService.getTriviaQuestions();
        if (questionGetter !== undefined) {
            this.waitingForResponse = true;
            questionGetter.subscribe((res) => {
                this.pendingQuestion = res;
                this.waitingForResponse = false;
                this.afetrAnswer();
                // HTTP response fires off Angular's zone -> force CD to render.
                this.cd.detectChanges();
            }, err => {
                this.waitingForResponse = false;
                this.errorService.handleErorr(err);
                this.cd.detectChanges();
            })
        } else {
            this.pendingQuestion = null;
            // this.exit();
        }
    }

    afetrAnswer() {
        if (!this.waitingForResponse && !this.showingAnswer) {
            if (this.pendingQuestion) {
                this.question = this.pendingQuestion;
            } else {
                this.exit();
            }
        }
    }

    getHighScore() {
        this.gameService.getHighScore(this.quizName).subscribe(res => {
            if (res && res.score) {
                this.highScore = res.score;
            }
            this.cd.detectChanges();
        }, err => {
            this.errorService.handleErorr(err);
            this.cd.detectChanges();
        })
    }

    exit() {
        if (this.userService.userLoggedIn) {

            if (this.gameService.score > this.highScore) {
                this.gameService.setHighScore(this.quizName, this.gameService.score).subscribe(res => {
                    console.log("new highscore is " + this.gameService.score);
                })
            }
        }
        this.router.navigate(['score']);
    }
}