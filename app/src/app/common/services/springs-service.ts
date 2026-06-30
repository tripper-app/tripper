import { Injectable } from '@angular/core';
import * as geolocation from '@nativescript/geolocation';
import { CoreTypes } from "@nativescript/core";
import { HttpService } from './http-service';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { FlatSpring } from '../models/flatSpring';
import { SpringFilters } from '../models/springFilters';
import { FullSpring } from '../models/fullSpring';

type LatLng = { latitude: number; longitude: number };

@Injectable({
  providedIn: 'root'
})
export class SpringsService {
  // Pushed by the profile screen to show a single spring on the map.
  singleSpringSubject = new Subject<FlatSpring>();
  // Set by the filters screen when it applies a new search and navigates back to
  // the (still-mounted) map. The map checks this when it becomes visible again
  // (its page navigatedTo) and re-fetches. We navigate back rather than forward to
  // a new tabs page, which would create a second MapView that renders white.
  filtersChanged = false;
  currentLocation: LatLng = { latitude: 0, longitude: 0 };
  filterByHotel = false;
  singleHotel!: { id: string; location: LatLng }; // set by hotel-view before filterByHotel use
  geolocationWatching = false;
  // Cache of fully-loaded springs, keyed by the id used to open them. Loosely
  // typed because getSpring() stamps an `ID` onto the response that isn't on the model.
  savedsprings: any[] = [];
  filters!: SpringFilters; // assigned in the constructor via resetFilters()
  // True until the map has loaded once this app session, so the map can apply the
  // default search the first time it opens.
  firstMapLoad = true;

  constructor(private httpService: HttpService) {
    this.resetFilters();
  }

  // The default search: 40 km radius, no other parameters. Used on first map open
  // and anywhere we want to clear an applied filter set back to the default.
  resetFilters() {
    this.filters = new SpringFilters();
    this.filters.distance = 40;
  }

  getSprings() {
    this.filters.location = this.filterByHotel ? this.singleHotel.location : this.currentLocation;
    return this.httpService.getAllsprings(this.filters);
  }

  getSpringByName(springName: string) {
    return this.httpService.getSpringByName(springName);
  }

  getSpring(id: string): Observable<FullSpring> {
    const cached = this.savedsprings.find(s => s.ID == id);
    if (cached) {
      return new Observable<FullSpring>(subscriber => subscriber.next(cached));
    }
    return this.httpService.getspring(id).pipe(map((data: any) => {
      data.ID = id;
      this.savedsprings.push(data);
      return data;
    }));
  }

  addComment(text: string, springId: string) {
    return this.httpService.addComment(text, springId);
  }

  updateSpring(text: string, springId: string) {
    return this.httpService.updateSpring(text, springId);
  }

  showSingleSpring(spring: FlatSpring) {
    this.singleSpringSubject.next(spring);
  }

  async getLocationPermission(): Promise<boolean> {
    try {
      await geolocation.enableLocationRequest();
      if (!this.geolocationWatching) {
        geolocation.watchLocation(info => {
          this.currentLocation.latitude = info.latitude;
          this.currentLocation.longitude = info.longitude;
          this.geolocationWatching = true;
        }, error => {
          console.log("can't get location: " + error);
        }, { desiredAccuracy: CoreTypes.Accuracy.high, maximumAge: 1000, timeout: 20000 });
      }
      return true;
    } catch (error) {
      // Don't assume this is a permission denial — enableLocationRequest also
      // rejects when location services (GPS) are off, Google Play Services are
      // unavailable, or the play-services-location version is too old. Log the
      // real error so the actual cause is visible.
      console.log("ERROR! could not enable location: " + error);
      return false;
    }
  }

  async getCurrentLocation(): Promise<geolocation.Location | undefined> {
    if (!(await this.getLocationPermission())) {
      console.log("can't get location");
      return undefined;
    }

    // Prefer the last-known position: it returns immediately, avoiding the long
    // wait for a brand-new live fix (a live fix often never arrives on an emulator
    // with a static location, or on a cold GPS start indoors -> ~20s timeout).
    // timeout: 0 + no maximumAge returns the cached fix regardless of age. The
    // background watchLocation set up in getLocationPermission keeps
    // currentLocation up to date afterwards.
    try {
      const last = await geolocation.getCurrentLocation({ desiredAccuracy: CoreTypes.Accuracy.high, timeout: 0 });
      this.currentLocation.latitude = last.latitude;
      this.currentLocation.longitude = last.longitude;
      return last;
    } catch (e) {
      // No cached location (genuine cold start) -- wait for a live fix.
      console.log("no last known location, waiting for a live fix: " + e);
      try {
        const loc = await geolocation.getCurrentLocation({ desiredAccuracy: CoreTypes.Accuracy.high, timeout: 20000 });
        this.currentLocation.latitude = loc.latitude;
        this.currentLocation.longitude = loc.longitude;
        return loc;
      } catch (e2) {
        console.log("could not get any location: " + e2);
        return undefined;
      }
    }
  }
}
