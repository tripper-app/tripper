import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page';
import { localize } from "nativescript-localize";
import { LanguageService } from '../../common/services/language-service';
import { AlertService } from '../../common/services/alert-service';
import { ActivatedRoute, Router } from "@angular/router";
import { HotelsService } from '~/app/common/services/hotels-service';
import { FlatHotel } from '~/app/common/models/flatHotel';
import { FullHotel } from '~/app/common/models/fullHotel';

@Component({
    selector: 'ns-hotel-view',
    templateUrl: './hotel-view.component.html',
    styleUrls: ['./hotel-view.component.scss']
})
export class HotelViewComponent implements OnInit {
    rightToLeft = true;
    loading = true;
    currentHotel;

    constructor(private page: Page,
        private router: Router,
        private route: ActivatedRoute,
        private hotelsService: HotelsService,
        private languageService: LanguageService,
        private alertService: AlertService) {
    }

    ngOnInit(): void {
        // console.log(this.route.snapshot.params.hotelId);
        this.rightToLeft = !this.languageService.getRightToLeft();
        this.page.actionBarHidden = true;
        
        this.getHotel();
    }

    getHotel(){
        this.hotelsService.getHotel("מלון החתולים").subscribe((hotel: FullHotel) => {
            this.loading = false;
            this.currentHotel = hotel;
        }, err => {
            this.loading = false;
            this.handleErrors(err);
        })
        const h1: FullHotel = new FullHotel();

        h1.city = "רמת השרון";
        h1.images = ["https://www.humanesociety.org/sites/default/files/styles/1240x698/public/2018/08/kitten-440379.jpg?h=c8d00152&itok=1fdekAh2", "https://img.webmd.com/dtmcms/live/webmd/consumer_assets/site_images/article_thumbnails/other/cat_relaxing_on_patio_other/1800x1200_cat_relaxing_on_patio_other.jpg", "https://static.toiimg.com/photo/msid-67586673/67586673.jpg?3918697"];
        h1.name = "מלון החתולים";
        h1.price = 100;
        h1.attractions = [""]
    }


    alignVertical(label) {
        label.android.setGravity(17)
    }

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
