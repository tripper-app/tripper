import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDialogParams } from "nativescript-angular/modal-dialog";
import { localize } from "nativescript-localize";
import { AlertService } from '~/app/common/services/alert-service';
import { UserService } from '~/app/common/services/userService';


@Component({
  selector: 'ns-reset-password-modal',
  templateUrl: './resetPasswordModal.component.html',
  styleUrls: ['./resetPasswordModal.component.scss']
})
export class ResetPasswordModalComponent implements OnInit {
  email = 'odedoded777@gmail.com';
  constructor(private params: ModalDialogParams,
    private router: Router,
    private alertService: AlertService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService) {
  }

  ngOnInit(): void {

  }

  navigateToResetPassword() {
    if (this.email) {
      this.exit();
      // this.userService.resetPasswordCreateCode(this.email).subscribe(() => {});
      // setTimeout(() => {
      //   this.router.navigate(['resetPassword', this.email]);
      // }, 0);

    } else {
      this.alertService.showError(localize('login.requireEmail'));
    }

  }

  exit() {
    this.params.closeCallback(this.email);
  }
}