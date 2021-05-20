import { Component, Input, OnInit } from '@angular/core';
import { screen, } from "tns-core-modules/platform";
import { LanguageService } from '~/app/common/services/language-service';


@Component({
  selector: 'ns-wrong-answer',
  templateUrl: './wrongAnswer.component.html',
  styleUrls: ['./wrongAnswer.component.scss']
})
export class WrongAnswerComponent implements OnInit {
  screenHeight = 1;
  screenWidth = 1;
  @Input() rightAnswer: string;
  constructor(private languageService: LanguageService) {
  }

  ngOnInit(): void {
    this.screenHeight = screen.mainScreen.heightDIPs;
    this.screenWidth = screen.mainScreen.widthDIPs;
  }
}