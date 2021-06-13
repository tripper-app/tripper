import { Component } from '@angular/core';
import { ModalDialogParams } from "nativescript-angular/modal-dialog";
import { AlertService } from '~/app/common/services/alert-service';
import { LanguageService } from '~/app/common/services/language-service';


@Component({
  selector: 'ns-reset-password-modal',
  templateUrl: './resetPasswordModal.component.html',
  styleUrls: ['./resetPasswordModal.component.scss']
})
export class ResetPasswordModalComponent {
  email = '';
  rightToLeft = true;
  constructor(private params: ModalDialogParams,
    private alertService: AlertService,
    private languageService: LanguageService) {
      this.rightToLeft = this.languageService.getRightToLeft();
  }

  navigateToResetPassword() {
    if (this.email) {
      this.exit(this.email);
    } else {
      this.alertService.showError(this.languageService.getText('login.requireEmail'));
    }
  }

  alignVertical(label) {
    label.android.setGravity(17)
}

  exit(email = undefined) {
    this.params.closeCallback(email);
  }
}