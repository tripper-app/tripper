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
    rightToLeft = true;
    constructor(private page: Page,
        private languageService: LanguageService) {
    }

    ngOnInit(): void {
        this.rightToLeft = this.languageService.getRightToLeft();
        this.page.actionBarHidden = true;

    }

    alignVertical(label) {
        label.android.setGravity(17)
    }
 
    openWebsite() {
        Utils.openUrl("");
    }
}
