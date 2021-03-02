import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page';
import { localize } from "nativescript-localize";
import { LanguageService } from '../../common/services/language-service';
import { AlertService } from '../../common/services/alert-service';
import { ActivatedRoute, Router } from "@angular/router";
import { HotelsService } from '~/app/common/services/hotels-service';
import { FullHotel } from '~/app/common/models/fullHotel';
import { SpringsService } from '~/app/common/services/springs-service';

@Component({
    selector: 'ns-hotel-view',
    templateUrl: './hotel-view.component.html',
    styleUrls: ['./hotel-view.component.scss']
})
export class HotelViewComponent implements OnInit {
    rightToLeft = true;
    loading = true;
    currentHotel: FullHotel;

    constructor(private page: Page,
        private router: Router,
        private route: ActivatedRoute,
        private hotelsService: HotelsService,
        private languageService: LanguageService,
        private alertService: AlertService,
        private springService: SpringsService) {
    }

    ngOnInit(): void {
        // console.log(this.route.snapshot.params.hotelId);
        this.rightToLeft = this.languageService.getRightToLeft();
        this.page.actionBarHidden = true;
        
        this.getHotel();
    }

    backToList(){
        this.router.navigate(["mainTabs/", 2]);
    }

    getHotel(){
        this.hotelsService.getHotel("מלון החתולים").subscribe((hotel: FullHotel) => {
            this.loading = false;
            this.currentHotel = hotel;
            
        }, err => {
            this.loading = false;
            this.handleErrors(err);
        })
    }

    openMap(){
        this.springService.filterByHotel = true;
        this.springService.hotelLocation.latitude = this.currentHotel.location._latitude;
        this.springService.hotelLocation.longitude = this.currentHotel.location._longitude;
        this.router.navigate(['map']);
    }

    openWebsite(){

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
