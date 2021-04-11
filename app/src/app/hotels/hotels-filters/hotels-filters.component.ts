import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page';
import { SpringsService } from '../../common/services/springs-service';
import { localize } from "nativescript-localize";
import { LanguageService } from '../../common/services/language-service';
import { AlertService } from '../../common/services/alert-service';
import { Router } from "@angular/router";
import { HotelFilters } from '~/app/common/models/hotelFilters';
import { HotelsService } from '~/app/common/services/hotels-service';
import { ErrorsService } from '~/app/common/services/errors-service';

@Component({
    selector: 'ns-hotels-filters',
    templateUrl: './hotels-filters.component.html',
    styleUrls: ['./hotels-filters.component.scss']
})
export class HotelsFiltersComponent implements OnInit {
    @ViewChild('aresStack', { static: false }) aresStack: ElementRef;
    @ViewChild('expandImage', { static: false }) expandImage: ElementRef;
    @Output() hideFilters: EventEmitter<any> = new EventEmitter();
    poolCheck = false;
    breakfastCheck = false;
    mainColor = "rgb(35, 204, 153)";
    scale = "1.3";
    leftToRight = false;
    areas = localize('hotelsFilters.areasList').split(', ');
    // areas = ["שרון", "מרכז", "שומרון", "גולן", "אילת", "גליל", "נגב", "שומרון", "בנימין", "טלמון", "ירושלים"]
    areasBoolean: boolean[] = [];
    selectedAreas = [];
    areaLineHeight = 30;
    animationTime = 150;
    areasExpanded = false;
    minPrice = 0;
    maxPrice = 5001;
    finalMinPrice = 10;
    finalMaxPrice = 2000;

    constructor(private page: Page,
        private router: Router,
        private hotelsService: HotelsService,
        private languageService: LanguageService,
        private alertService: AlertService,
        private errorService: ErrorsService) {
    }

    ngOnInit(): void {
        this.leftToRight = !this.languageService.getRightToLeft();
        this.page.actionBarHidden = true;
    }

    getAreasString() {
        return this.selectedAreas.length ? this.selectedAreas.reduce((a, b) => a + ', ' + b) : "";
    }

    search() {
        const filters: HotelFilters = new HotelFilters();
        filters.breakfast = this.breakfastCheck;
        filters.maxPrice = this.finalMaxPrice;
        filters.minPrice = this.finalMinPrice;
        filters.pool = this.poolCheck;
        filters.region = this.selectedAreas;
        this.hotelsService.setFilters(filters);
        this.navigateToFiltersView();
    }

    rangeSeekBarChanged(event) {
        this.finalMinPrice = event.value.minValue;
        this.finalMaxPrice = event.value.maxValue;
    }

    expandAreas() {
        this.expandImage.nativeElement.animate({ scale: { x: 1, y: 0 }, duration: this.animationTime / 2 }).then(() => {
            this.expandImage.nativeElement.rotate = this.areasExpanded ? 180 : 0;
        }).then(() => {
            this.expandImage.nativeElement.animate({ scale: { x: 1, y: 1 }, duration: this.animationTime / 2 })
        });

        if (this.areasExpanded) {
            this.aresStack.nativeElement.animate({ height: 0, duration: this.animationTime, curve: 'easeOut' })
        } else {
            this.aresStack.nativeElement.animate({ height: this.areaLineHeight * this.areas.length, duration: this.animationTime, curve: 'easeOut' })
        }
        this.areasExpanded = !this.areasExpanded;
    }

    checkChange(area: string, checked: boolean) {
        if (checked) {
            this.selectedAreas.push(area);
        } else {
            this.selectedAreas.splice(this.selectedAreas.indexOf(area), 1);
        }
    }

    navigateToFiltersView() {
        this.hideFilters.emit();
    }

    // handleErrors(error) {
    //     this.errorService.handleErorr(error);
    // }
}
