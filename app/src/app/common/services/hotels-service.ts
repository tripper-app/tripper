import { Injectable } from '@angular/core';
import { HttpService } from './http-service';
import { Observable, Subscriber } from 'rxjs';
import { HotelFilters } from '../models/hotelFilters';
import { FullHotel } from '../models/fullHotel';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HotelsService {
  savedHotels: any[] = [];
  filteredHotels = [];
  filters: HotelFilters;
  //showList = false;

  constructor(private httpService: HttpService) {
    this.filters = new HotelFilters();
  }

  setFilters(filters: HotelFilters) {
    this.filters = filters;
  }

  getHotels() {
      const hotelsMap = map((data: any) => {
        this.filteredHotels = data;
        return data;
    }, error => {
        console.log(error);
        throw error;
    })
      return hotelsMap(this.httpService.getAllHotels(this.filters));
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
}
