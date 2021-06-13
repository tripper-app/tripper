import { Injectable } from '@angular/core';
import { AlertService } from './alert-service';
import { LanguageService } from './language-service';

@Injectable({
    providedIn: 'root'
})
export class ErrorsService {

    constructor(private alertService: AlertService,
        private languageService: LanguageService) {
    }

    handleErorr(error) {
        console.log(error);
        switch (error.status) {
            case 0:
                this.alertService.showError(this.languageService.getText('messages.error.connectionError'));
                break;
            case 299:
                this.alertService.showInfo(this.languageService.getText('messages.info.pleaseUpdate'));
                break;
            case 500:
                this.alertService.showError(this.languageService.getText("messages.error.serverError"));
                break;
            default:
                this.alertService.showError(this.languageService.getText("messages.error.unknownError"));
                break;
        }
    }
}
