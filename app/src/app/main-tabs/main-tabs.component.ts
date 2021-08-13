import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import { Page } from 'tns-core-modules/ui/page';
import { LanguageService } from '../common/services/language-service';
import { ActivatedRoute } from "@angular/router";
import { getString, setString } from '@nativescript/core/application-settings';

import { HttpService } from '../common/services/http-service';
import { HotelsService } from '../common/services/hotels-service';
import { UserService } from '../common/services/userService';
import { NotificationsModalComponent } from './notificationsModal/notificationsModal.component';
import { ErrorsService } from '../common/services/errors-service';
import { HotelsListComponent } from '../hotels/hotels-list/hotels-list.component';
import { ProfileComponent } from '../profile/profile.component';

declare let android: any; // or use tns-platform-declarations
declare let java: any;

@Component({
    selector: 'ns-mainTabs',
    templateUrl: './main-tabs.component.html',
    styleUrls: ['./main-tabs.component.scss']
})
export class MainTabsComponent implements OnInit {
    @ViewChild(HotelsListComponent, { static: false }) hotelsList;
    @ViewChild(ProfileComponent, { static: false }) profile;
    @ViewChild('tabs', { static: true }) tabs;
    selectedPageIndex = 0;
    currentIndex;
    tabsVisibility = true;
    constructor(private route: ActivatedRoute,
        private page: Page,
        private viewContainerRef: ViewContainerRef,
        private modalService: ModalDialogService,
        private languageService: LanguageService,
        private httpService: HttpService,
        private errorService: ErrorsService,
        private hotelService: HotelsService,
        private userService: UserService) {
    }

    ngOnInit() {
        //this.checkNotifications();
        this.languageService.getCurrentLanguage();
        this.page.actionBarHidden = true;
        if (this.route.snapshot.params.page) {
            this.selectedPageIndex = this.route.snapshot.params.page;
        }
    }

    navigateToMap() {
        this.tabs.nativeElement.selectedIndex = 3
        this.isFirstTime();
    }


    isFirstTime() {
        setTimeout(() => {
            if (!getString('firstTime')) {
                const options: ModalDialogOptions = {
                    viewContainerRef: this.viewContainerRef,
                    fullscreen: false,
                    context: { text: this.languageService.getText("map.firstTime") }
                };
                this.modalService.showModal(NotificationsModalComponent, options)
                setString('firstTime', 'true');
            }
        }, 0);
    }

    navigateToAbout() {
        this.tabs.nativeElement.selectedIndex = 4;
    }

    navigateToHotelList() {
        this.hotelsList.getHotels();
        this.tabs.nativeElement.selectedIndex = 5;
    }

    navigateToHotelFilters() {
        this.tabs.nativeElement.selectedIndex = 2;
    }

    pageChange(index) {
        this.currentIndex = index;

        if (index != 2) {
            //this.hotelService.showList = false;
            if (index == 0 && !this.userService.userLoggedIn) {
                this.tabsVisibility = false;
            } else {
                if (index == 3) {
                    this.isFirstTime();
                }
                this.tabsVisibility = true;
            }
        } else {
            // if (this.hotelService.showList) {
            //     this.tabsVisibility = true;
            // } else {
            this.tabsVisibility = false;
            // }
        }
    }

    checkNotifications() {
        const messageTime = getString('notificationTimeStamp');
        this.httpService.getNotification(messageTime ? messageTime : 0).subscribe((res: any) => {
            if (res.text) {
                const options: ModalDialogOptions = {
                    viewContainerRef: this.viewContainerRef,
                    fullscreen: false,
                    context: { text: res.text }
                };
                this.modalService.showModal(NotificationsModalComponent, options)
                setString('notificationTimeStamp', res.time.toString());
            }
        }, err => {
            this.errorService.handleErorr(err);
        })
    }
}