import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page';
import { LanguageService } from '../../common/services/language-service';
import { AlertService } from '../../common/services/alert-service';
import { Router } from "@angular/router";
import { HotelsService } from '~/app/common/services/hotels-service';
import { FlatHotel } from '~/app/common/models/flatHotel';
import { ErrorsService } from '~/app/common/services/errors-service';

@Component({
    selector: 'ns-hotels-list',
    templateUrl: './hotels-list.component.html',
    styleUrls: ['./hotels-list.component.scss']
})
export class HotelsListComponent implements OnInit {
    @Output() showTabs: EventEmitter<any> = new EventEmitter();
    @Output() hideTabs: EventEmitter<any> = new EventEmitter();
    hotelsList: FlatHotel[];
    waitingForResponse = false;
    constructor(private page: Page,
        private router: Router,
        private hotelsService: HotelsService,
        private languageService: LanguageService,
        private alertService: AlertService,
        private errorService: ErrorsService) {
    }

    ngOnInit(): void {
        this.page.actionBarHidden = true;
        if (this.hotelsService.filteredHotels) {
            this.hotelsList = this.hotelsService.filteredHotels;
        }
    }

    hideTheFilters() {
        this.hotelsService.showList = true;
        this.getHotels();
        this.showTabs.emit();
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
        }, err => {
            this.errorService.handleErorr(err);
        })
    }

    navigateToHotel(hotel) {
        this.router.navigate(["hotelView", hotel]);
    }

    navigateToFilters() {
        this.hideTabs.emit();
        this.hotelsService.showList = false;
    }

    alignVertical(label) {
        label.android.setGravity(17)
    }
}
