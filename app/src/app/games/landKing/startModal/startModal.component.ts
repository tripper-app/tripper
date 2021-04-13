import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDialogParams } from "nativescript-angular/modal-dialog";
import { localize } from "nativescript-localize";
import { AlertService } from '~/app/common/services/alert-service';
import { LanguageService } from '~/app/common/services/language-service';


@Component({
  selector: 'ns-start-modal-modal',
  templateUrl: './startModal.component.html',
  styleUrls: ['./startModal.component.scss']
})
export class StartModalComponent implements OnInit {
  rightToLeft = true;
  constructor(private params: ModalDialogParams,
              private alertService: AlertService,
              private languageService: LanguageService,
              private router: Router) {
  }
  ngOnInit() {
    this.rightToLeft = this.languageService.getRightToLeft();
  }

  confirm() {
    this.params.closeCallback(true);
  }

  exit() {
    // this.router.navigate(['mainTabs', 1])
    this.params.closeCallback(false);
  }
}