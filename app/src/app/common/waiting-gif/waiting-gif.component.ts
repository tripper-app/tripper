import { Component, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page';

@Component({
    selector: 'ns-waiting-gif',
    templateUrl: './waiting-gif.component.html',
    styleUrls: ['./waiting-gif.component.css']
})
export class WaitingGifComponent implements OnInit {
    constructor(private page: Page) {
    }

    ngOnInit(): void {
        //this.page.actionBarHidden = true;
    }
}
