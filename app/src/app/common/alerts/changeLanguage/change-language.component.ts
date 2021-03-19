import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from "nativescript-angular/modal-dialog";



@Component({
    selector: 'ns-change-language',
    templateUrl: './change-language.component.html',
    styleUrls: ['./change-language.component.scss']
})

export class ChangeLanguageModalComponent implements OnInit {
    constructor(private params: ModalDialogParams){}


    ngOnInit(): void {
        // setTimeout(() => {
        //     // this.exit();
        // }, 3000);
    }
}