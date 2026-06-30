import { Component } from '@angular/core';
import { ModalDialogParams } from '@nativescript/angular';



@Component({ standalone: false,
    selector: 'ns-change-language',
    templateUrl: './change-language.component.html',
    styleUrls: ['./change-language.component.scss']
})

export class ChangeLanguageModalComponent {
    constructor(public params: ModalDialogParams){}
}