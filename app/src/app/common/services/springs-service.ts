import { Injectable } from '@angular/core';
import * as geolocation from "nativescript-geolocation";
import { Accuracy } from "tns-core-modules/ui/enums";
import { HttpService } from './http-service';
import { Observable, Subject, Subscriber } from 'rxjs';
import { FlatSpring } from '../models/flatSpring';
import { SpringFilters } from '../models/springFilters';
import { FullSpring } from '../models/fullSpring';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SpringsService {
  private springsSubject: Subject<FlatSpring[]> = new Subject<FlatSpring[]>();;
  singleSpringSubject: Subject<string> = new Subject();
  currentLocation = { latitude: 0, longitude: 0 }
  filterByHotel = false;
  singleHotel;
  geolocationWatching = false;
  geoWatchingEvent: Function;
  savedsprings: any[] = [];
  filters: SpringFilters;
  loadMap = false;

  constructor(private httpService: HttpService) {
    this.filters = new SpringFilters();
    this.filters.distance = 40;
  }

  setFilters(filers: SpringFilters){
    this.filters = filers;
  }

  getSprings(){
    this.filters.location = this.filterByHotel? this.singleHotel.location : this.currentLocation;
    
    return this.httpService.getAllsprings(this.filters);
  }

  getSpringsSubject() {
    return this.springsSubject;
  }

  getSpringByName(springName: string){
    return this.httpService.getSpringByName(springName);
  }

  updateSprings(filters: SpringFilters = undefined) {
    
    // this.waitingForResponse.next();
    // if (!filters) {
    //   filters = new SpringFilters();
    //   filters.distance = 25;
    // }

    filters.location = this.currentLocation;
    return this.httpService.getAllsprings(filters);
    // this.httpService.getAllsprings(filters).subscribe((res: FlatSpring[]) => {
    //   this.springsSubject.next(res);
    // }, error => {      
    //   this.springsSubject.error(error);
    // })
  }

  getSpring(id: string) {
    const spring = this.savedsprings.find(p => p.ID == id);
    if (spring) {
      return new Observable<FullSpring>((subscriber: Subscriber<FullSpring>) => {
        subscriber.next(spring)
      });
    }
    else {
      const springMap = map((data: any) => {
        data.ID = id;
        this.savedsprings.push(data)
        return data;
      }, error => {
        console.log(error);
        throw error;
      })
      return springMap(this.httpService.getspring(id))
    }
  }

  addComment(text: string, springId: string){
    return this.httpService.addComment(text, springId);
  }

  updateSpring(text: string, springId: string){
    return this.httpService.updateSpring(text, springId);
  }

  showSingleSpring(spring){    
    this.singleSpringSubject.next(spring);
  }



  async getLocationPermission() {
    try {
      await geolocation.enableLocationRequest();
      if (!this.geolocationWatching) {
        geolocation.watchLocation(info => {
          this.currentLocation.latitude = info.latitude;
          this.currentLocation.longitude = info.longitude;
          if (this.geoWatchingEvent) {
            this.geoWatchingEvent();
          }
          this.geolocationWatching = true;
        }, error => {
          debugger
          console.log(error);
          console.log("can't get location")
        }, { desiredAccuracy: Accuracy.high, maximumAge: 1000, timeout: 20000 });
      }
      return true;
    } catch (error) {
       console.log("ERROR! " + "did not recieved permissions");
      // alert("כדי שהאפליקציה תפעל בצורה מיטבית נא אשרו הרשאות מיקום");
      return false;
    }
  }

  async getCurrentLocation() {
    if (await this.getLocationPermission()) {
      return geolocation.getCurrentLocation({ desiredAccuracy: Accuracy.high, maximumAge: 1000, timeout: 20000 }).then(loc => {
        this.currentLocation.latitude = loc.latitude;
        this.currentLocation.longitude = loc.longitude;
        return loc;
      }).catch(e => {
        console.log("can't get location " + e);
      })
    } else {
      console.log("can't get location");
      return undefined;
    }
  }

  setGeoWatchingEvent(task: Function) {
    this.geoWatchingEvent = task;
  }
}
