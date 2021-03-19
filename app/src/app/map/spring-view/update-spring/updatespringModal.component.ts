import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDialogParams } from "nativescript-angular/modal-dialog";
import { localize } from "nativescript-localize";
import { AlertService } from '~/app/common/services/alert-service';
import { UserService } from '~/app/common/services/userService';


@Component({
  selector: 'ns-update-spring-modal',
  templateUrl: './updatespringdModal.component.html',
  styleUrls: ['./updatespringModal.component.scss']
})
export class UpdatespringModalComponent implements OnInit {
  content = 'aaa';
  constructor(private params: ModalDialogParams,
    private router: Router,
    private alertService: AlertService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService) {
  }

  ngOnInit(): void {

  }

  confirm() {
    if (this.content) {
      this.exit(true);
      // this.userService.resetPasswordCreateCode(this.email).subscribe(() => {});
      // setTimeout(() => {
      //   this.router.navigate(['resetPassword', this.email]);
      // }, 0);

    } else {
      this.alertService.showError(localize('login.requireEmail'));
    }

  }

  exit(ok = false) {
    this.params.closeCallback(ok);
  }
}