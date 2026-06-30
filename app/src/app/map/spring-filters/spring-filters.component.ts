import { Component, OnInit } from '@angular/core';
import { Page } from '@nativescript/core';
import { SpringsService } from '../../common/services/springs-service';
import { LanguageService } from '../../common/services/language-service';
import { RouterExtensions } from '@nativescript/angular';
import { SpringFilters } from '~/app/common/models/springFilters';

@Component({ standalone: false,
    selector: 'ns-spring-filters',
    templateUrl: './spring-filters.component.html',
    styleUrls: ['./spring-filters.component.scss']
})
export class SpringsFiltersComponent implements OnInit {
    defaultDistance = 40;
    campingCheck = false;
    childrenCheck = false;
    waterCheck = false;
    carCheck = false;
    depthCheck = false;
    sliderValue = 0;
    mainColor = "rgb(35, 204, 153)";
    greyColor = "rgb(225, 225, 225)";
    scale = "1.3";

    constructor(public page: Page,
        public routerExtensions: RouterExtensions,
        public springsService: SpringsService,
        public languageService: LanguageService) {
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
        filters.distance = this.sliderValue > 0 ? this.sliderValue : this.defaultDistance;

        this.springsService.filters = filters;
        this.navigateToMap();
    }

    alignVertical(label: any) {
        label.android.setGravity(17)
    }

    navigateToMap() {
        // Go back to the existing (still-mounted) map rather than navigating
        // forward to a new tabs page, which would create a second MapView that
        // renders white. The map re-fetches with the new filters when it becomes
        // visible again (its page navigatedTo), so the loading gif shows on the
        // already-visible map instead of while it is still behind this page.
        this.springsService.filtersChanged = true;
        this.routerExtensions.back();
    }
}
