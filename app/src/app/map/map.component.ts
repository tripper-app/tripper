import { Component, OnDestroy, OnInit, ViewContainerRef, ViewChild, ElementRef } from '@angular/core';
import { MapView, Marker, Position } from 'nativescript-google-maps-sdk';
import { Page } from 'tns-core-modules/ui/page';
import { Image } from 'tns-core-modules/ui/image';
import { ImageSource } from "tns-core-modules/image-source";
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import { SpringModalComponent } from './spring-modal/spring-modal.component';
import { SpringsService } from '../common/services/springs-service';
import { FlatSpring } from '../common/models/flatSpring';
import { localize } from "nativescript-localize";
import { LanguageService } from '../common/services/language-service';
import { DrawerService } from '../common/services/drawer-service';
import * as application from "tns-core-modules/application";
import { SearchBar } from 'tns-core-modules';
import { AlertService } from '../common/services/alert-service';
import { Router } from "@angular/router";
import { android } from 'tns-core-modules/application';

@Component({
  selector: 'ns-map',
  providers: [ModalDialogService], // delete
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {
  mainMap: MapView;
  loading = false;
  defaultZoom = 10;
  bigZoom = 12;
  userMarker: Marker;
  searchMode = false;
  searchBar;
  //springsSubscription; // delete
  //responseErrorSubscription; // delete
  //waitForResponseSubscription; // delete

  constructor(private page: Page,
    private router: Router,
    private modalService: ModalDialogService, // delete
    private viewContainerRef: ViewContainerRef,
    private springsService: SpringsService,
    private languageService: LanguageService,
    private drawerService: DrawerService, // delete
    private alertService: AlertService) {
  }

  ngOnInit(): void {
    this.loading = true;
    if (application.android) { // delete
      application.android.on(application.AndroidApplication.activityResumedEvent, this.onAndroidActivityResume, this);
    }

    this.page.actionBarHidden = true;
    this.drawerService.sideDrawer = true; // delete

    // this.waitForResponseSubscription = this.springsService.waitingForResponse.subscribe((data) => { // delete
    //   this.loading = true;
    // })
  }

  async onMapReady(map: MapView) {
    this.mainMap = map;
    map.settings.mapToolbarEnabled = false;
    map.settings.myLocationButtonEnabled = false;
    if (await this.springsService.getCurrentLocation()) {
      // map.settings.compassEnabled = false;
      map.myLocationEnabled = true;
      this.centerMap();
    }
    else {
      this.alertService.showError(localize('messages.error.noLocationPermissions'));
    }

    //this.getSprings();
  }

  async getSprings() {
    this.springsService.getSprings().subscribe((springs: FlatSpring[]) => {
      this.loading = false;
      this.clearMarkers(); // delete
      springs.forEach(spring => {
        this.addMarker(spring);
        // const marker = new Marker();
        // marker.position = Position.positionFromLatLng(spring.location._latitude, spring.location._longitude);
        // marker.color = "#9061ff";
        // marker.userData = { ID: spring.ID };
        // this.mainMap.addMarker(marker);
      })
    }, err => {
      this.loading = false;
      this.handleErrors(err);
    })
    //this.springsService.updateSprings(); // delete
  }

  async setMyPosition() {
    this.centerMap();

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

  async centerMap() {
    const location = await this.springsService.getCurrentLocation()
    if (location) {
      this.mainMap.latitude = location.latitude;
      this.mainMap.longitude = location.longitude;
    }
    else {
      this.alertService.showError(localize('messages.error.noLocationPermissions'));
      console.log("recieved location is NULL");
    }
  }

  clickOnMarker(marker) {
    this.router.navigate(["springView", marker.userData.ID])
    // if (marker != this.userMarker) {
    //   const options: ModalDialogOptions = {
    //     viewContainerRef: this.viewContainerRef,
    //     fullscreen: false,
    //     context: marker.userData
    //   };
    //   this.modalService.showModal(SpringModalComponent, options);
    // }
  }

  clickOnMap(){    
    this.searchBar.android.clearFocus();
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

  async clearMarkers() {
    if (this.mainMap) {
      this.mainMap.removeAllMarkers();
      //await this.addUserMarker()
    }
  }

  searchByName() {
    this.searchBar.dismissSoftInput();
    const oldText = this.searchBar.text;
    this.loading = true;
    this.springsService.getSpringByName(this.searchBar.text).subscribe((res: FlatSpring) => {
      this.searchBar.text += " ";
      this.searchBar.text = oldText;
      if (res.ID) {
        this.loading = false;
        this.clearMarkers();
        this.addMarker(res);
        this.mainMap.latitude = res.location._latitude;
        this.mainMap.longitude = res.location._longitude;
      } else {
        this.loading = false;
        this.alertService.showError(localize("messages.error.springNotFound"));
      }
    }, err => {
      this.loading = false;
      this.searchBar += " ";
      this.searchBar = oldText;
      this.handleErrors(err);
    })
  }

  navigateToFilters(){
    this.router.navigate(["springsFilter"]);
  }

  handleErrors(error) {
    this.loading = false;
    console.log(error);
    switch (error.status) {
      case 0:
        this.alertService.showError(localize('messages.error.connectionError'));
        break;
      case 500:
        this.alertService.showError(localize("messages.error.serverError"));
      default:
        // alert default message
        break;
    }
  }

  private addMarker(spring: FlatSpring) {
    const marker = new Marker();
    marker.position = Position.positionFromLatLng(spring.location._latitude, spring.location._longitude);
    marker.color = "#9061ff";
    marker.userData = { ID: spring.ID };
    this.mainMap.addMarker(marker);
  }

  private onAndroidActivityResume(args) { // delete
    if (this.mainMap && this.mainMap.nativeView && this.mainMap._context === args.activity) {
      this.mainMap.nativeView.onResume();
      this.drawerService.sideDrawer = false;
      // this.drawerService.closeDrawer();
      // this.springsSubscription.unsubscribe();
      // this.waitForResponseSubscription.unsubscribe();
    }
  }

  ngOnDestroy() {
    if (application.android) {
      application.android.off(application.AndroidApplication.activityResumedEvent, this.onAndroidActivityResume, this);
    }
  }

  // async addUserMarker() {
  //   if (this.userMarker) {
  //     this.mainMap.removeMarker(this.userMarker);
  //   }
  //   const img = new Image();
  //   img.height = 10;
  //   img.width = 1;
  //   const imgsrc = await ImageSource.fromFile("~/assets/shoe_icon.png");
  //   img.imageSource = imgsrc;
  //   this.userMarker = new Marker();
  //   this.userMarker.position = Position.positionFromLatLng(this.poolsService.currentLocation.latitude, this.poolsService.currentLocation.longitude);
  //   this.userMarker.color = "#9058FF";
  //   this.userMarker.icon = img;
  //   this.mainMap.addMarker(this.userMarker);
  // }
}
