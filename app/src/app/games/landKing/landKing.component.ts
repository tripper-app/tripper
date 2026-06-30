import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { Router } from "@angular/router";
import { ModalDialogOptions, ModalDialogService } from '@nativescript/angular';
import { Image, Page } from "@nativescript/core";
import { LanguageService } from "~/app/common/services/language-service";
import { StartModalComponent } from "./startModal/startModal.component";
import { GamesService } from "~/app/common/services/games-service";
import { Screen as screen } from "@nativescript/core";
import { UserService } from "~/app/common/services/userService";
import { ErrorsService } from "~/app/common/services/errors-service";

@Component({ standalone: false,
    selector: 'ns-landKing',
    templateUrl: './landKing.component.html',
    styleUrls: ['./landKing.component.scss']
})
export class LandKingComponent implements OnInit {
    time = 60000;
    waitingForResponse = false;
    opacity = 0.5;
    feedback;
    @ViewChild("container", { static: false }) container: ElementRef;
    guessedLocation;
    allLocations = [];
    highScore = 0;
    quizName = "landKing";
    //mapScale = 1;
    map;
    // mapScale = (screen.mainScreen.scale * 0.60) - 0.1;
    // mapScale = screen.mainScreen.scale * 0.35
    constructor(public page: Page,
        public modalService: ModalDialogService,
        public viewContainerRef: ViewContainerRef,
        public router: Router,
        public languageService: LanguageService,
        public gameService: GamesService,
        public userService: UserService,
        public errorService: ErrorsService,
        public cd: ChangeDetectorRef) {
        this.page.actionBarHidden = true;
    }
    ngOnInit() {
        this.openModal();
    }

    getScale() {        
        if (this.map) {
            return 1.45-(this.map.getActualSize().height / screen.mainScreen.heightPixels);
        }
        return 1;
    }

    mapLoaded(container) {
        this.map = container;
    }

    openModal() {
        if (this.userService.userLoggedIn) {
            this.getHighScore();
        }

        const options: ModalDialogOptions = {
            viewContainerRef: this.viewContainerRef,
            fullscreen: false
        };
        this.modalService.showModal(StartModalComponent, options).then(ok => {
            if (ok) {
                this.waitingForResponse = true;
                this.gameService.getLocations().subscribe(res => {
                    this.allLocations = res;
                    this.waitingForResponse = false;
                    this.addLocation();
                    // this.initPanStats();
                    // This subscribe fires off Angular's zone, so the setInterval
                    // created here also runs off-zone -> detectChanges each tick to
                    // render the countdown, and once now to clear the spinner.
                    this.cd.detectChanges();
                    let timer = setInterval(() => {
                        this.time -= 1000;
                        if (this.time <= 0) {
                            this.navigateToScroe();
                            clearInterval(timer);
                        }
                        this.cd.detectChanges();
                    }, 1000)
                }, err => {
                    this.errorService.handleErorr(err);
                    this.cd.detectChanges();
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
                // The first addLocation runs from the out-of-zone getLocations
                // callback, so this setTimeout is also off-zone -> render explicitly.
                this.cd.detectChanges();
            }, 0);
        } else {
            this.navigateToScroe();
        }
    }

    alignVertical(label) {
        label.android.setGravity(17)
    }

    navigateToScroe() {
        if (this.userService.userLoggedIn) {
            if (this.gameService.score > this.highScore) {                
                this.gameService.setHighScore(this.quizName, this.gameService.score).subscribe(res => {
                    console.log("new highscore is " + this.gameService.score);
                })
            }
        }
        this.router.navigate(['score']);
    }

    getHighScore() {
        this.gameService.getHighScore(this.quizName).subscribe(res => {
            this.highScore = res.score;
            this.cd.detectChanges();
        }, err => {
            this.errorService.handleErorr(err);
            this.cd.detectChanges();
        });
    }

    exit() {
        this.router.navigate(['mainTabs', 1]);
    }
}