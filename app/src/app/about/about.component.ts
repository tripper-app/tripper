import { Component, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page';
import { LanguageService } from '../common/services/language-service';
import { Utils } from '@nativescript/core';

@Component({
    selector: 'ns-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
    constructor(private page: Page,
        private languageService: LanguageService) {
    }

    ngOnInit(): void {
        this.page.actionBarHidden = true;

    }

    alignVertical(label) {
        label.android.setGravity(17)
    }
 
    openWebsite() {
        Utils.openUrl("https://www.facebook.com/%D7%9E%D7%A2%D7%99%D7%99%D7%A0%D7%95%D7%AA-%D7%91%D7%90%D7%A8%D7%A5-233757178240/");
    }
}
