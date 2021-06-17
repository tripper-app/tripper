import { Component } from '@angular/core';
import { ModalDialogParams } from "nativescript-angular/modal-dialog";



@Component({
    selector: 'ns-change-language',
    templateUrl: './change-language.component.html',
    styleUrls: ['./change-language.component.scss']
})

export class ChangeLanguageModalComponent {
    constructor(private params: ModalDialogParams){}
}