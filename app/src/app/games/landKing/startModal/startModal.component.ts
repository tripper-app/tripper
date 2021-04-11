import { Component } from '@angular/core';
import { ModalDialogParams } from "nativescript-angular/modal-dialog";
import { localize } from "nativescript-localize";
import { AlertService } from '~/app/common/services/alert-service';


@Component({
  selector: 'ns-start-modal-modal',
  templateUrl: './startModal.component.html',
  styleUrls: ['./startModal.component.scss']
})
export class StartModalComponent {
  rightToLeft = true;
  constructor(private params: ModalDialogParams,
    private alertService: AlertService) {
  }

  confirm() {

  }

  exit() {
  }
}