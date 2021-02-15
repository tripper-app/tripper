import { Injectable } from '@angular/core';
import { TNSFancyAlert, TNSFancyAlertButton } from "nativescript-fancyalert";
import { SweetAlert } from 'nativescript-sweet-alert';
import { ShowSuccess , ShowError, ShowText } from 'nativescript-sweet-alert/classes';
import localize from 'nativescript-localize';

@Injectable({
    providedIn: 'root'
})
export class AlertService {

    constructor() {
    }

    showError(txt: string){
        const options: ShowError = {
            contentText: txt,
            text: "",
            cancelButtonText: localize("labels.OK")
        }
        SweetAlert.showError(options).then(value => {
         // result: true, false, CLOSED    
        });

        // TNSFancyAlert.showError(" ", txt, localize("label.OK") );
        // TNSFancyAlert.showCustomImage("res://icon", "#B3714F", "check check")
        // alert(txt);
    }

    showInfo(txt: string){
        const options: ShowText = {
            text: txt,
            cancelButtonText: localize("labels.OK")
        }
        SweetAlert.showText(options).then(value => {
         // result: true, false, CLOSED    
        });
    }
}
