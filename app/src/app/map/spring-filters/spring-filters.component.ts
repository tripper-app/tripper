import { Component, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page';
import { SpringsService } from '../../common/services/springs-service';
import { LanguageService } from '../../common/services/language-service';
import { AlertService } from '../../common/services/alert-service';
import { Router } from "@angular/router";
import { SpringFilters } from '~/app/common/models/springFilters';

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
    sliderValue = 0;
    mainColor = "rgb(35, 204, 153)";
    scale = "1.3";

    constructor(private page: Page,
        private router: Router,
        private springsService: SpringsService,
        private languageService: LanguageService) {
    }

    ngOnInit(): void {        
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

    alignVertical(label) {
        label.android.setGravity(17)
    }

    navigateToMap() {
        this.router.navigate(["mainTabs/", 3]);
    }
}
