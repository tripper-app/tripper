import { Injectable } from '@angular/core';
import { HttpService } from './http-service';
import { Observable, Subject, Subscriber } from 'rxjs';
import { FlatHotel } from '../models/flatHotel';
import { HotelFilters } from '../models/hotelFilters';
import { FullHotel } from '../models/fullHotel';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HotelsService {
  private hotelsSubject: Subject<FlatHotel[]> = new Subject<FlatHotel[]>();;
  waitingForResponse: Subject<boolean> = new Subject();
  savedHotels: any[] = [];
  filters: HotelFilters;

  constructor(private httpService: HttpService) {
    this.filters = new HotelFilters();
  }

  setFilters(filters: HotelFilters){
    this.filters = filters;
  }

  getHotelsSubject() {
    return this.hotelsSubject;
  }

  getHotels(){
    return this.httpService.getAllHotels(this.filters);
  }

  getHotel(id: string) {
    const hotel = this.savedHotels.find(h => h.ID == id);
    if (hotel) {
      return new Observable<FullHotel>((subscriber: Subscriber<FullHotel>) => {
        subscriber.next(hotel)
      });
    }
    else {
      const hotelMap = map((data: any) => {
        data.ID = id;
        this.savedHotels.push(data)
        return data;
      }, error => {
        console.log(error);
        throw error;
      })
      return hotelMap(this.httpService.getHotel(id))
    }
  }

  // updateHotels(filters: HotelFilters = undefined) {
    
  //   this.waitingForResponse.next();
  //   // if (!filters) {
  //   //   filters = new Filters();
  //   //   filters.distance = 25;
  //   // }


  //   this.httpService.getAllHotels(filters).subscribe((res: FlatHotel[]) => {
  //     this.hotelsSubject.next(res);
  //   }, error => {      
  //     this.hotelsSubject.error(error);
  //   })
  // }
}
