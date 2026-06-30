import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Page } from "@nativescript/core";
import { Screen as screen } from "@nativescript/core";
import { ErrorsService } from "~/app/common/services/errors-service";
import { GamesService } from "~/app/common/services/games-service";
import { LanguageService } from "~/app/common/services/language-service";
import { UserService } from "~/app/common/services/userService";

@Component({ standalone: false,
    selector: 'ns-bingo',
    templateUrl: './bingo.component.html',
    styleUrls: ['./bingo.component.scss']
})
export class BingoComponent implements OnInit {
    screenWidth;
    circleSize;
    timer = 0;
    highScore = 0;
    waitingForResponse = false;

    bingoItems = [{ name: "", found: false, color: "rgb(242, 232, 36)" },
    { name: "", found: false, color: "rgb(35, 204, 153)" },
    { name: "", found: false, color: "rgb(0, 134, 212)" },
    { name: "", found: false, color: "rgb(224, 50, 40)" }];

    constructor(public page: Page,
        public router: Router,
        public gameService: GamesService,
        public errorService: ErrorsService,
        public languageService: LanguageService,
        public userService: UserService,
        public cd: ChangeDetectorRef) {
        this.page.actionBarHidden = true;
    }

    ngOnInit() {
        this.circleSize = (screen.mainScreen.widthDIPs + 20) / 4;
        this.screenWidth = (screen.mainScreen.widthDIPs - 35) / 4;

        this.waitingForResponse = true;
        this.gameService.getBingoItems().subscribe(res => {
            for (let index = 0; index < res.length; index++) {
                this.bingoItems[index].name = res[index];
            }

            this.waitingForResponse = false;
            // HTTP response fires off Angular's zone; force CD so the board renders
            // and the spinner clears. (setInterval below is created here, in the
            // out-of-zone callback, so its ticks also need detectChanges.)
            this.cd.detectChanges();
            setInterval(() => {
                this.timer += 1000;
                this.cd.detectChanges();
            }, 1000)
        }, err => {
            this.waitingForResponse = false;
            this.errorService.handleErorr(err);
            this.cd.detectChanges();
        })
    }

    find(index) {
        this.bingoItems[index].found = !this.bingoItems[index].found;
        if (!this.bingoItems.find(a => !a.found)) {
            this.router.navigate(['winBingo', this.timer]);
        }
    }

    exit() {
        this.router.navigate(['mainTabs', 1]);
    }
}