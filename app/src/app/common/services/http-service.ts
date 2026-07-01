import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { LanguageService } from './language-service';
import { User } from '../models/user';
import { connectionType, getConnectionType } from "@nativescript/core/connectivity";
import { Observable, Subscriber } from 'rxjs';
import { noConnectionError } from "../models/errors/noConnectionError";
import { getString } from '@nativescript/core/application-settings';
import { HotelFilters } from '../models/hotelFilters';
import { SpringFilters } from '../models/springFilters';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  ApiURL = "https://europe-west1-tripper-d0e21.cloudfunctions.net/";

  constructor(private httpClient: HttpClient, private languageService: LanguageService) {
  }

  // --- Springs ---

  getAllsprings(filters: SpringFilters) {
    return this.post("getAllSprings", { filters });
  }

  getSpringByName(springName: string) {
    return this.get(`getSpringByName?springName=${springName}&lang=${this.getLanguage()}`);
  }

  getspring(id: string) {
    return this.get(`getSpring?springId=${id}&lang=${this.getLanguage()}`, true);
  }

  addComment(text: string, springId: string) {
    return this.post("addComment", { text, springId }, true);
  }

  updateSpring(text: string, springId: string) {
    return this.get(`updateSpring?text=${text}&spring=${springId}`, true);
  }

  getFavoritesprings() {
    return this.get(`getFavoriteSprings?lang=${this.getLanguage()}`, true);
  }

  getHistorySprings() {
    return this.get(`getHistorySprings?lang=${this.getLanguage()}`, true);
  }

  addFavoriteSpring(springId: string) {
    return this.post("addFavoriteSpring", { springId }, true);
  }

  removeFavoriteSpring(springId: string) {
    return this.post("removeFavoriteSpring", { springId }, true);
  }

  // --- Hotels ---

  getAllHotels(filters: HotelFilters) {
    return this.post(`getAllHotels?lang=${this.getLanguage()}`, { filters });
  }

  getHotel(id: string) {
    return this.get(`getHotel?hotelId=${id}&lang=${this.getLanguage()}`);
  }

  // --- Account ---

  login(user: User) {
    return this.get(`login?email=${user.email}&password=${user.password}`);
  }

  signUp(user: User) {
    return this.post("signUp", user);
  }

  loginWithThirdPartyToken(token: string, thirdParty: string) {
    // NOTE: `thirdrdParty` is a typo in the backend contract -- kept on purpose.
    return this.get(`loginWithThirdParty?thirdrdParty=${thirdParty}&token=${token}`);
  }

  resetPasswordCreateCode(email: string) {
    return this.get(`resetPasswordCreateCode?email=${email}&lang=${this.getLanguage()}`);
  }

  resetPasswordRecieveCode(code: string, email: string, password: string) {
    return this.post("resetPasswordRecieveCode", { code, email, password });
  }

  // --- Profile ---

  getUserProfile() {
    return this.get("getUserProfile", true);
  }

  updateUserName(newUserName: string) {
    return this.post("updateUserName", { newUserName }, true);
  }

  changePassword(oldPassword: string, newPassword: string) {
    return this.post("changePassword", { newPassword, oldPassword }, true);
  }

  updateProfile(base64: string) {
    return this.post("updateProfile", { imageString: base64 }, true);
  }

  removeUser() {
    return this.get("removeUser", true);
  }

  // --- Games ---

  getKahoot() {
    return this.get(`getKahoot?lang=${this.getLanguage()}`);
  }

  getTriviaSubjects() {
    return this.get(`getTriviaSubjects?lang=${this.getLanguage()}`);
  }

  getTriviaQuestions(triviaIds: string[]) {
    return this.post(`getTriviaQuestions?lang=${this.getLanguage()}`, { triviaIds });
  }

  getBingoItems() {
    return this.get(`getBingoItems?lang=${this.getLanguage()}`);
  }

  getLocations() {
    return this.get(`getLocations?lang=${this.getLanguage()}`);
  }

  setHighScore(quiz: string, score: number) {
    return this.get(`setHighScore?quiz=${quiz}&score=${score}`, true);
  }

  getHighScore(quiz: string) {
    return this.get(`getHighScore?quiz=${quiz}`, true);
  }

  // --- Misc ---

  // Intentionally not guarded by a connection check (matches existing behaviour).
  getNotification(messageTime: string | number) {
    return this.httpClient.get<any>(this.ApiURL + `getNotification?lang=${this.getLanguage()}&messageTime=${messageTime}`);
  }

  // --- Internals ---

  private get<T = any>(path: string, auth = false): Observable<T> {
    if (getConnectionType() === connectionType.none) {
      return this.throwNoConnection();
    }
    return auth
      ? this.httpClient.get<T>(this.ApiURL + path, this.getTokenHeaders())
      : this.httpClient.get<T>(this.ApiURL + path);
  }

  private post<T = any>(path: string, body: any, auth = false): Observable<T> {
    if (getConnectionType() === connectionType.none) {
      return this.throwNoConnection();
    }
    return auth
      ? this.httpClient.post<T>(this.ApiURL + path, body, this.getTokenHeaders())
      : this.httpClient.post<T>(this.ApiURL + path, body);
  }

  getLanguage() {
    return this.languageService.currentLanguage;
  }

  getToken() {
    return getString("user_token");
  }

  getTokenHeaders(): { headers?: { access_token: string } } {
    const token = this.getToken();
    return token ? { headers: { access_token: token } } : {};
  }

  throwNoConnection(): Observable<any> {
    return new Observable<any>((subscriber: Subscriber<any>) => {
      subscriber.error(new noConnectionError(this.languageService.getText('messages.error.connectionError')));
    });
  }
}
