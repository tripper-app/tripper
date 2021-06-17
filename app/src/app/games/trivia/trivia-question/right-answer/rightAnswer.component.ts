import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '~/app/common/services/alert-service';
import { UserService } from '~/app/common/services/userService';
import { screen } from "tns-core-modules/platform";
import { LanguageService } from '~/app/common/services/language-service';


@Component({
  selector: 'ns-right-answer',
  templateUrl: './rightAnswer.component.html',
  styleUrls: ['./rightAnswer.component.scss']
})
export class RightAnswerComponent implements OnInit {
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