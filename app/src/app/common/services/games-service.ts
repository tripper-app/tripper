import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import localize from 'nativescript-localize';
import { Subscriber } from 'rxjs';
import { KahootQuiz } from '../models/kahootQuiz';
import { HttpService } from './http-service';
import { TriviaSubject } from '../models/triviaSubject';
import { Location } from '../models/location';
import { TriviaQuestion } from '../models/triviaQuestion';
import * as dist from 'geo-distance';

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

    constructor(private httpService: HttpService) {
    }

    chooseSubjects(subjects: TriviaSubject[]) {
        this.score = 0;
        this.selectedSubjects = [];
        this.selectedSubjects = subjects;
        this.subjectName = subjects.length > 1 ? localize('labels.all') : subjects[0].name;

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
        this.score += 50;
        const upperLeft = { lat: 33.12831197751661, lon: 34.258082831539355 };
        const lowerRight = { lat: 29.669710018637986, lon: 35.793557239728504 };
        const click = { lat: 0, lon: 0 };
        click.lat = ((upperLeft.lat - lowerRight.lat) * userLocate.y) + lowerRight.lat;
        click.lon = ((lowerRight.lon - upperLeft.lon) * userLocate.x) + upperLeft.lon;        
        
        const distance = dist.between(click, { lat: location.location._latitude, lon: location.location._longitude });        
        this.calculateLocationScore((Number)(distance.human_readable().distance));
    }

    calculateLocationScore(distance){
        if (distance < 15) {
            this.score += 100;
            alert("מושלם")
        } else {
            if (distance < 30) {
                this.score+= 70;
                alert("קרוב...");
            } else {
                if (distance < 45) {
                    this.score += 40;
                    alert("בערך... דרוש דיוק");
                } else {
                    alert("אפילו לא קרוב!");
                }
            }
        }
    }
}
