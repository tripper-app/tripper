import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { LanguageService } from "../common/services/language-service";

@Component({
    selector: 'ns-games',
    templateUrl: './games.component.html',
    styleUrls: ['./games.component.scss']
})
export class GamesComponent {
    itemSize = "38%";
    constructor(private router: Router,
        private languageService: LanguageService){}

    navigateToGame(game){
        this.router.navigate([game]);
    }

    alignVertical(label) {
        label.android.setGravity(17)
    }
}