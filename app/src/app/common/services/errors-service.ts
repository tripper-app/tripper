import { Injectable } from '@angular/core';
import localize from 'nativescript-localize';
import { AlertService } from './alert-service';

@Injectable({
    providedIn: 'root'
})
export class ErrorsService {

    constructor(private alertService: AlertService) {
    }

    handleErorr(error) {
        console.log(error);
        switch (error.status) {
            case 0:
                this.alertService.showError(localize('messages.error.connectionError'));
                break;
            case 299:
                this.alertService.showInfo(localize('messages.info.pleaseUpdate'));
                break;
            case 500:
                this.alertService.showError(localize("messages.error.serverError"));
                break;
            default:
                this.alertService.showError(localize("messages.error.unknownError"));
                break;
        }
    }
}
