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
    //const token = this.getToken();
    // if (!token) {
    //   return this.throwUnRegisteredUser();
    // }    
    return this.httpClient.get(this.ApiURL + `getFavoriteSprings?lang=${this.getLanguage()}`, this.getTokenHeaders());
  }

  addFavoriteSpring(springId: string) {
    if (getConnectionType() == connectionType.none) {
      return this.throwNoConnection();
    }
    // const token = this.getToken();
    // if (!token) {
    //   return this.throwUnRegisteredUser();
    // }

    return this.httpClient.post(this.ApiURL + `addFavoriteSpring`, { springId: springId }, this.getTokenHeaders());
  }

  removeFavoriteSpring(springId) {
    if (getConnectionType() == connectionType.none) {
      return this.throwNoConnection();
    }
    // const token = this.getToken();
    // if (!token) {
    //   return this.throwUnRegisteredUser();
    // }

    return this.httpClient.post(this.ApiURL + `removeFavoriteSpring`, { springId: springId }, this.getTokenHeaders());
  }

  getHistorySprings() {
    if (getConnectionType() == connectionType.none) {
      return this.throwNoConnection();
    }
    // const token = this.getToken();
    // if (!token) {
    //   return this.throwUnRegisteredUser();
    // }
    return this.httpClient.get(this.ApiURL + `getHistorySprings?lang=${this.getLanguage()}`, this.getTokenHeaders());
  }

  getspring(id: string) {
    if (getConnectionType() == connectionType.none) {
      return this.throwNoConnection();
    }

    return this.httpClient.get(this.ApiURL + `getSpring?springId=${id}&lang=${this.getLanguage()}`, this.getTokenHeaders());
  }

  getAllHotels(filters: HotelFilters) {
    if (getConnectionType() == connectionType.none) {
      return this.throwNoConnection();
    }
    return this.httpClient.post(this.ApiURL + `getAllHotels?lang=${this.getLanguage()}`, { filters: filters });
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
    return this.httpClient.post(this.ApiURL + `signUp`, user);
  }

  getUserProfile() {
    if (getConnectionType() == connectionType.none) {
      return this.throwNoConnection();
    }
    // const token = this.getToken();
    // if (!token) {
    //   return this.throwUnRegisteredUser();
    // }

    return this.httpClient.get(`${this.ApiURL}getUserProfile`, this.getTokenHeaders());
  }

  updateUserName(newUserName) {
    if (getConnectionType() == connectionType.none) {
      return this.throwNoConnection();
    }
    // const token = this.getToken();
    // if (!token) {
    //   return this.throwUnRegisteredUser();
    // }

    return this.httpClient.post(`${this.ApiURL}updateUserName`, { newUserName: newUserName }, this.getTokenHeaders());
  }

  changePassword(oldPassword, newPassword) {
    if (getConnectionType() == connectionType.none) {
      return this.throwNoConnection();
    }
    // const token = this.getToken();
    // if (!token) {
    //   return this.throwUnRegisteredUser();
    // }

    return this.httpClient.post(`${this.ApiURL}changePassword`, { newPassword: newPassword, oldPassword: oldPassword }, this.getTokenHeaders());
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
    // const token = this.getToken();
    // if (!token) {
    //   return this.throwUnRegisteredUser();
    // }
    return this.httpClient.post(`${this.ApiURL}updateProfile`, { imageString: base64 }, this.getTokenHeaders());
  }

  addComment(text: string, springId: string) {
    if (getConnectionType() == connectionType.none) {
      return this.throwNoConnection();
    }
    // const token = this.getToken();
    // if (!token) {
    //   return this.throwUnRegisteredUser();
    // }
    return this.httpClient.post(`${this.ApiURL}addComment`,
      { text: text, springId: springId },
      this.getTokenHeaders());
  }

  updateSpring(text, springId) {
    if (getConnectionType() == connectionType.none) {
      return this.throwNoConnection();
    }
    // const token = this.getToken();
    // if (!token) {
    //   return this.throwUnRegisteredUser();
    // }

    return this.httpClient.get(`${this.ApiURL}updateSpring?text=${text}&spring=${springId}`, this.getTokenHeaders());
  }

  getKahoot() {
    if (getConnectionType() == connectionType.none) {
      return this.throwNoConnection();
    }

    return this.httpClient.get(this.ApiURL + `getKahoot?lang=${this.getLanguage()}`);
  }

  getTriviaSubjects() {
    if (getConnectionType() == connectionType.none) {
      return this.throwNoConnection();
    }

    return this.httpClient.get(this.ApiURL + `getTriviaSubjects?lang=${this.getLanguage()}`);
  }

  getTriviaQuestions(triviaIds) {
    if (getConnectionType() == connectionType.none) {
      return this.throwNoConnection();
    }

    return this.httpClient.post(this.ApiURL + `getTriviaQuestions?lang=${this.getLanguage()}`, { triviaIds: triviaIds });
  }

  getBingoItems() {
    if (getConnectionType() == connectionType.none) {
      return this.throwNoConnection();
    }

    return this.httpClient.get(this.ApiURL + `getBingoItems?lang=${this.getLanguage()}`);
  }

  getLocations() {
    if (getConnectionType() == connectionType.none) {
      return this.throwNoConnection();
    }
    return this.httpClient.get(this.ApiURL + `getLocations?lang=${this.getLanguage()}`);
  }

  getNotification(messageTime) {
    return this.httpClient.get(this.ApiURL + `getNotification?lang=${this.getLanguage()}&messageTime=${messageTime}`);
  }

  setHighScore(quiz: string, score: number) {
    if (getConnectionType() == connectionType.none) {
      return this.throwNoConnection();
    }

    return this.httpClient.get(`${this.ApiURL}setHighScore?quiz=${quiz}&score=${score}`, this.getTokenHeaders());
  }

  getHighScore(quiz: string) {
    if (getConnectionType() == connectionType.none) {
      return this.throwNoConnection();
    }    
    return this.httpClient.get(`${this.ApiURL}getHighScore?quiz=${quiz}`, this.getTokenHeaders());
  }



  getLanguage() {
    //if (!this.language) {
    return this.languageService.currentLanguage;
    //}

    // return this.language;
  }

  getToken() {
    return getString("user_token");
    // return "eyJhbGciOiJIUzI1NiJ9.b2RlZG9kZWQ3NzdAZ21haWwuY29t.-dTvSdoQ8p7yMaRMB9EMEgdKrpJnkPIhTzHAuchsrbU";
  }

  getTokenHeaders(): any {
    const token = this.getToken();
    return token ? { headers: { access_token: token } } : "";
  }

  throwNoConnection() {
    return new Observable<any>((subscriber: Subscriber<any>) => {
      subscriber.error(new noConnectionError(this.languageService.getText('messages.error.connectionError')));
    });
  }

  throwUnRegisteredUser() {
    return new Observable<any>((subscriber: Subscriber<any>) => {
      subscriber.error(new unRegisteredUserError(this.languageService.getText('messages.error.unRegisteredUser')));
    })
  }
}
