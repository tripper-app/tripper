import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { LanguageService } from './language-service';
import { User } from '../models/user';
import { connectionType, getConnectionType } from "tns-core-modules/connectivity";
import { Observable, Subscriber } from 'rxjs';
import { noConnectionError } from "../models/errors/noConnectionError"

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

  getspring(id: string) {
    if (getConnectionType() == connectionType.none) {
      return this.throwNoConnection();
    }
    return this.httpClient.get(this.ApiURL + `getSpring?springId=${id}&lang=${this.getLanguage()}`);
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
    return this.httpClient.get("https://graph.facebook.com/me?fields=email&access_token=" + token);
  }

  loginWithThirdPartyToken(token, thirdParty) {
    debugger
    return this.httpClient.get(`${this.ApiURL}loginWithThirdParty?thirdrdParty=${thirdParty}&token=${token}`);
  }

  logoutFacebook(token) {
    return this.httpClient.get("https://www.facebook.com/logout.php?access_token=" + token)
  }

  updateProfile(base64: string) {
    return this.httpClient.post(`${this.ApiURL}updateProfile`, { imageString: base64 });
  }

  addComment(text: string, springId: string) {
    return this.httpClient.post(`${this.ApiURL}addComment`, 
    { text: text, springId: springId }, 
    { headers: { token: this.getToken() }} );
  }


  getLanguage() {
    if (!this.language) {
      this.language = this.languageService.getCurrentLanguage();
    }

    return this.language;
  }

  getToken(){
    // to do
    return "eyJhbGciOiJIUzI1NiJ9.b2RlZG9kZWQ3NzdAZ21haWwuY29t.nK5HgSFmJeubse_ye4hGYjmk-5ykMpGnv7DnwkNxM6M";
  }

  throwNoConnection() {
    return new Observable<any>((subscriber: Subscriber<any>) => {
      const er = new noConnectionError();
      subscriber.error(er);
    });
  }
}
