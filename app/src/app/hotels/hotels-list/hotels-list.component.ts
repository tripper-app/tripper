import { ChangeDetectorRef, Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Page } from '@nativescript/core';
import { LanguageService } from '../../common/services/language-service';
import { AlertService } from '../../common/services/alert-service';
import { Router } from "@angular/router";
import { HotelsService } from '~/app/common/services/hotels-service';
import { FlatHotel } from '~/app/common/models/flatHotel';
import { ErrorsService } from '~/app/common/services/errors-service';
import { Screen as screen } from "@nativescript/core";

@Component({ standalone: false,
    selector: 'ns-hotels-list',
    templateUrl: './hotels-list.component.html',
    styleUrls: ['./hotels-list.component.scss']
})
export class HotelsListComponent implements OnInit {
    @Output() goToFilters: EventEmitter<any> = new EventEmitter();
    hotelsList: FlatHotel[];
    waitingForResponse = false;
    imageHeight = ((screen.mainScreen.widthDIPs-27)/2)*(2/3);

    constructor(public page: Page,
        public router: Router,
        public hotelsService: HotelsService,
        public languageService: LanguageService,
        public alertService: AlertService,
        public errorService: ErrorsService,
        public cd: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this.page.actionBarHidden = true;
        if (this.hotelsService.filteredHotels) {
            this.hotelsList = this.hotelsService.filteredHotels;
        }
    }

    getHotels() {
        this.hotelsList = [];
        this.waitingForResponse = true;
        this.hotelsService.getHotels().subscribe(res => {
            this.waitingForResponse = false;
            this.hotelsList = res;

            if (!(res && res.length)) {
                this.alertService.showError(this.languageService.getText("messages.error.hotelNotFound"));
            }
            // HTTP response fires off Angular's zone -> force CD so the list renders
            // and the spinner clears.
            this.cd.detectChanges();
        }, err => {
            this.waitingForResponse = false;
            this.errorService.handleErorr(err);
            this.cd.detectChanges();
        })
    }

    navigateToHotel(hotel) {        
        this.router.navigate(["hotelView", hotel]);
    }

    navigateToFilters() {
        this.goToFilters.emit();
    }

    alignVertical(label) {
        label.android.setGravity(17)
    }
}
