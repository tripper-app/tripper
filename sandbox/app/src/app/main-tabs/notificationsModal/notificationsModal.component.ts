import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from "nativescript-angular/modal-dialog";
import { LanguageService } from '~/app/common/services/language-service';


@Component({
  selector: 'ns-notifications-modal',
  templateUrl: './notificationsModal.component.html',
  styleUrls: ['./notificationsModal.component.scss']
})
export class NotificationsModalComponent implements OnInit {
  text = '';
  rightToLeft = true;
  constructor(private params: ModalDialogParams,
    private languageService: LanguageService) {
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