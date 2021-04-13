import { Component, OnDestroy, OnInit, ViewContainerRef, ViewChild, ElementRef } from '@angular/core';
import { MapView, Marker, Position } from 'nativescript-google-maps-sdk';
import { Page } from 'tns-core-modules/ui/page';
import { Image } from 'tns-core-modules/ui/image';
import { ImageSource } from "tns-core-modules/image-source";
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import { SpringsService } from '../common/services/springs-service';
import { FlatSpring } from '../common/models/flatSpring';
import { localize } from "nativescript-localize";
import { LanguageService } from '../common/services/language-service';
// import { DrawerService } from '../common/services/drawer-service';
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
  hotelMarker: Marker;
  singleSpringSubject;

  constructor(private page: Page,
    private router: Router,
    private viewContainerRef: ViewContainerRef,
    private springsService: SpringsService,
    private languageService: LanguageService,
    private alertService: AlertService) {
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
      this.alertService.showError(localize('messages.error.noLocationPermissions'));
    }
    // if (this.springsService.showSingleSpring) {
    //   this.addSingleSpring();
    // } else {  // add with subject
    this.getSprings();
    //}
  }

  async getSprings() {
    this.loading = true;
    if (this.springsService.filterByHotel) {
      this.hotelMarker = new Marker();
      this.hotelMarker.position = Position.positionFromLatLng(this.springsService.singleHotel.location.latitude, this.springsService.singleHotel.location.longitude);
      this.hotelMarker.color = "#61ffa3";
      this.hotelMarker.userData = { hotelId: this.springsService.singleHotel.id };
      this.mainMap.addMarker(this.hotelMarker);
      this.centerMap(this.hotelMarker.position.latitude, this.hotelMarker.position.longitude);
      this.mainMap.latitude = this.hotelMarker.position.latitude;
      this.mainMap.longitude = this.hotelMarker.position.longitude;
    }

    this.springsService.getSprings().subscribe((springs: FlatSpring[]) => {
      console.log("springs count: " + springs.length);
      
      this.loading = false;
      springs.forEach(spring => {
        this.addMarker(spring);
      })
    }, err => {
      this.loading = false;
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
      this.alertService.showError(localize('messages.error.noLocationPermissions'));
      console.log("recieved location is NULL");
    }
  }

  centerMap(lat: number, lon: number){
    this.mainMap.latitude = lat;
    this.mainMap.longitude = lon;
  }

  clickOnMarker(marker) {
    if (marker.userData.springId) {
      this.router.navigate(["springView", marker.userData.springId])
    } else if (marker.userData.hotelId) {
      this.router.navigate(["hotelView", marker.userData.hotelId])
    }
    //   if (marker != this.userMarker) {
    //     const options: ModalDialogOptions = {
    //       viewContainerRef: this.viewContainerRef,
    //       fullscreen: false,
    //       context: marker.userData
    //     };
    //   this.modalService.showModal(SpringModalComponent, options);
    // }
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
    // this.addMarker(this.springsService.singleSpring);
    //this.springsService.showSingleSpring = false;
  }

  async clearMarkers() {
    if (this.mainMap) {
      this.mainMap.removeAllMarkers();
      //await this.addUserMarker()
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
        this.alertService.showError(localize("messages.error.springNotFound"));
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
    // error service
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
    marker.userData = { springId: spring.id };
    this.mainMap.addMarker(marker);
  }

  private onAndroidActivityResume(args) { // delete
    if (this.mainMap && this.mainMap.nativeView && this.mainMap._context === args.activity) {
      this.mainMap.nativeView.onResume();
      // this.drawerService.sideDrawer = false;
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
