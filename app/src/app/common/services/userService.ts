import { Injectable } from '@angular/core';
import { HttpService } from './http-service';
import { getString, setString } from '@nativescript/core/application-settings';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    userLoggedIn = false;
    userToken = 'user_token';

    constructor(private httpService: HttpService) {
        if (getString(this.userToken)) {
            this.userLoggedIn = true;
        }
    }

    getFavoriteSprings() {
        return this.httpService.getFavoritesprings();
    }

    addFavoriteSpring(springId) {
        return this.httpService.addFavoriteSpring(springId);
    }

    removeFavoriteSpring(springId: string) {
        return this.httpService.removeFavoriteSpring(springId);
    }

    getHistorySprings() {
        return this.httpService.getHistorySprings();
    }

    login(user) {
        return this.httpService.login(user);
    }

    logOut(){
        setString(this.userToken, '');
        this.userLoggedIn = false;
    }

    signUp(user) {
        return this.httpService.signUp(user);
    }

    getUserProfile() {
        return this.httpService.getUserProfile();
    }

    changePassword(oldPassword, newPassword) {
        return this.httpService.changePassword(oldPassword, newPassword);
    }

    updateUserName(newUserName) {
        return this.httpService.updateUserName(newUserName);
    }

    resetPasswordCreateCode(email) {
        return this.httpService.resetPasswordCreateCode(email);
    }

    resetPasswordRecieveCode(code, email, password) {
        return this.httpService.resetPasswordRecieveCode(code, email, password);
    }

    updateProfilePicture(base64) {
        return this.httpService.updateProfile(base64);
    }

    removeUser() {
        return this.httpService.removeUser();
    }

    getUserPicture() {
        return getString('user_picture') ? getString('user_picture') : "https://lh3.googleusercontent.com/proxy/K7ojimeHTUDQtaSsOFMKXoCUxAjO65G42nQgibMQA26qCeizSn3MJS4Gy3sAmxJhC7MSy0dHwKDSSQYfOkzyH54VoNp3BE5ycdFlivZzN5A_M9tDPB6usAk9V6l1Oj6oDjSNJSwPdi4BZw";
    }

    setUserPicture(pic) {
        setString('user_picture', pic);
    }
}
