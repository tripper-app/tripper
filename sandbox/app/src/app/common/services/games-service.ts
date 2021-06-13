import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Subscriber } from 'rxjs';
import { KahootQuiz } from '../models/kahootQuiz';
import { HttpService } from './http-service';
import { TriviaSubject } from '../models/triviaSubject';
import { Location } from '../models/location';
import { TriviaQuestion } from '../models/triviaQuestion';
import * as dist from 'geo-distance';
import { LanguageService } from './language-service';

@Injectable({
    providedIn: 'root'
})
export class GamesService {
    triviaQuestions = undefined;
    kahootQuizes: KahootQuiz[];
    triviaSubjects: TriviaSubject[];
    locations: Location[] = undefined;
    selectedSubjects: TriviaSubject[];
    score = 0;
    subjectName = '';
    firstResult = 500;
    secondResult = 300;
    thirdResult = 150;
    fourthResult = 0;
    upperLeft = { lat: 33.415225, lon: 33.5891567 };
    // upperLeft = { lat: 33.12831197751661, lon: 34.258082831539355 };
    lowerRight = { lat: 29.390395, lon: 36.757588 };
    // lowerRight = { lat: 29.669710018637986, lon: 35.793557239728504 };

    constructor(private httpService: HttpService,
        private languageService: LanguageService) {
    }

    setHighScore(quiz: string, score: number) {
        return this.httpService.setHighScore(quiz, score);
    }

    getHighScore(quiz: string) {
        return this.httpService.getHighScore(quiz);
    }

    chooseSubjects(subjects: TriviaSubject[]) {
        this.score = 0;
        this.selectedSubjects = [];
        this.selectedSubjects = subjects;
        this.subjectName = subjects.length > 1 ? this.languageService.getText('labels.all') : subjects[0].name;

        this.triviaQuestions = undefined;
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
                allSubjects.name = this.languageService.getText('labels.all');
                this.triviaSubjects.push(allSubjects);
                return data;
            }, error => {
                console.log(error);
                throw error;
            })
            return TriviaMap(this.httpService.getTriviaSubjects());
        }
    }

    getTriviaQuestions() {
        if (this.triviaQuestions) {
            if (this.triviaQuestions.length) {
                return new Observable<TriviaQuestion>((subscriber: Subscriber<TriviaQuestion>) => {
                    subscriber.next(this.triviaQuestions.splice(Math.random() * (this.triviaQuestions.length - 1), 1)[0])
                });
            } else {
                return undefined;
            }
        } else {
            const questionsMap = map((data: TriviaQuestion[]) => {
                const question = data.splice(Math.random() * (data.length - 1), 1)[0];
                this.triviaQuestions = data;
                return question;
            })
            return questionsMap(this.httpService.getTriviaQuestions(this.selectedSubjects.map(s => s.id)));
        }
    }

    getBingoItems() {
        return this.httpService.getBingoItems();
    }

    getLocations() {
        this.score = 0;
        if (this.locations) {
            return new Observable<Location[]>((subscriber: Subscriber<Location[]>) => {
                subscriber.next(this.locations)
            });
        }
        else {
            const locationsMap = map((data: any) => {
                this.locations = data;
                return data;
            }, error => {
                console.log(error);
                throw error;
            })
            return locationsMap(this.httpService.getLocations());
        }
    }

    locate(location: Location, userLocate) {
        const click = { lat: 0, lon: 0 };
        click.lat = ((this.upperLeft.lat - this.lowerRight.lat) * userLocate.y) + this.lowerRight.lat;
        click.lon = ((this.lowerRight.lon - this.upperLeft.lon) * userLocate.x) + this.upperLeft.lon;

        const distance = dist.between(click, { lat: location.location._latitude, lon: location.location._longitude });
        const numberedDistance = (Number)(distance.human_readable().distance);
        const score = this.calculateLocationScore(numberedDistance);
        const text = this.getScoreFeedback(score);
        this.score += score;
        return { score, text };
    }

    getTranslate(location: Location) {
        const x = (location.location._longitude - this.upperLeft.lon) / (this.lowerRight.lon - this.upperLeft.lon);
        const y = 1 - (location.location._latitude - this.lowerRight.lat) / (this.upperLeft.lat - this.lowerRight.lat);
        return { x, y };
    }

    calculateLocationScore(distance) {
        if (distance < 30)
            return this.firstResult;
        if (distance < 55)
            return this.secondResult;
        if (distance < 75)
            return this.thirdResult;
        return this.fourthResult;
    }

    getScoreFeedback(score) {
        let feedback = ''
        switch (score) {
            case this.firstResult:
                feedback = this.languageService.getText("games.landKingLocationFeedback1");
                break;
            case this.secondResult:
                feedback = this.languageService.getText("games.landKingLocationFeedback2");
                break;
            case this.thirdResult:
                feedback = this.languageService.getText("games.landKingLocationFeedback3");
                break;
            case this.fourthResult:
                feedback = this.languageService.getText("games.landKingLocationFeedback4");
            default:
                feedback = this.languageService.getText("games.landKingLocationFeedback4");
                break;
        }
        
        const splitted = feedback.split('$');
        
        return splitted[Math.round(Math.random()*splitted.length)];
    }
}
