import { Injectable } from '@angular/core';
import {
    TnsOAuthClient,
    configureTnsOAuth,
    ITnsOAuthTokenResult,
    TnsOAuthResponseBlock
} from "nativescript-oauth2";

import {
    TnsOaProvider,
    TnsOaProviderOptionsFacebook,
    TnsOaProviderFacebook,
    TnsOaProviderOptionsGoogle,
    TnsOaProviderGoogle
} from "nativescript-oauth2/providers";

@Injectable({
    providedIn: 'root'
})
export class OauthService {
    client: TnsOAuthClient = null;
    constructor() {
    }

    configureOAuthProviders() {
        const googleProvider = this.configureOAuthProviderGoogle();
        const facebookProvider = this.configureOAuthProviderFacebook();

        configureTnsOAuth([googleProvider, facebookProvider]);
    }

    configureOAuthProviderGoogle(): TnsOaProvider {
        const googleProviderOptions: TnsOaProviderOptionsGoogle = {
            openIdSupport: "oid-full",
            clientId:
                '658415875612-igt7tu9o8lhologkc39ers3jukr1pl01.apps.googleusercontent.com',
            redirectUri:
                'com.googleusercontent.apps.658415875612-igt7tu9o8lhologkc39ers3jukr1pl01:/auth',
            urlScheme:
                'com.googleusercontent.apps.658415875612-igt7tu9o8lhologkc39ers3jukr1pl01',
            scopes: ["email", "profile"]
        };
        const googleProvider = new TnsOaProviderGoogle(googleProviderOptions);
        return googleProvider;
    }

    configureOAuthProviderFacebook() {
        const facebookProviderOptions: TnsOaProviderOptionsFacebook = {
            openIdSupport: "oid-none",
            clientId: "680048289611186",
            clientSecret: "5d6dfb7b65f0044794312c6e3a3fa229",
            redirectUri: "https://www.facebook.com/connect/login_success.html",
            scopes: ["email"]
        }

        const facebookProvider = new TnsOaProviderFacebook(facebookProviderOptions);
        return facebookProvider;
    }

    tnsOauthLogin(providerType, successCallback, errorCallback) {
        this.client = new TnsOAuthClient(providerType, true);
        this.client.loginWithCompletion((tokenResult: ITnsOAuthTokenResult, error) => {
            if (error) {

                console.error("back to main page with error: ");
                errorCallback(error);
            } else {
                console.log("back to main page with access token: ");
                successCallback(tokenResult);
            }
        });
    }

    disConnect() {
        this.client.logoutWithCompletion((res: TnsOAuthResponseBlock, err) => {
            if (err) {
                console.log('ERROR' + err);
            } else {
                console.log('DATA' + res);
            }
        });
    }
}
