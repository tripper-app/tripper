import { Injectable, OnInit } from '@angular/core';
import { HttpService } from './http-service';
import { getString } from '@nativescript/core/application-settings';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    showProfile = false;

    constructor(private httpService: HttpService) {        
        if (getString('user_token')) {
            this.showProfile = true;
        }
    }

    login(user){
        return this.httpService.login(user);
    }

    signUp(user){
        return this.httpService.signUp(user);
    }

    resetPasswordCreateCode(email){
        return this.httpService.resetPasswordCreateCode(email);
    }

    resetPasswordRecieveCode(code, email, password){
        return this.httpService.resetPasswordRecieveCode(code, email, password);
    }
}
