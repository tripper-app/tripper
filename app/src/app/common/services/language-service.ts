import { Injectable } from '@angular/core';
import { getString, setString } from '@nativescript/core/application-settings';
import { exit } from 'nativescript-exit';
import { OdedI18NPipe } from '../pipes/i18nPipe';
const englishDictionary = require('../../../i18n/en.json')
const hebrewDictionary = require('../../../i18n/iw.default.json')

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    languageString = "app_language";
    rightToLefts = ['iw'];
    languages = [{ id: 'iw', lan: 'hebrew' }, { id: 'en', lan: 'english' }]
    dictionaries = [{ name: "en", dictionary: englishDictionary }, { name: "iw", dictionary: hebrewDictionary }];
    dict;
    dummyUpdate = 0;
    rightToLeft = true;
    currentLanguage = "iw";
    constructor() {
        if (!getString(this.languageString)) {
            // overrideLocale('iw');
            setString(this.languageString, "iw");
        }
        this.currentLanguage = getString("app_language");
        this.rightToLeft = this.rightToLefts.some(l => l == this.getCurrentLanguage());
        this.dict = this.dictionaries.find(d => d.name == getString(this.languageString)).dictionary;
    }

    getCurrentLanguage() {
        return getString(this.languageString);
        // return this.currentLanguage;
    }

    getRightToLeft() {
        return this.rightToLeft;

    }

    switchLanguage(lan) {
        setString(this.languageString, lan);
        this.dict = this.dictionaries.find(d => d.name == getString("app_language")).dictionary;
        this.dummyUpdate++;
        this.rightToLeft = this.rightToLefts.some(l => l == this.getCurrentLanguage());
        this.currentLanguage = lan;
        // overrideLocale(lan);
        // setTimeout(() => {
        //     exit();
        // }, 3000);
    }

    getLanguages() {
        return this.languages;
    }

    getText(word: string) {
        const path = word.split('.');
        let result = this.dict;
        for (let index = 0; index < path.length; index++) {
            result = result[path[index]];
        }
        return result;
        //return this.odedi18n.transform(word);
    }
}
