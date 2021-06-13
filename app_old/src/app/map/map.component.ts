import { Component, OnInit } from '@angular/core';
import { MapView, Marker, Position } from 'nativescript-google-maps-sdk';
import { Page } from 'tns-core-modules/ui/page';
import { SpringsService } from '../common/services/springs-service';
import { FlatSpring } from '../common/models/flatSpring';
import { LanguageService } from '../common/services/language-service';
import * as application from "tns-core-modules/application";
import { AlertService } from '../common/services/alert-service';
import { Router } from "@angular/router";
import { ErrorsService } from '../common/services/errors-service';
import { Image, ImageSource } from '@nativescript/core';
import { screen } from "tns-core-modules/platform";

@Component({
  selector: 'ns-map',
  // providers: [ModalDialogService], // delete
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  mainMap: MapView;
  loading = false;
  defaultZoom = 10;
  bigZoom = 12;
  userMarker: Marker;
  searchMode = false;
  searchBar;
  hotelMarker: Marker;
  singleSpringSubject;
  screen = screen;
  singleRowHeight = ((screen.mainScreen.heightDIPs*0.83789)/15)*2-20 // the percentage without the bottom navigation

  constructor(private page: Page,
    private router: Router,
    private springsService: SpringsService,
    private alertService: AlertService,
    private errorService: ErrorsService,
    private languageService: LanguageService) {
  }

  ngOnInit(): void {
    if (application.android) { // delete
      application.android.on(application.AndroidApplication.activityResumedEvent, this.onAndroidActivityResume, this);
    }

    this.springsService.singleSpringSubject.subscribe(spring => {
      this.addSingleSpring(spring);
    });
    this.page.actionBarHidden = true;
  }

  async onMapReady(map: MapView) {
    this.mainMap = map;
    map.settings.mapToolbarEnabled = false;
    map.settings.myLocationButtonEnabled = false;
    if (await this.springsService.getCurrentLocation()) {
      map.settings.compassEnabled = false;
      map.myLocationEnabled = true;
      if (!this.springsService.filterByHotel) {
        this.centerMapToUser();
      }
    }
    else {
      this.alertService.showError(this.languageService.getText('messages.error.noLocationPermissions'));
    }
    //this.getSprings();
  }

  async getSprings() {
    this.loading = true;
    if (this.springsService.filterByHotel) {
      this.hotelMarker = new Marker();
      this.hotelMarker.position = Position.positionFromLatLng(this.springsService.singleHotel.location.latitude, this.springsService.singleHotel.location.longitude);
      // this.hotelMarker.color = "#61ffa3";
      const img = new Image();
      const imgsrc = ImageSource.fromFileSync("~/assets/images/zimmer.png");
      img.imageSource = imgsrc;
      this.hotelMarker.icon = img;
      this.hotelMarker.userData = { hotelId: this.springsService.singleHotel.id };
      this.mainMap.addMarker(this.hotelMarker);
      this.centerMap(this.hotelMarker.position.latitude, this.hotelMarker.position.longitude);
      this.mainMap.latitude = this.hotelMarker.position.latitude;
      this.mainMap.longitude = this.hotelMarker.position.longitude;
    }

    this.springsService.getSprings().subscribe((springs: FlatSpring[]) => {
      this.loading = false;
      springs.forEach(spring => {
        this.addMarker(spring);
      })
    }, err => {
      this.handleErrors(err);
    })
  }

  async setMyPosition() {
    this.centerMapToUser();

    if (this.mainMap.zoom < this.bigZoom) {
      this.mainMap.zoom = this.bigZoom;
    }
    if (!this.mainMap.myLocationEnabled) {
      //this.mainMap.myLocationEnabled = true;
    }

    // const img = new Image();
    // img.height = 10;
    // img.width = 1;
    // const imgsrc = await ImageSource.fromFile("~/assets/hiker_avatar.png");
    // img.imageSource = imgsrc;
    // var marker = new Marker();
    // marker.position = Position.positionFromLatLng(this.currentLatitude, this.currentLongitude);
    // marker.title = "אתם";
    // marker.color = "#9058FF";
    // marker.icon = img;
    // this.mainMap.addMarker(marker);
  }

  async centerMapToUser() {
    if (this.springsService.filterByHotel) {
      this.springsService.filterByHotel = false;
      this.removeHotelMarker();
    }
    const location = await this.springsService.getCurrentLocation()
    if (location) {
      this.centerMap(location.latitude, location.longitude);
    }
    else {
      this.alertService.showError(this.languageService.getText('messages.error.noLocationPermissions'));
      console.log("recieved location is NULL");
    }
  }

  centerMap(lat: number, lon: number) {
    this.mainMap.latitude = lat;
    this.mainMap.longitude = lon;
  }

  clickOnMarker(marker) {
    if (marker.userData.springId) {
      this.router.navigate(["springView", marker.userData.springId])
    } else if (marker.userData.hotelId) {
      this.router.navigate(["hotelView", marker.userData.hotelId])
    }
  }

  clickOnMap() {
    if (this.searchBar && this.searchBar.android) {
      this.searchBar.android.clearFocus();
    }
    this.searchMode = false;
  }

  coordinateLongPress(cords) {
    // add marker (different collor?)    
  }

  onSearchBarLoaded(event) {
    if (event.object.android) {
      this.searchBar = event.object;
      event.object.android.clearFocus();
    }
  }

  addSingleSpring(spring) {
    this.clearMarkers();
    this.addMarker(spring);
    this.centerMap(spring.location._latitude, spring.location._longitude);
  }

  async clearMarkers() {
    if (this.mainMap) {
      this.mainMap.removeAllMarkers();
    }
  }

  removeHotelMarker() {
    this.mainMap.removeMarker(this.hotelMarker);
  }

  searchByName() {
    this.searchBar.dismissSoftInput();
    const oldText = this.searchBar.text;
    this.loading = true;
    this.springsService.getSpringByName(this.searchBar.text).subscribe(res => {
      this.searchBar.text += " ";
      this.searchBar.text = oldText;
      if (res.id) {
        this.loading = false;
        this.clearMarkers();
        this.addMarker(res);
        this.mainMap.latitude = res.location._latitude;
        this.mainMap.longitude = res.location._longitude;
      } else {
        this.loading = false;
        this.alertService.showError(this.languageService.getText("messages.error.springNotFound"));
      }
    }, err => {
      this.loading = false;
      this.searchBar += " ";
      this.searchBar = oldText;
      this.handleErrors(err);
    })
  }

  navigateToFilters() {
    this.router.navigate(["springsFilter"]);
  }

  handleErrors(error) {
    this.loading = false;
    console.log(error);
    this.errorService.handleErorr(error);
  }

  private addMarker(spring: FlatSpring) {
    const marker = new Marker();
    marker.position = Position.positionFromLatLng(spring.location._latitude, spring.location._longitude);
    // marker.color = "#9061ff";
    marker.userData = { springId: spring.id };
    const img = new Image();
    // const imgsrc = ImageSource.fromResourceSync("icon");
    const imgsrc = ImageSource.fromFileSync("~/assets/images/fountain.png");
    img.imageSource = imgsrc;
    marker.icon = img;
    this.mainMap.addMarker(marker);
  }

  private onAndroidActivityResume(args) { // delete
    if (this.mainMap && this.mainMap.nativeView && this.mainMap._context === args.activity) {
      this.mainMap.nativeView.onResume();
    }
  }
}
