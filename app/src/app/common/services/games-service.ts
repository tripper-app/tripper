import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import localize from 'nativescript-localize';
import { Subscriber } from 'rxjs';
import { KahootQuiz } from '../models/kahootQuiz';
import { HttpService } from './http-service';
import { TriviaSubject } from '../models/triviaSubject';

@Injectable({
    providedIn: 'root'
})
export class GamesService {

    kahootQuizes: KahootQuiz[];
    triviaSubjects: TriviaSubject[];
    selectedSubjects: {remainedQuestions: number[], subject: TriviaSubject}[];
    score = 0;
    subjectName = '';

    constructor(private httpService: HttpService) {
    }

    chooseSubjects(subjects: TriviaSubject[]) {
        this.score = 0;
        this.selectedSubjects = [];
        subjects.forEach(subject => {
            const remainedQuestions = [];
            for (let index = 0; index < subject.size; index++) {
                remainedQuestions.push(index);
            }

            this.selectedSubjects.push({remainedQuestions: remainedQuestions, subject: subject})
        });
    }

    getKahootQuizes() {
        if (this.kahootQuizes) {
            return new Observable<KahootQuiz[]>((subscriber: Subscriber<KahootQuiz[]>) => {
                subscriber.next(this.kahootQuizes)
            });
        }
        else {
            const kahootMap = map((data: any) => {
                this.kahootQuizes = data;
                return data;
            }, error => {
                console.log(error);
                throw error;
            })
            return kahootMap(this.httpService.getKahoot());
        }
    }

    getTriviasubjects() {
        if (this.triviaSubjects) {
            return new Observable<TriviaSubject[]>((subscriber: Subscriber<TriviaSubject[]>) => {
                subscriber.next(this.triviaSubjects)
            });
        }
        else {
            const TriviaMap = map((data: any) => {
                this.triviaSubjects = data;
                const allSubjects = new TriviaSubject();
                allSubjects.id = 'all';
                allSubjects.name = localize('labels.all');
                this.triviaSubjects.push(allSubjects);
                return data;
            }, error => {
                console.log(error);
                throw error;
            })
            return TriviaMap(this.httpService.getTriviaSubjects());
        }
    }

    getTriviaQuestion() {
        if (!this.selectedSubjects.length) {
            return undefined;
        }
        const randomSubject = this.selectedSubjects[Math.floor(Math.random() * this.selectedSubjects.length)]
        this.subjectName = randomSubject.subject.name;
        const questionIndex = randomSubject.remainedQuestions.splice(Math.floor(Math.random() * randomSubject.remainedQuestions.length), 1)[0];
        if (!randomSubject.remainedQuestions.length) {
            this.selectedSubjects.splice(this.selectedSubjects.indexOf(randomSubject), 1);
        }
        
        return this.httpService.getTriviaQuestion(randomSubject.subject.id, 'q' + questionIndex);
    }

    getBingoItems(){
        return this.httpService.getBingoItems();
    }
}
