import { Component, Input, OnInit } from '@angular/core';
import { Screen as screen } from "@nativescript/core";
import { LanguageService } from '~/app/common/services/language-service';


@Component({ standalone: false,
  selector: 'ns-wrong-answer',
  templateUrl: './wrongAnswer.component.html',
  styleUrls: ['./wrongAnswer.component.scss']
})
export class WrongAnswerComponent implements OnInit {
  screenHeight = 1;
  screenWidth = 1;
  @Input() rightAnswer: string;
  constructor(public languageService: LanguageService) {
  }

  ngOnInit(): void {
    this.screenHeight = screen.mainScreen.heightDIPs;
    this.screenWidth = screen.mainScreen.widthDIPs;
  }
}