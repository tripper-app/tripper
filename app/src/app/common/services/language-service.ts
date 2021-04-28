import { Injectable, ViewContainerRef } from '@angular/core';
import { overrideLocale } from "nativescript-localize/localize";
import { getString } from '@nativescript/core/application-settings';
import { exit } from 'nativescript-exit';


@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    rightToLefts = ['iw'];
    languages = [{ id: 'iw', lan: 'hebrew' }, { id: 'en', lan: 'english' }]

    constructor() {
        if (!getString("__app__language__")) {
            overrideLocale('iw');
        }
    }

    getCurrentLanguage() {
        return getString("__app__language__");
    }

    getRightToLeft() {
        return this.rightToLefts.some(l => l == this.getCurrentLanguage());
    }

    switchLanguage(lan) {
        overrideLocale(lan);
        setTimeout(() => {
            exit();
        }, 3000);
    }

    getLanguages() {
        return this.languages;
    }
}
