import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page';
import { SpringsService } from '../../common/services/springs-service';
import { localize } from "nativescript-localize";
import { LanguageService } from '../../common/services/language-service';
import * as application from "tns-core-modules/application";
import { AlertService } from '../../common/services/alert-service';
import { Router } from "@angular/router";
import { SpringFilters } from '~/app/common/models/springFilters';
import {  device } from "tns-core-modules/platform";

@Component({
    selector: 'ns-spring-filters',
    templateUrl: './spring-filters.component.html',
    styleUrls: ['./spring-filters.component.scss']
})
export class SpringsFiltersComponent implements OnInit {
    campingCheck = false;
    childrenCheck = false;
    waterCheck = false;
    carCheck = false;
    depthCheck = false;
    sliderValue = 25;
    mainColor = "rgb(35, 204, 153)";
    scale = "1.3";
    leftToRight = false;

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

    search() {
        const filters: SpringFilters = new SpringFilters();
        filters.camping = this.campingCheck;
        filters.car = this.carCheck;
        filters.children = this.childrenCheck;
        filters.water = this.waterCheck;
        filters.depth = this.depthCheck;
        filters.distance = this.sliderValue > 0 ? this.sliderValue : undefined;

        this.springsService.filters = filters;
        this.navigateToMap();
    }

    navigateToMap() {
        this.router.navigate(["mainTabs/", 3]);
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
