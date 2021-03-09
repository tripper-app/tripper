import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../common/services/language-service';
import { UserService } from '../common/services/userService';
import { device, screen, isAndroid, isIOS } from "tns-core-modules/platform";
import { User } from '../common/models/user';


@Component({
    selector: 'ns-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    currentUser: User;
    rightToLeft = true;
    widthHalf = screen.mainScreen.widthDIPs/2;
    pass = "abcd";
    waitingForResponse = false;
    mainColor = "rgb(35, 204, 153)";
    checkBoxScale = 0.7;
    constructor(private userService: UserService,
                private languageService: LanguageService) {
    }

    ngOnInit(): void {
        this.rightToLeft = this.languageService.getRightToLeft();
        this.getUser();
    }

    getUser(){
        this.currentUser = new User();
        this.currentUser.profile = "https://cdn.mos.cms.futurecdn.net/VSy6kJDNq2pSXsCzb6cvYF.jpg";
        this.currentUser.email = "blablabla@gmail.com";
        this.currentUser.password = "1234";
        this.currentUser.userName = "ישראל ישראלי";
    }

    changeLanguage(lang){

    }

    alignVertical(label) {
        label.android.setGravity(17)
    }
}
