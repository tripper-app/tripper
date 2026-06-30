import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from '@nativescript/angular';
import { LanguageService } from '~/app/common/services/language-service';


@Component({ standalone: false,
  selector: 'ns-start-modal-modal',
  templateUrl: './startModal.component.html',
  styleUrls: ['./startModal.component.scss']
})
export class StartModalComponent implements OnInit {
  rightToLeft = true;
  constructor(public params: ModalDialogParams,
              public languageService: LanguageService) {
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