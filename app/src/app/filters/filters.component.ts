import { Component, OnInit, ViewChild } from '@angular/core';
import { SpringFilters } from '../common/models/springFilters';
import { SpringsService } from '../common/services/springs-service';
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { getRootView } from "tns-core-modules/application";
import { LanguageService } from '../common/services/language-service';

@Component({
    selector: 'ns-filters',
    templateUrl: './filters.component.html',
    styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {
    @ViewChild('campingSwitch', { static: false }) campingSwitch;
    @ViewChild('childrenSwitch', { static: false }) childrenSwitch;
    @ViewChild('waterSwitch', { static: false }) waterSwitch;
    @ViewChild('carSwitch', { static: false }) carSwitch;
    @ViewChild('depth', { static: false }) depthSwitch;
    sliderValue = 25;
    languageRightToLeft;

    constructor(private springsService: SpringsService, private languageService: LanguageService) {
    }

    ngOnInit() {
        this.languageRightToLeft = this.languageService.getRightToLeft();        
    }


    submit() {        
        (<RadSideDrawer>getRootView()).closeDrawer();
        const filters: SpringFilters = new SpringFilters();
        filters.camping = this.campingSwitch.nativeElement.checked;
        filters.car = this.carSwitch.nativeElement.checked;
        filters.children = this.childrenSwitch.nativeElement.checked;
        filters.water = this.waterSwitch.nativeElement.checked;
        filters.depth = this.depthSwitch.nativeElement.checked;
        filters.distance = this.sliderValue > 0 ? this.sliderValue : undefined;
        this.springsService.updateSprings(filters);
    }
}