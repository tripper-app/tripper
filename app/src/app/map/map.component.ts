import { ChangeDetectorRef, Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { MapView, Marker, Position } from 'nativescript-google-maps-sdk';
import { Page } from '@nativescript/core';
import { SpringsService } from '../common/services/springs-service';
import { FlatSpring } from '../common/models/flatSpring';
import { LanguageService } from '../common/services/language-service';
import { Application, AndroidApplication } from "@nativescript/core";
import { AlertService } from '../common/services/alert-service';
import { Router } from "@angular/router";
import { ErrorsService } from '../common/services/errors-service';
import { Image, ImageSource } from '@nativescript/core';
import { Screen as screen } from "@nativescript/core";


@Component({ standalone: false,
  selector: 'ns-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @ViewChild('searchField', { static: false }) searchField: any;
  mainMap: MapView;
  loading = false;
  defaultZoom = 10;
  bigZoom = 12;
  searchMode = false;
  searchBar: any;
  hotelMarker: Marker;
  screen = screen;
  singleRowHeight = ((screen.mainScreen.heightDIPs * 0.87789) / 16) * 2 - 20 // the percentage without the bottom navigation

  constructor(public page: Page,
    public router: Router,
    public zone: NgZone,
    public cdr: ChangeDetectorRef,
    public springsService: SpringsService,
    public alertService: AlertService,
    public errorService: ErrorsService,
    public languageService: LanguageService) {
  }

  ngOnInit(): void {
    if (Application.android) {
      Application.android.on(AndroidApplication.activityResumedEvent, this.onAndroidActivityResume, this);

      Application.android.on(AndroidApplication.activityBackPressedEvent, () => {
        this.clearMarkers();
        this.getSprings();
      });
    }

    this.springsService.singleSpringSubject.subscribe(spring => {
      this.addSingleSpring(spring);
    });

    // Returning to this page (e.g. back from the filters screen) leaves the
    // Google Maps GL surface paused -> it renders white until something forces a
    // redraw. Resume it whenever the page becomes visible again. If the filters
    // screen requested a new search, re-fetch now that the map is visible so the
    // loading gif shows on-screen. Wrapped in NgZone because page events fire
    // outside Angular's zone, so `loading` changes would not be rendered.
    this.page.on(Page.navigatedToEvent, () => {
      this.zone.run(() => {
        this.resumeMap();
        if (this.springsService.filtersChanged) {
          this.springsService.filtersChanged = false;
          this.clearMarkers();
          this.getSprings();
        }
      });
    });

    this.page.actionBarHidden = true;
  }

  async onMapReady(map: MapView) {
    setTimeout(() => {
      this.singleRowHeight = (1 / 8.5) * (screen.mainScreen.heightDIPs - 60) - 15
    }, 0);
    this.mainMap = map;
    map.settings.mapToolbarEnabled = false;
    map.settings.myLocationButtonEnabled = false;
    const loc = await this.springsService.getCurrentLocation();

    // Run the default search FIRST so a failure in the cosmetic map setup below
    // (e.g. myLocationEnabled / compass) can never abort onMapReady before the
    // data loads -- that bug left the map empty on a plain first open while the
    // filter flow (which fires getSprings separately) still worked.
    if (this.springsService.firstMapLoad) {
      this.springsService.firstMapLoad = false;
      this.springsService.resetFilters();
    }
    this.getSprings();

    try {
      if (loc) {
        // NOTE: map.settings.compassEnabled(false) was removed -- it's typed as a
        // method but throws "not a function" at runtime in this SDK build, which
        // aborted the rest of this block (myLocationEnabled / centering).
        map.myLocationEnabled = true;
        if (!this.springsService.filterByHotel) {
          this.centerMapToUser();
        }
      }
      else {
        // Matches centerMapToUser: when location can't be obtained (e.g. the
        // permission was previously denied so the OS won't show the popup again),
        // offer to open app settings instead of a dead-end error.
        this.alertService.promptOpenSettings(this.languageService.getText('messages.error.noLocationPermissions'));
      }
    } catch (e) {
      console.log("[map] onMapReady cosmetic setup error: " + e);
    }
  }

  async getSprings() {
    this.loading = true;
    if (this.springsService.filterByHotel) {
      this.hotelMarker = new Marker();
      this.hotelMarker.position = Position.positionFromLatLng(this.springsService.singleHotel.location.latitude, this.springsService.singleHotel.location.longitude);
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
      let minLatitude;
      let maxLatitude;
      if (!(springs && springs.length)) {
        this.alertService.showError(this.languageService.getText("messages.error.springNotFound"));
      } else {
        minLatitude = maxLatitude = springs[0].location._latitude;
      }
      springs.forEach(spring => {
        this.addMarker(spring);
        if (spring.location._latitude < minLatitude) {
          minLatitude = spring.location._latitude
        } else if (spring.location._latitude > maxLatitude) {
          maxLatitude = spring.location._latitude
        }

      })

      // Only recenter when we actually have springs; otherwise minLatitude /
      // maxLatitude are undefined and setting latitude to NaN crashes the map
      // SDK ("null camera target") because zoom is set without a valid target.
      const centerLatitude = minLatitude + (maxLatitude - minLatitude) / 2;
      if (isFinite(centerLatitude)) {
        this.mainMap.latitude = centerLatitude;
        this.mainMap.zoom = 9
      }
      // NativeScript's HTTP backend completes on a native thread (the response
      // fires with inAngularZone=false), and a bare zone.run did not reliably
      // trigger a change-detection tick here, so the *ngIf="loading" gif never
      // cleared. Force CD explicitly so the spinner hides once data arrives.
      this.cdr.detectChanges();
    }, err => {
      this.handleErrors(err);
      this.cdr.detectChanges();
    })
  }

  async setMyPosition() {
    this.centerMapToUser();

    if (this.mainMap.zoom < this.bigZoom) {
      this.mainMap.zoom = this.bigZoom;
    }
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
      this.alertService.promptOpenSettings(this.languageService.getText('messages.error.noLocationPermissions'));
      console.log("recieved location is NULL");
    }
  }

  centerMap(lat: number, lon: number) {
    this.mainMap.latitude = lat;
    this.mainMap.longitude = lon;
  }

  clickOnMarker(marker: Marker) {
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
    this.closeSearchBar();
  }

  coordinateLongPress(cords: any) {
    // No-op for now; bound in the template for future use.
  }

  onSearchBarLoaded(event: any) {
    if (event.object.android) {
      this.searchBar = event.object;
      event.object.android.clearFocus();
    }
  }

  addSingleSpring(spring: FlatSpring) {
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
      // HTTP response fires off Angular's zone -> force CD so the loading gif clears.
      this.cdr.detectChanges();
    }, err => {
      this.loading = false;
      this.searchBar += " ";
      this.searchBar = oldText;
      this.handleErrors(err);
      this.cdr.detectChanges();
    })
  }

  openSearchBar() {
    this.searchMode = true
    this.searchField.nativeElement.animate({ width: screen.mainScreen.widthDIPs - 20, duration: 150 });
  }

  closeSearchBar() {
    this.searchField.nativeElement.animate({ width: 0, duration: 150 }).then(() => {

      this.searchMode = false;
    });
  }

  navigateToFilters() {
    this.router.navigate(["springsFilter"]);
  }

  handleErrors(error: any) {
    this.loading = false;
    console.log(error);
    this.errorService.handleErorr(error);
  }

  public addMarker(spring: FlatSpring) {
    const marker = new Marker();
    marker.position = Position.positionFromLatLng(spring.location._latitude, spring.location._longitude);
    marker.userData = { springId: spring.id };
    const img = new Image();
    img.imageSource = ImageSource.fromFileSync("~/assets/images/fountain.png");
    marker.icon = img;
    this.mainMap.addMarker(marker);
  }

  // Handles the app being backgrounded and resumed (activity lifecycle) -- distinct
  // from page navigation, which resumeMap() handles.
  public onAndroidActivityResume(args: any) {
    if (this.mainMap && this.mainMap.nativeView && this.mainMap._context === args.activity) {
      this.mainMap.nativeView.onResume();
    }
  }

  // Resume the Google Maps GL surface after the page was hidden behind another
  // (e.g. the spring detail). This SDK only pauses/resumes the map on ACTIVITY
  // events, not page navigation, so when we come back the detached GL surface
  // stays white. onResume() alone (and camera moves) do NOT redraw it -- toggling
  // the view's visibility forces NativeScript to re-attach/re-measure it, which
  // recreates the GL drawing surface.
  private resumeMap() {
    if (!this.mainMap) {
      return;
    }
    const map: any = this.mainMap;
    if (map.nativeView && map.nativeView.onResume) {
      map.nativeView.onResume();
    }
    map.visibility = "collapse";
    setTimeout(() => {
      if (this.mainMap) {
        (this.mainMap as any).visibility = "visible";
      }
    }, 0);
  }
}
