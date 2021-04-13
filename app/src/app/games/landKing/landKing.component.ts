import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { Router } from "@angular/router";
import { ModalDialogOptions, ModalDialogService } from "@nativescript/angular/modal-dialog";
import { Page } from "@nativescript/core";
import { LanguageService } from "~/app/common/services/language-service";
import { StartModalComponent } from "./startModal/startModal.component";

@Component({
    selector: 'ns-landKing',
    templateUrl: './landKing.component.html',
    styleUrls: ['./landKing.component.scss']
})
export class LandKingComponent implements OnInit {
    timer = 180000;
    rightToLeft = true;
    constructor(private page: Page,
        private modalService: ModalDialogService,
        private viewContainerRef: ViewContainerRef,
        private router: Router,
        private languageService: LanguageService) {
        this.page.actionBarHidden = true;
    }
    ngOnInit() {
        this.rightToLeft = this.languageService.getRightToLeft();
        this.openModal();
    }

    openModal() {
        const options: ModalDialogOptions = {
            viewContainerRef: this.viewContainerRef,
            fullscreen: false
        };
        this.modalService.showModal(StartModalComponent, options).then(ok => {
            console.log(ok);

            if (ok) {
                setInterval(() => {
                    this.timer -= 1000;
                    if (this.timer <= 0){
                        this.exit();
                    }
                }, 1000)
            } else {
                setTimeout(() => {
                    this.router.navigate(['mainTabs', 1]);
                }, 0);
            }
        });
    }

    exit(){

    }
}