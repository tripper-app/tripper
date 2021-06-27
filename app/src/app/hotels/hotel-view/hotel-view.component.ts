import { Component, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page';
import { LanguageService } from '../../common/services/language-service';
import { AlertService } from '../../common/services/alert-service';
import { ActivatedRoute, Route, Router } from "@angular/router";
import { HotelsService } from '~/app/common/services/hotels-service';
import { FullHotel } from '~/app/common/models/fullHotel';
import { SpringsService } from '~/app/common/services/springs-service';
import { ErrorsService } from '~/app/common/services/errors-service';
import { Utils } from '@nativescript/core';
import { dial } from "nativescript-phone";

@Component({
    selector: 'ns-hotel-view',
    templateUrl: './hotel-view.component.html',
    styleUrls: ['./hotel-view.component.scss']
})
export class HotelViewComponent implements OnInit {
    rightToLeft = true;
    waitingForResponse = false;
    currentHotel: FullHotel;

    constructor(private page: Page,
        private router: Router,
        private hotelsService: HotelsService,
        private languageService: LanguageService,
        private alertService: AlertService,
        private springService: SpringsService,
        private errorService: ErrorsService,
         private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.rightToLeft = this.languageService.getRightToLeft();
        this.page.actionBarHidden = true;

        this.getHotel();
    }

    backToList() {
        this.router.navigate(["mainTabs/", 2]);
    }

    getHotel() {
        this.waitingForResponse = true;
        this.hotelsService.getHotel('הכפר האינדיאני').subscribe((hotel: FullHotel) => {
            // this.hotelsService.getHotel(this.route.snapshot.params.hotelId).subscribe((hotel: FullHotel) => {
            this.waitingForResponse = false;
            this.currentHotel = hotel;

        }, err => {
            this.waitingForResponse = false;
            this.handleErrors(err);
        })
    }

    openMap() {
        this.springService.filterByHotel = true;

        this.springService.singleHotel = { id: this.currentHotel.ID, location: { latitude: this.currentHotel.location._latitude, longitude: this.currentHotel.location._longitude } };
        this.springService.loadMap = true;
        this.router.navigate(['mainTabs', 3]);
    }

    reserve(){
        if (this.currentHotel.websiteLink) {
            this.openWebsite();
        } else{
            this.openDialer();
        }
    }

    openWebsite() {
        Utils.openUrl(this.currentHotel.websiteLink);
    }

    openDialer(){
        if (this.currentHotel.phone) {
            dial(this.currentHotel.phone, true);
        }
    }

    handleErrors(error) {
        this.errorService.handleErorr(error);
    }
}
