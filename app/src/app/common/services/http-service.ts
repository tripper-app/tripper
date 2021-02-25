import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { LanguageService } from './language-service';
import { User } from '../models/user';
import { connectionType, getConnectionType } from "tns-core-modules/connectivity";
import { observable, Observable, Subscriber } from 'rxjs';
import { noConnectionError } from "../models/errors/noConnectionError"
import { unRegisteredUserError } from '../models/errors/unRegisteredUserError';
import { getString } from '@nativescript/core/application-settings';
import { HotelFilters } from '../models/hotelFilters';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  ApiURL = "https://europe-west1-tripper-d0e21.cloudfunctions.net/";
  language;


  constructor(private httpClient: HttpClient, private languageService: LanguageService) {
  }


  getAllsprings(filters) {
    if (getConnectionType() == connectionType.none) {
      return this.throwNoConnection();
    }
    return this.httpClient.post(this.ApiURL + "getAllSprings", { filters: filters });
  }

  getSpringByName(springName: string) {
    if (getConnectionType() == connectionType.none) {
      return this.throwNoConnection();
    }
    return this.httpClient.get(`${this.ApiURL}getSpringByName?springName=${springName}&lang=${this.getLanguage()}`);
  }

  getspring(id: string) {
    if (getConnectionType() == connectionType.none) {
      return this.throwNoConnection();
    }
    return this.httpClient.get(this.ApiURL + `getSpring?springId=${id}&lang=${this.getLanguage()}`);
  }

  getAllHotels(filters: HotelFilters){
    if (getConnectionType() == connectionType.none) {
      return this.throwNoConnection();
    }
    return this.httpClient.post(this.ApiURL + "getAllHotels", { filters: filters });
  }

  getHotel(id: string){
    if (getConnectionType() == connectionType.none) {
      return this.throwNoConnection();
    }
    return this.httpClient.get(this.ApiURL + `getHotel?hotelId=${id}&lang=${this.getLanguage()}`);
  }

  login(user: User) {
    if (getConnectionType() == connectionType.none) {
      return this.throwNoConnection();
    }
    return this.httpClient.get(this.ApiURL + `login?email=${user.email}&password=${user.password}`);
  }

  signUp(user: User) {
    if (getConnectionType() == connectionType.none) {
      return this.throwNoConnection();
    }
    return this.httpClient.post(this.ApiURL + `signup`, user)
  }

  resetPasswordCreateCode(email) {
    if (getConnectionType() == connectionType.none) {
      return this.throwNoConnection();
    }
    return this.httpClient.get(`${this.ApiURL}resetPasswordCreateCode?email=${email}&lang=${this.getLanguage()}`)
  }

  resetPasswordRecieveCode(code, email, password) {
    if (getConnectionType() == connectionType.none) {
      return this.throwNoConnection();
    }
    return this.httpClient.post(this.ApiURL + `resetPasswordRecieveCode`, { code: code, email: email, password: password })
  }

  getEmailByFacebookToken(token) {
    if (getConnectionType() == connectionType.none) {
      return this.throwNoConnection();
    }
    return this.httpClient.get("https://graph.facebook.com/me?fields=email&access_token=" + token);
  }

  loginWithThirdPartyToken(token, thirdParty) {
    if (getConnectionType() == connectionType.none) {
      return this.throwNoConnection();
    }
    return this.httpClient.get(`${this.ApiURL}loginWithThirdParty?thirdrdParty=${thirdParty}&token=${token}`);
  }

  logoutFacebook(token) {
    if (getConnectionType() == connectionType.none) {
      return this.throwNoConnection();
    }
    return this.httpClient.get("https://www.facebook.com/logout.php?access_token=" + token)
  }

  updateProfile(base64: string) {
    if (getConnectionType() == connectionType.none) {
      return this.throwNoConnection();
    }
    const token = this.getToken();
    if (!token) {
      return this.throwUnRegisteredUser();
    }
    return this.httpClient.post(`${this.ApiURL}updateProfile`, { imageString: base64 }, {headers: {token: token}});
  }

  addComment(text: string, springId: string) {
    if (getConnectionType() == connectionType.none) {
      return this.throwNoConnection();
    }
    const token = this.getToken();
    if (!token) {
      return this.throwUnRegisteredUser();
    }
    return this.httpClient.post(`${this.ApiURL}addComment`,
      { text: text, springId: springId },
      { headers: { token: token } });
  }


  getLanguage() {
    if (!this.language) {
      this.language = this.languageService.getCurrentLanguage();
    }

    return this.language;
  }

  getToken() {
    // return getString("user-token");
    return "eyJhbGciOiJIUzI1NiJ9.b2RlZG9kZWQ3NzdAZ21haWwuY29t.-dTvSdoQ8p7yMaRMB9EMEgdKrpJnkPIhTzHAuchsrbU";
  }

  throwNoConnection() {
    return new Observable<any>((subscriber: Subscriber<any>) => {
      subscriber.error(new noConnectionError());
    });
  }

  throwUnRegisteredUser(){
    return new Observable<any>((subscriber: Subscriber<any>) => {
      subscriber.error(new unRegisteredUserError());
    })
  }
}
