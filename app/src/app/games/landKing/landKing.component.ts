import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { Router } from "@angular/router";
import { ModalDialogOptions, ModalDialogService } from "@nativescript/angular/modal-dialog";
import { Image, Page } from "@nativescript/core";
import { LanguageService } from "~/app/common/services/language-service";
import { StartModalComponent } from "./startModal/startModal.component";
import { GamesService } from "~/app/common/services/games-service";
import { screen } from "tns-core-modules/platform";
import { UserService } from "~/app/common/services/userService";
import { ErrorsService } from "~/app/common/services/errors-service";

@Component({
    selector: 'ns-landKing',
    templateUrl: './landKing.component.html',
    styleUrls: ['./landKing.component.scss']
})
export class LandKingComponent implements OnInit {
    timer = 180000;
    rightToLeft = true;
    waitingForResponse = false;
    opacity = 0.5;
    feedback;
    @ViewChild("container", { static: false }) container: ElementRef;
    guessedLocation;
    allLocations = [];
    highScore = 0;
    quizName = "landKing";
    constructor(private page: Page,
        private modalService: ModalDialogService,
        private viewContainerRef: ViewContainerRef,
        private router: Router,
        private languageService: LanguageService,
        private gameService: GamesService,
        private userService: UserService,
        private errorService: ErrorsService) {
        this.page.actionBarHidden = true;
    }
    ngOnInit() {
        this.rightToLeft = this.languageService.getRightToLeft();
        this.openModal();
    }

    openModal() {
        const options: ModalDialogOptions = {
            viewContainerRef: this.viewContainerRef,
            fullscreen: false
        };
        this.modalService.showModal(StartModalComponent, options).then(ok => {
            if (ok) {
                this.waitingForResponse = true;
                if (this.userService.userLoggedIn) {
                    this.getHighScore();
                }
                this.gameService.getLocations().subscribe(res => {
                    this.allLocations = res;
                    this.waitingForResponse = false;
                    this.addLocation();
                    // this.initPanStats();
                    setInterval(() => {
                        this.timer -= 1000;
                        if (this.timer <= 0) {
                            this.exit();// score
                        }
                    }, 1000)
                }, err => {
                   this.errorService.handleErorr(err);
                })
            } else {
                setTimeout(() => {
                    this.exit();
                }, 0);
            }
        });
    }

    draggingStarted() {
        this.opacity = 1;
    }

    userLocate(data) {
        const img: Image = new Image();
        img.src = "~/assets/images/locate.png";
        img.height = 40;
        img.opacity = 0.5;
        const translate = this.gameService.getTranslate(this.guessedLocation);
        img.translateX = translate.x * screen.mainScreen.widthDIPs - (screen.mainScreen.widthDIPs / 2);
        img.translateY = translate.y * this.container.nativeElement.getActualSize().height - (this.container.nativeElement.getActualSize().height / 2);

        this.container.nativeElement.addChild(img);
        setTimeout(() => {
            this.feedback = this.gameService.locate(this.guessedLocation, data);
            this.addLocation(img);
        }, 1000);
    }

    addLocation(image = undefined) {
        this.guessedLocation = undefined;
        if (this.allLocations.length) {
            setTimeout(() => {
                if (image) {
                    image.opacity = 1;
                    image.src = "~/assets/images/locate-grey.png";
                }
                const location = this.allLocations.splice(Math.random() * this.allLocations.length - 1, 1)[0];
                this.guessedLocation = location;
                this.opacity = 0.5;
            }, 0);
        } else {
            this.navigateToScroe();
        }
    }

    alignVertical(label) {
        label.android.setGravity(17)
    }

    navigateToScroe() {
        if (this.gameService.score > this.highScore) {
            this.gameService.setHighScore(this.quizName, this.gameService.score).subscribe(res => {
                console.log("new highscore is " + this.gameService.score);
            })
        }
        this.router.navigate(['score']);
    }

    getHighScore() {
        this.gameService.getHighScore(this.quizName).subscribe(res => {
            this.highScore = res.score;
        }, err => {
            this.errorService.handleErorr(err);
        });
    }

    exit() {
        this.router.navigate(['mainTabs', 1]);
    }
}