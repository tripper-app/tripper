import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from '@nativescript/angular';
import { LanguageService } from '~/app/common/services/language-service';


@Component({ standalone: false,
  selector: 'ns-notifications-modal',
  templateUrl: './notificationsModal.component.html',
  styleUrls: ['./notificationsModal.component.scss']
})
export class NotificationsModalComponent implements OnInit {
  text = '';
  rightToLeft = true;
  waitingForResponse = false;
  constructor(public params: ModalDialogParams,
    public languageService: LanguageService) {
  }
  ngOnInit() {
    this.rightToLeft = this.languageService.getRightToLeft();
    this.text = this.params.context.text;
  }

  confirm() {
    this.params.closeCallback(true);
  }

  exit() {
    this.params.closeCallback(false);
  }
}