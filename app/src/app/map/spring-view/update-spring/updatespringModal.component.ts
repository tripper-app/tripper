import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDialogParams } from "nativescript-angular/modal-dialog";
import { AlertService } from '~/app/common/services/alert-service';
import { UserService } from '~/app/common/services/userService';


@Component({
  selector: 'ns-update-spring-modal',
  templateUrl: './updatespringModal.component.html',
  styleUrls: ['./updatespringModal.component.scss']
})
export class UpdateSpringModalComponent {
  content = '';
  constructor(private params: ModalDialogParams) {
  }

  confirm() {
      this.exit(this.content);
  }

  exit(text: string) {
    this.params.closeCallback(text);
  }
}