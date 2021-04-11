import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Page } from "@nativescript/core";
import { screen, } from "tns-core-modules/platform";
import { ErrorsService } from "~/app/common/services/errors-service";
import { GamesService } from "~/app/common/services/games-service";

@Component({
    selector: 'ns-bingo',
    templateUrl: './bingo.component.html',
    styleUrls: ['./bingo.component.scss']
})
export class BingoComponent implements OnInit {
    screenWidth;
    circleSize;
    timer = 0;
    waitingForResponse = false;

    bingoItems = [{name: "", found: false, color: "rgb(242, 232, 36)"}, 
                  {name: "", found: false, color: "rgb(35, 204, 153)"}, 
                  {name: "", found: false, color: "rgb(0, 134, 212)"}, 
                  {name: "", found: false, color: "rgb(224, 50, 40)"}];

    constructor(private page: Page,
                private router: Router,
                private gamesService: GamesService,
                private errorService: ErrorsService){
        this.page.actionBarHidden = true;
    }

    ngOnInit() {
        this.circleSize = (screen.mainScreen.widthDIPs+20)/4;
        this.screenWidth = (screen.mainScreen.widthDIPs-35)/4;

        this.waitingForResponse = true;
        this.gamesService.getBingoItems().subscribe(res => {
            for (let index = 0; index < res.length; index++) {
               this.bingoItems[index].name = res[index];
            }

            this.waitingForResponse = false;
            setInterval(() => {
                this.timer += 1000;
            }, 1000)
        }, err => {
            this.waitingForResponse = false;
            this.errorService.handleErorr(err);
        })
    }

    find(index){
        this.bingoItems[index].found = !this.bingoItems[index].found;
        if (!this.bingoItems.find(a => !a.found)) {
            this.router.navigate(['winBingo', this.timer]);
        }
    }

    exit(){
        this.router.navigate(['mainTabs', 1]);
    }
}