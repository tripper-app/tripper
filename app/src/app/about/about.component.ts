import { Component, OnInit } from '@angular/core';
import { Page } from '@nativescript/core';
import { RouterExtensions } from '@nativescript/angular';
import { LanguageService } from '../common/services/language-service';
import { Utils } from '@nativescript/core';

@Component({ standalone: false,
    selector: 'ns-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
    constructor(public page: Page,
        public routerExtensions: RouterExtensions,
        public languageService: LanguageService) {
    }

    ngOnInit(): void {
        this.page.actionBarHidden = true;

    }

    goBack() {
        this.routerExtensions.back();
    }

    alignVertical(label) {
        label.android.setGravity(17)
    }
 
    openWebsite() {
        Utils.openUrl("https://www.facebook.com/%D7%9E%D7%A2%D7%99%D7%99%D7%A0%D7%95%D7%AA-%D7%91%D7%90%D7%A8%D7%A5-233757178240/");
    }
}
