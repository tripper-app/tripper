export class TriviaQuestion{
    text: string;
    answers: string[];
    rightAnswer: number;
    image: string;

    constructor(){
        this.text = "";
        this.answers = [];
        this.rightAnswer = 0;
        this.image = "";
    }
}