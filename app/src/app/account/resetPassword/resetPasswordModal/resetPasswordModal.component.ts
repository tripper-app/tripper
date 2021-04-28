import { Component } from '@angular/core';
import { ModalDialogParams } from "nativescript-angular/modal-dialog";
import { localize } from "nativescript-localize";
import { AlertService } from '~/app/common/services/alert-service';


@Component({
  selector: 'ns-reset-password-modal',
  templateUrl: './resetPasswordModal.component.html',
  styleUrls: ['./resetPasswordModal.component.scss']
})
export class ResetPasswordModalComponent {
  email = '';
  constructor(private params: ModalDialogParams,
    private alertService: AlertService) {
  }

  navigateToResetPassword() {
    if (this.email) {
      this.exit(this.email);
    } else {
      this.alertService.showError(localize('login.requireEmail'));
    }
  }

  exit(email = undefined) {
    this.params.closeCallback(email);
  }
}