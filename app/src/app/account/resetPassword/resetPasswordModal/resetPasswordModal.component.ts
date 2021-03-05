import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from "nativescript-angular/modal-dialog";
import { localize } from "nativescript-localize";


@Component({
        selector: 'ns-reset-password-modal',
        templateUrl: './resetPasswordModal.component.html',
        styleUrls: ['./resetPasswordModal.component.scss']
    })
  export class ResetPasswordModalComponent implements OnInit {
  
    constructor(private params: ModalDialogParams) {
    }
  
    ngOnInit(): void {

    }

    exit() {
      this.params.closeCallback();
    }
  }