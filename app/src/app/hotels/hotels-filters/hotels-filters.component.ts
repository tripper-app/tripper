import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page';
import { SpringsService } from '../../common/services/springs-service';
import { localize } from "nativescript-localize";
import { LanguageService } from '../../common/services/language-service';
import { AlertService } from '../../common/services/alert-service';
import { Router } from "@angular/router";
import { SpringFilters } from '~/app/common/models/springFilters';

@Component({
    selector: 'ns-hotels-filters',
    templateUrl: './hotels-filters.component.html',
    styleUrls: ['./hotels-filters.component.scss']
})
export class HotelsFiltersComponent implements OnInit {
    @ViewChild('aresStack', { static: false }) aresStack: ElementRef;
    @ViewChild('expandImage', { static: false }) expandImage: ElementRef;
    campingCheck = false;
    childrenCheck = false;
    waterCheck = false;
    carCheck = false;
    depthCheck = false;
    sliderValue = 25;
    mainColor = "rgb(146, 226, 131)";
    scale = "1.3";
    leftToRight = false;
    areas = ["שרון", "מרכז", "שומרון", "גולן", "אילת", "גליל", "נגב", "שומרון", "בנימין", "טלמון", "ירושלים"]
    areasBoolean: boolean[] = [];
    selectedAreas = [];
    areaLineHeight = 30;
    animationTime = 150;
    areasExpanded = false;
    minPrice = 0;
    maxPrice = 5001;
    finalMinPrice;
    finalMaxPrice;

    constructor(private page: Page,
        private router: Router,
        private springsService: SpringsService,
        private languageService: LanguageService,
        private alertService: AlertService) {
    }

    ngOnInit(): void {
        this.leftToRight = !this.languageService.getRightToLeft();
        this.page.actionBarHidden = true;
        this.campingCheck = this.springsService.filters.camping;
        this.childrenCheck = this.springsService.filters.children;
        this.waterCheck = this.springsService.filters.water;
        this.carCheck = this.springsService.filters.car;
        this.depthCheck = this.springsService.filters.depth;
        this.sliderValue = this.springsService.filters.distance;
    }

    getAreasString() {
        return this.selectedAreas.length ? this.selectedAreas.reduce((a, b) => a + ', ' + b) : "";
    }

    search() {
        // const filters: SpringFilters = new SpringFilters();

        // this.springsService.filters = filters;
        //this.navigateToMap();
    }

    rangeSeekBarChanged(event) {
        this.finalMinPrice = event.value.minPrice;
        this.finalMaxPrice = event.value.maxPrice;
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
        console.log(this.languageService.getCurrentLanguage());


        // this.router.navigate(["mainTabs/", 3]);
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
