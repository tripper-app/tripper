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

//declare let android: any; // or use tns-platform-declarations
//declare let java: any;

@Component({
    selector: 'ns-mainTabs',
    templateUrl: './main-tabs.component.html',
    styleUrls: ['./main-tabs.component.css']
})
export class MainTabsComponent implements OnInit {
    @ViewChild('tabs', { static: true }) tabs;
    selectedPageIndex = 0;
    tabsVisibility = true;
    showList = false;
    constructor(private route: ActivatedRoute,
        private page: Page,
        private viewContainerRef: ViewContainerRef,
        private modalService: ModalDialogService,
        private languageService: LanguageService,
        private httpService: HttpService,
        
        private hotelService: HotelsService,
        private userService: UserService) {
    }

    ngOnInit() {
        this.checkNotifications();
        this.languageService.getCurrentLanguage();
        this.page.actionBarHidden = true;
        if (this.route.snapshot.params.page) {
            this.selectedPageIndex = this.route.snapshot.params.page;
        }
    }

    navigateToMap() {
        this.tabs.nativeElement.selectedIndex = 3
    }

    navigateToAbout() {
        this.tabs.nativeElement.selectedIndex = 4;
    }

    pageChange(index) {
        if (index != 2) {
            this.hotelService.showList = false;
            if (index == 0 && !this.userService.userLoggedIn) {
                this.tabsVisibility = false;
            } else {
                this.tabsVisibility = true;
            }
        } else {
            if (this.hotelService.showList) {
                this.tabsVisibility = true;
            } else {
                this.tabsVisibility = false;
            }
        }
    }

    checkNotifications() {
        const messageTime = getString('notificationTimeStamp');
        this.httpService.getNotification(messageTime ? messageTime : 0).subscribe((res: any) => {
            if (res.text) {
                const options: ModalDialogOptions = {
                    viewContainerRef: this.viewContainerRef,
                    fullscreen: false,
                    context: {text: res.text}
                };
                this.modalService.showModal(NotificationsModalComponent, options)                
                setString('notificationTimeStamp', res.time.toString());
            }
        })
    }
}