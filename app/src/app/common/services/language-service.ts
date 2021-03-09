import { device, isAndroid } from '@nativescript/core/platform';
import { Injectable } from '@angular/core';
import { overrideLocale } from "nativescript-localize/localize";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { localize } from "nativescript-localize";
import { getString } from '@nativescript/core/application-settings';
import {exit} from 'nativescript-exit';


@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    rightToLefts = ['iw'];
    languages = [{id: 'iw', lan: 'hebrew'}, {id: 'en', lan: 'english'}]

    constructor() {
        if (!getString("__app__language__")) {
            overrideLocale('iw');
        }
    }

    getCurrentLanguage() {  
        return getString("__app__language__");
    }

    getRightToLeft(){
        return this.rightToLefts.some(l => l == this.getCurrentLanguage());
    }

    switchLanguage(lan) {
        overrideLocale(lan);
        setTimeout(() => {
            
            exit();
        }, 2000);
        // dialogs.alert({
        //     title: localize(`switchLanguage.switchLanguageTitle.${lan}`),
        //     message: localize(`switchLanguage.switchLanguageMessage.${lan}`),
        //     okButtonText: localize(`switchLanguage.closeApp.${lan}`)
        // })
    }

    getLanguages(){
        return this.languages;
    }
}
