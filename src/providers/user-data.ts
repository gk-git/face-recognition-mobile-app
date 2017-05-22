import {Injectable} from '@angular/core';

import {Events} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {Http, RequestOptions, Headers} from '@angular/http';
import {Api} from './api';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import {
    NavController,
    ToastController,
    MenuController,
    LoadingController,
    Loading
} from 'ionic-angular';
import {
    Push,
    PushToken
} from '@ionic/cloud-angular';
@Injectable()
export class UserData {
    _user: any;
    _door_key: any;
    _role_id: any;
    _favorites: string[] = [];
    _data: any;
    _apiToken: any;
    HAS_LOGGED_IN = 'hasLoggedIn';
    HAS_SEEN_TUTORIAL = 'hasSeenTutorial';

    constructor(public events: Events, public push: Push, public toastCtrl: ToastController,
                public storage: Storage, public http: Http, public api: Api) {
    }

    /**
     * Send a POST request to our login endpoint with the data
     * the user entered on the form.
     */
    logins(username: string): void {
        this.storage.set(this.HAS_LOGGED_IN, true);
        this.setUsername(username);
        this.events.publish('user:login');
    };

    async  login(accountInfo: any) {
        let headers = new Headers({
            'content-type': 'application/x-www-form-urlencoded'
        });
        let options = new RequestOptions({
            headers: headers
        });

        try {
            await  this.push.register().then((t: PushToken) => {
                return this.push.saveToken(t);
            }).then((t: PushToken) => {
                console.log('Token saved:', t.token);
                alert(t.token);
            });
        } catch (e) {
            let errorMessage = this.toastCtrl.create({
                message: "Text message didn't send!",
                duration: 3000,
                position: 'top'
            });

            errorMessage.present();
        }
        // TODO: Encode the values using encodeURIComponent().
        let body = 'email=' + accountInfo.email + '&password=' + accountInfo.password;
        let seq = this.api.post('login', body, options).share();

        seq
            .map(res => res.json())
            .subscribe(res => {

                console.log(res);
                // If the API returned a successful response, mark the user as logged in
                if (res.success) {
                    // logic for the login

                    this.storage.set(this.HAS_LOGGED_IN, true);
                    this._user = res.message;
                    this._apiToken = res.message.api_token;
                    this._door_key = res.message.door_key;
                    this._role_id = res.message.role_id;
                    this.setUsername(res.message.name);
                    this._data = res.data;
                    this.events.publish('user:login');
                } else {
                }
            }, err => {
                console.error('ERROR', err);
            });

        return seq;
    }


    hasFavorite(sessionName: string): boolean {
        return (this._favorites.indexOf(sessionName) > -1);
    };

    addFavorite(sessionName: string): void {
        this._favorites.push(sessionName);
    };

    removeFavorite(sessionName: string): void {
        let index = this._favorites.indexOf(sessionName);
        if (index > -1) {
            this._favorites.splice(index, 1);
        }
    };


    logout(): void {
        this.storage.remove(this.HAS_LOGGED_IN);
        this.storage.remove('username');
        this.events.publish('user:logout');
    };

    setUsername(username: string): void {
        this.storage.set('username', username);
    };

    setUsernames(username: string): Promise<any> {
        return this.storage.set('username', username);
    };

    getUsername(): Promise<string> {
        return this.storage.get('username').then((value) => {
            return value;
        });
    };

    hasLoggedIn(): Promise<boolean> {
        return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
            return value === true;
        });
    };

    checkHasSeenTutorial(): Promise<string> {
        return this.storage.get(this.HAS_SEEN_TUTORIAL).then((value) => {
            return value;
        });
    };

    clearUser() {
        /* _user: any;
         _door_key: any;
         _role_id: any;
         _favorites: string[] = [];
         _data: any;
         HAS_LOGGED_IN = 'hasLoggedIn';*/

        this._user = null;
        this._door_key = null;
        this._role_id = null;
        this._favorites = null;
        this._data = null;
    }
}
