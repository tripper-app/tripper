import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { ModalDialogOptions, ModalDialogService } from "@nativescript/angular/modal-dialog";
import { Page } from "@nativescript/core";
import { StartModalComponent } from "./startModal/startModal.component";

@Component({
    selector: 'ns-landKing',
    templateUrl: './landKing.component.html',
    styleUrls: ['./landKing.component.scss']
})
export class LandKingComponent implements OnInit{

    constructor(private page: Page,
        private modalService: ModalDialogService,
        private viewContainerRef: ViewContainerRef){
        this.page.actionBarHidden = true;
    }
    ngOnInit() {
        this.openModal();
    }

    openModal(){
        const options: ModalDialogOptions = {
            viewContainerRef: this.viewContainerRef,
            fullscreen: false
        };
        this.modalService.showModal(StartModalComponent, options).then(ok => {            
            if (ok) {
                //ok
            } else{
                //exit
            }
        });
    }

    navigateToGame(){
        
    }
}