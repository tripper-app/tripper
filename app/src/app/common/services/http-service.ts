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

  getFavoritesprings() {
    if (getConnectionType() == connectionType.none) {
      return this.throwNoConnection();
    }
    const token = this.getToken();
    if (!token) {
      return this.throwUnRegisteredUser();
    }
    return this.httpClient.get(this.ApiURL + "getFavoriteSprings", { headers: { token: token } });
  }

  addFavoriteSpring(springId: string) {
    if (getConnectionType() == connectionType.none) {
      return this.throwNoConnection();
    }
    const token = this.getToken();
    if (!token) {
      return this.throwUnRegisteredUser();
    }

    return this.httpClient.post(this.ApiURL + `addFavoriteSpring`, { springId: springId }, { headers: { access_token: token } });
  }

  removeFavoriteSpring(springId) {
    if (getConnectionType() == connectionType.none) {
      return this.throwNoConnection();
    }
    const token = this.getToken();
    if (!token) {
      return this.throwUnRegisteredUser();
    }

    return this.httpClient.post(this.ApiURL + `removeFavoriteSpring`, { springId: springId }, { headers: { access_token: token } });
  }

  getHistorySprings() {
    if (getConnectionType() == connectionType.none) {
      return this.throwNoConnection();
    }
    const token = this.getToken();
    if (!token) {
      return this.throwUnRegisteredUser();
    }
    return this.httpClient.get(this.ApiURL + "getHistorySprings", { headers: { token: token } });
  }

  getspring(id: string) {
    if (getConnectionType() == connectionType.none) {
      return this.throwNoConnection();
    }
    const token = this.getToken();
    if (!token) {
      return this.throwUnRegisteredUser();
    }

    return this.httpClient.get(this.ApiURL + `getSpring?springId=${id}&lang=${this.getLanguage()}`, { headers: { access_token: token } });
  }

  getAllHotels(filters: HotelFilters) {
    if (getConnectionType() == connectionType.none) {
      return this.throwNoConnection();
    }
    return this.httpClient.post(this.ApiURL + "getAllHotels", { filters: filters });
  }

  getHotel(id: string) {
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

  getUserProfile() {
    if (getConnectionType() == connectionType.none) {
      return this.throwNoConnection();
    }
    const token = this.getToken();
    if (!token) {
      return this.throwUnRegisteredUser();
    }

    return this.httpClient.get(`${this.ApiURL}getUserProfile`, { headers: { access_token: token } });
  }

  updateUserName(newUserName) {
    if (getConnectionType() == connectionType.none) {
      return this.throwNoConnection();
    }
    const token = this.getToken();
    if (!token) {
      return this.throwUnRegisteredUser();
    }

    return this.httpClient.post(`${this.ApiURL}updateUserName`, { newUserName: newUserName }, { headers: { access_token: token } });
  }

  changePassword(oldPassword, newPassword) {
    if (getConnectionType() == connectionType.none) {
      return this.throwNoConnection();
    }
    const token = this.getToken();
    if (!token) {
      return this.throwUnRegisteredUser();
    }

    return this.httpClient.post(`${this.ApiURL}changePassword`, { newPassword: newPassword, oldPassword: oldPassword }, { headers: { access_token: token } });
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
    return this.httpClient.post(`${this.ApiURL}updateProfile`, { imageString: base64 }, { headers: { access_token: token } });
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

  updateSpring(text, springId) {
    if (getConnectionType() == connectionType.none) {
      return this.throwNoConnection();
    }
    const token = this.getToken();
    if (!token) {
      return this.throwUnRegisteredUser();
    }

    return this.httpClient.get(`${this.ApiURL}updateSpring?text=${text}&spring=${springId}`, { headers: { access_token: token } });
  }

  getKahoot() {
    if (getConnectionType() == connectionType.none) {
      return this.throwNoConnection();
    }
    const token = this.getToken();
    if (!token) {
      return this.throwUnRegisteredUser();
    }

    return this.httpClient.get(this.ApiURL + `getKahoot?lang=${this.getLanguage()}`, { headers: { access_token: token } });
  }

  getTriviaSubjects() {
    if (getConnectionType() == connectionType.none) {
      return this.throwNoConnection();
    }
    const token = this.getToken();
    if (!token) {
      return this.throwUnRegisteredUser();
    }

    return this.httpClient.get(this.ApiURL + `getTriviaSubjects?lang=${this.getLanguage()}`, { headers: { access_token: token } });
  }

  getTriviaQuestions(triviaIds) {
    if (getConnectionType() == connectionType.none) {
      return this.throwNoConnection();
    }
    const token = this.getToken();

    return this.httpClient.post(this.ApiURL + `getTriviaQuestions?lang=${this.getLanguage()}`, { triviaIds: triviaIds }, { headers: { access_token: token } });
  }

  getBingoItems() {
    if (getConnectionType() == connectionType.none) {
      return this.throwNoConnection();
    }
    const token = this.getToken();
    // if (!token) {
    //   return this.throwUnRegisteredUser();
    // }

    return this.httpClient.get(this.ApiURL + `getBingoItems?lang=${this.getLanguage()}`, { headers: { access_token: token } });
  }

  getLocations() {
    if (getConnectionType() == connectionType.none) {
      return this.throwNoConnection();
    }
    const token = this.getToken();
    return this.httpClient.get(this.ApiURL + `getLocations?lang=${this.getLanguage()}`, { headers: { access_token: token } });
  }

  getNotification(messageTime) {
    return this.httpClient.get(this.ApiURL + `getNotification?lang=${this.getLanguage()}&messageTime=${messageTime}`);
  }

  setHighScore(quiz: string, score: number) {
    if (getConnectionType() == connectionType.none) {
      return this.throwNoConnection();
    }

    const token = this.getToken();
    if (!token) {
      return this.throwUnRegisteredUser();
    }

    return this.httpClient.get(`${this.ApiURL}setHighScore?quiz=${quiz}&score=${score}`, { headers: { access_token: token } });
  }

  getHighScore(quiz: string) {
    if (getConnectionType() == connectionType.none) {
      return this.throwNoConnection();
    }
    const token = this.getToken();
    if (!token) {
      return this.throwUnRegisteredUser();
    }

    return this.httpClient.get(`${this.ApiURL}getHighScore?quiz=${quiz}`, { headers: { access_token: token } });
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

  throwUnRegisteredUser() {
    return new Observable<any>((subscriber: Subscriber<any>) => {
      subscriber.error(new unRegisteredUserError());
    })
  }
}
