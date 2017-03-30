import {Injectable} from '@angular/core';

import {Events} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {Http, RequestOptions,Headers} from '@angular/http';
import {Api} from './api';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class UserData {
    _user: any;
    _favorites: string[] = [];
    HAS_LOGGED_IN = 'hasLoggedIn';
    HAS_SEEN_TUTORIAL = 'hasSeenTutorial';

    constructor(public events: Events,
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
    login(accountInfo: any) {
        let headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded'
        });
        let options = new RequestOptions({
            headers: headers
        });
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
                    this.setUsername(res.message.name);
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



    signup(username: string): void {
        this.storage.set(this.HAS_LOGGED_IN, true);
        this.setUsername(username);
        this.events.publish('user:signup');
    };

    logout(): void {
        this.storage.remove(this.HAS_LOGGED_IN);
        this.storage.remove('username');
        this.events.publish('user:logout');
    };

    setUsername(username: string): void {
        this.storage.set('username', username);
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
}
