import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: 'ns-games',
    templateUrl: './games.component.html',
    styleUrls: ['./games.component.scss']
})
export class GamesComponent {
    itemSize = "38%";
    constructor(private router: Router){}

    navigateToGame(game){
        this.router.navigate([game]);
    }

    alignVertical(label) {
        label.android.setGravity(17)
    }
}