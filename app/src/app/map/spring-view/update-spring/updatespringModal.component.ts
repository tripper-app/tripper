import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDialogParams } from "nativescript-angular/modal-dialog";
import { localize } from "nativescript-localize";
import { AlertService } from '~/app/common/services/alert-service';
import { UserService } from '~/app/common/services/userService';


@Component({
  selector: 'ns-update-spring-modal',
  templateUrl: './updatespringModal.component.html',
  styleUrls: ['./updatespringModal.component.scss']
})
export class UpdateSpringModalComponent implements OnInit {
  content = '';
  constructor(private params: ModalDialogParams,
    private router: Router,
    private alertService: AlertService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService) {
  }

  ngOnInit(): void {
  }

  confirm() {
      this.exit(this.content);
  }

  exit(text: string) {
    this.params.closeCallback(text);
  }
}