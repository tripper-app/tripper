import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page';
import { SpringsService } from '../../common/services/springs-service';
import { localize } from "nativescript-localize";
import { LanguageService } from '../../common/services/language-service';
import { AlertService } from '../../common/services/alert-service';
import { Router } from "@angular/router";
import { HotelFilters } from '~/app/common/models/hotelFilters';
import { HotelsService } from '~/app/common/services/hotels-service';
import { FlatHotel } from '~/app/common/models/flatHotel';

@Component({
    selector: 'ns-hotels-list',
    templateUrl: './hotels-list.component.html',
    styleUrls: ['./hotels-list.component.scss']
})
export class HotelsListComponent implements OnInit {
    @Output() showTabs: EventEmitter<any> = new EventEmitter();
    @Output() hideTabs: EventEmitter<any> = new EventEmitter();
    private rightToLeft = true;
    hotelsList: FlatHotel[];

    constructor(private page: Page,
        private router: Router,
        private hotelsService: HotelsService,
        private languageService: LanguageService,
        private alertService: AlertService) {
        // this.checkFilters();
    }

    ngOnInit(): void {
        this.hotelsList = [];
        this.rightToLeft = this.languageService.getRightToLeft();
        this.page.actionBarHidden = true;
        this.getHotels();
    }

    hideTheFilters(){        
        this.hotelsService.showList = true;
        this.showTabs.emit();
    }


    getHotels() {
        // this.hotelsService.getHotels().subscribe(hotels => {
        //     console.log(hotels)
        // })
        const h1: FlatHotel = new FlatHotel();
        const h2: FlatHotel = new FlatHotel();
        const h3: FlatHotel = new FlatHotel();

        h1.city = "רמת השרון";
        h2.city = "טלמון";
        h3.city = "מבוא דותן";
        h1.images = ["https://www.humanesociety.org/sites/default/files/styles/1240x698/public/2018/08/kitten-440379.jpg?h=c8d00152&itok=1fdekAh2", "https://img.webmd.com/dtmcms/live/webmd/consumer_assets/site_images/article_thumbnails/other/cat_relaxing_on_patio_other/1800x1200_cat_relaxing_on_patio_other.jpg", "https://static.toiimg.com/photo/msid-67586673/67586673.jpg?3918697"];
        h2.images = ["https://i.ytimg.com/vi/uHKfrz65KSU/maxresdefault.jpg", "https://scitechdaily.com/images/Cat-COVID-19-Mask.jpg"];
        h3.images = ["https://cdn.mos.cms.futurecdn.net/VSy6kJDNq2pSXsCzb6cvYF.jpg"];
        h1.name = "מלון החתולים";
        h2.name = "צימר בשטחים";
        h3.name = "מלונית קורונה";
        h1.price = 100;
        h2.price = 800;
        h3.price = 750;
        h1.id = "מלון החתולים";
        this.hotelsList.push(h1, h2, h3);
    }

    navigateToHotel(hotel) {
        this.router.navigate(["hotelView", hotel]);
    }

    navigateToFilters() {
        this.hideTabs.emit();
        this.hotelsService.showList = false;
        // this.router.navigate(["hotelsFilters"]);
    }

    navigateToFiltersView() {
        console.log(this.languageService.getCurrentLanguage());


        // this.router.navigate(["mainTabs/", 3]);
    }

    alignVertical(label) {
        label.android.setGravity(17)
    }

    // checkFilters() {
    //     if (this.hotelsService.cameFromFilters) {
    //         this.hotelsService.cameFromFilters = false;
    //     } else {
    //         this.navigateToFilters();
    //     }
    // }

    handleErrors(error) {
        console.log(error);
        switch (error.status) {
            case 0:
                this.alertService.showError(localize('messages.error.connectionError'));
                break;
            case 500:
                this.alertService.showError(localize("messages.error.serverError"));
            default:
                // alert default message
                break;
        }
    }
}
