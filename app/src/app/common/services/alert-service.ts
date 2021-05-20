import { Injectable } from '@angular/core';
import { SweetAlert } from 'nativescript-sweet-alert';
import { ShowSuccess, ShowError, ShowText, ShowNormal } from 'nativescript-sweet-alert/classes';
import { LanguageService } from './language-service';

@Injectable({
    providedIn: 'root'
})
export class AlertService {

    constructor(private languageService: LanguageService) {
    }

    showError(txt: string) {
        const options: ShowError = {
            contentText: txt,
            text: "",
            cancelButtonText: this.languageService.getText("labels.OK")
        }
        SweetAlert.showError(options).then(value => {
            // result: true, false, CLOSED    
        });
    }

    showInfo(txt: string) {
        const options: ShowNormal = {
            text: txt,
            contentText: '',
            cancelButtonText: this.languageService.getText("labels.OK")
        }
        SweetAlert.showNormal(options).then(value => {
            // result: true, false, CLOSED    
        });
    }

    showSuccess(txt: string) {
        const options: ShowSuccess = {
            text: txt,
            contentText: '',
            cancelButtonText: this.languageService.getText("labels.OK")
        }

        SweetAlert.showSuccess(options).then(value => {
            // result: true, false, CLOSED    
        });
    }
}
