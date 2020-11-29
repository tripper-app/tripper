import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
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

@Component({
  selector: 'ns-map',
  providers: [ModalDialogService],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {
  mainMap: MapView;
  loading = false;
  defaultZoom = 10;
  bigZoom = 12;
  userMarker: Marker;
  springsSubscription;
  responseErrorSubscription;
  waitForResponseSubscription;

  constructor(private page: Page,
    private modalService: ModalDialogService,
    private viewContainerRef: ViewContainerRef,
    private springsService: SpringsService,
    private languageService: LanguageService,
    private drawerService: DrawerService) {
  }

  ngOnInit(): void {
    this.page.actionBarHidden = true;
    this.drawerService.sideDrawer = true;

    this.waitForResponseSubscription = this.springsService.waitingForResponse.subscribe((data) => {
      this.loading = true;
    })
  }

  async onMapReady(map: MapView) {
    this.mainMap = map;
    map.settings.mapToolbarEnabled = false;
    map.settings.myLocationButtonEnabled = false;
    if (await this.springsService.getCurrentLocation()) {
      map.settings.compassEnabled = false;
      map.myLocationEnabled = true;
      this.centerMap();
    }
    else {
      alert(localize('messages.error.noLocationPermissions'));
    }

    this.getSprings();
  }

  async getSprings() {
    this.springsSubscription = this.springsService.getAllSprings().subscribe((springs: FlatSpring[]) => {
      this.loading = false;
      this.clearMarkers();
      springs.forEach(spring => {
        const marker = new Marker();
        marker.position = Position.positionFromLatLng(spring.location._latitude, spring.location._longitude);
        marker.color = "#9061ff";
        marker.userData = { ID: spring.ID };
        this.mainMap.addMarker(marker);
      })
    }, error => {
      this.loading = false;
      switch (error.status) {
        case 0:
          alert(localize('messages.error.connectionError'));
          break;
        case 500:
          alert(localize("messages.error.serverError"))
        default:
          break;
      }
    })
    this.springsService.updateSprings();
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
      alert(localize('messages.error.noLocationPermissions'));
      console.log("recieved location is NULL");
    }
  }

  clickOnMarker(marker) {
    if (marker != this.userMarker) {
      const options: ModalDialogOptions = {
        viewContainerRef: this.viewContainerRef,
        fullscreen: false,
        context: marker.userData
      };
      this.modalService.showModal(SpringModalComponent, options);
    }
  }

  toggleDrawer() {
    this.drawerService.setdrawerLocation(this.languageService.getRightToLeft());
    this.drawerService.openDrawer()
  }

  async clearMarkers() {
    if (this.mainMap) {
      this.mainMap.removeAllMarkers();
      //await this.addUserMarker()
    }
  }


  ngOnDestroy() {
    this.drawerService.sideDrawer = false;
    this.drawerService.closeDrawer();
    this.springsSubscription.unsubscribe();
    this.waitForResponseSubscription.unsubscribe();
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
