import { ChangeDetectorRef, Component, OnInit, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalDialogService, ModalDialogOptions } from '@nativescript/angular';
import { Page, Application, AndroidApplication } from '@nativescript/core';
import { LanguageService } from '../common/services/language-service';
import { ActivatedRoute, Router } from "@angular/router";
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

@Component({ standalone: false,
    selector: 'ns-mainTabs',
    templateUrl: './main-tabs.component.html',
    styleUrls: ['./main-tabs.component.scss']
})
export class MainTabsComponent implements OnInit, OnDestroy {
    @ViewChild(HotelsListComponent, { static: false }) hotelsList;
    @ViewChild(ProfileComponent, { static: false }) profile;
    @ViewChild('tabs', { static: true }) tabs;
    selectedPageIndex = 0;
    currentIndex;
    tabsVisibility = true;
    // The "bnb" tab hosts both the hotels filters and the results list; this flag
    // toggles between them (replaces the old standalone hotels-list tab index).
    showList = false;
    constructor(public route: ActivatedRoute,
        public router: Router,
        public page: Page,
        public viewContainerRef: ViewContainerRef,
        public modalService: ModalDialogService,
        public languageService: LanguageService,
        public httpService: HttpService,
        public errorService: ErrorsService,
        public hotelService: HotelsService,
        public userService: UserService,
        public cd: ChangeDetectorRef) {
    }

    ngOnInit() {
        //this.checkNotifications();
        this.languageService.getCurrentLanguage();
        this.page.actionBarHidden = true;
        if (this.route.snapshot.params.page) {
            this.selectedPageIndex = +this.route.snapshot.params.page;
        }
        // Hide the bottom tab bar on the initial login screen. pageChange() applies
        // this rule on taps, but it never runs on first load, so set it up front:
        // the bar stays hidden while the (not-logged-in) user is on the login tab.
        this.tabsVisibility = !(this.selectedPageIndex == 0 && !this.userService.userLoggedIn);
        // The component instance survives when the app is backgrounded, so without
        // this the app would resume on whatever tab was last open (e.g. hotels).
        // Always bring it back to the proper entry tab: map when logged in, account
        // (login) otherwise.
        if (Application.android) {
            Application.android.on(AndroidApplication.activityResumedEvent, this.resetToEntryTab, this);
        }
    }

    ngOnDestroy() {
        if (Application.android) {
            Application.android.off(AndroidApplication.activityResumedEvent, this.resetToEntryTab, this);
        }
    }

    // Bound so it can be removed in ngOnDestroy.
    resetToEntryTab = () => {
        const loggedIn = !!getString('user_token');
        this.showList = false;
        this.selectedPageIndex = loggedIn ? 3 : 0;
        this.currentIndex = this.selectedPageIndex;
    }

    navigateToMap() {
        // pageChange sets the selected index, manages the tab bar visibility
        // and runs the first-time map intro.
        this.pageChange(3);
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
        this.router.navigate(["about"]);
    }

    navigateToHotelList() {
        this.hotelsList.getHotels();
        this.showList = true;
    }

    navigateToHotelFilters() {
        this.showList = false;
    }

    pageChange(index) {
        // Keep selectedPageIndex in sync with the user's tab taps so the
        // [selectedIndex] binding and the bold/light icon swap stay correct.
        this.selectedPageIndex = index;
        this.currentIndex = index;
        // Always start the "bnb" tab on the filters screen, not stale results.
        if (index == 2) {
            this.showList = false;
        }

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
        // pageChange may be invoked from an off-zone context (e.g. login/skip
        // emitting goToMap from an HTTP callback). Force CD so the tab actually
        // switches and the bar visibility updates.
        this.cd.detectChanges();
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