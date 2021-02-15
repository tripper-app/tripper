import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from "nativescript-angular/modal-dialog";
import { SpringsService } from '~/app/common/services/springs-service';
import { openUrl } from "tns-core-modules/utils/utils";
import { FullSpring } from '~/app/common/models/fullSpring';
import { localize } from "nativescript-localize";
import * as SocialShare from "nativescript-social-share";
import { ImageSource } from "tns-core-modules/image-source";

@Component({
  selector: 'ns-spring-modal',
  templateUrl: './spring-modal.component.html',
  styleUrls: ['./spring-modal.component.css']
})
export class SpringModalComponent implements OnInit {

  currentId;
  loadded = false;
  currentSpring: any = {};
  currentLocation;
  googleMapsURL = "https://maps.google.com/?daddr=";
  wazeURL = "waze://?ll=";

  constructor(private params: ModalDialogParams, private springsService: SpringsService) {
    this.currentId = this.params.context.ID;
  }

  ngOnInit(): void {
    this.springsService.getSpring(this.currentId).subscribe((spring: FullSpring) => {
      this.loadded = true;
      this.currentSpring = spring;
      this.currentLocation = `${this.currentSpring.location._latitude},${this.currentSpring.location._longitude}`;
    }, error => {
      console.log(error);
      alert(localize('messages.error.connectionError'));
      this.exit();
    })
  }

  navigateWithMaps() {
    openUrl(this.googleMapsURL + this.currentLocation);
  }

  navigateWithWaze() {
    openUrl(this.wazeURL + this.currentLocation);
  }

  async share() {
    const imgsrc = await ImageSource.fromUrl(this.currentSpring.images[0]);
    try {
      var springText = `*${this.currentSpring.name}*\n${this.currentSpring.description}
\n${this.getTextFromFields()}
${localize("springModal.navigateWithWaze")}:
https://www.waze.com/ul?ll=${this.currentSpring.location._latitude}%2C${this.currentSpring.location._longitude}&navigate=yes\n
${localize("springModal.shareLink")}:
123456 just some link here lorem ipsum`; // to do - put here real link!!!
      SocialShare.shareImage(imgsrc, springText)
    } catch (error) {
      console.log(error);
    }
  }

  getTextFromFields() {
    var txt = "";
    if (this.currentSpring.depth) {
      txt += `${localize("springModal.depth")}: ${this.currentSpring.depth}\n`;
    }

    if (this.currentSpring.distanceFromCar) {
      txt += `${localize("springModal.walkingDistanceFromCar")}: ${this.currentSpring.distanceFromCar}\n`;
    }

    if (this.currentSpring.preferredSeason) {
      txt += `${localize("springModal.preferredSeason")}: ${this.currentSpring.preferredSeason}\n`;
    }

    return txt;
  }

  addComment(text){
    this.springsService.addComment(text, this.currentId).subscribe(res => {
      console.log("good");
      console.log(res);
      
    }, err => {
      console.log("not good");
      console.log(err);
      
    })
  }

  exit() {
    this.params.closeCallback();
  }
}
