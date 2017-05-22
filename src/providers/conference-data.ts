import {Injectable} from '@angular/core';

import {Http, RequestOptions, Headers} from '@angular/http';
import {Storage} from '@ionic/storage';


import {UserData} from './user-data';
import {Api} from './api';


import {
    Events,
    ToastController,
    LoadingController
} from 'ionic-angular';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';


@Injectable()
export class ConferenceData {
    data: any;
    _logoutError: boolean;
    loidings: any;
    // loiding: LoadingController;
    constructor(public http: Http,
                public events: Events,
                public toastCtrl: ToastController,
                public user: UserData,
                public loadingCtrl: LoadingController,
                public storage: Storage,
                public api: Api) {

        this.loidings = this.loadingCtrl.create({
            content: 'Please wait...'
        });
    }

    presentLoadingDefault() {


        this.loidings.present();


    }


    load(): any {
        if (this.data) {
            console.log('Getting data from object provider');

            console.log(Observable.of(this.data));
            return Observable.of(this.data);
        } else {
            console.log('Getting data from server ');
            this.loidings.present();

            let headers = new Headers({
                'content-type': 'application/x-www-form-urlencoded'
            });
            let options = new RequestOptions({
                headers: headers
            });
            // TODO: Encode the values using encodeURIComponent().
            let body = 'api_token=' + this.user._apiToken + '&door_key=' + this.user._door_key;
            let seq = this.api.post('schedule', body, options).map(this.processData, this);

            console.log('seq');
            console.log(seq);
            return seq;
            // return this.http.get('http://besmarter.site/api/v1/alldata',options)
            // .map(this.processData, this);
        }
    }

    processData(data: any) {
        // just some good 'ol JS fun with objects and arrays
        // build up the data by linking speakers to sessions

        this.data = data.json();


        if (this.data.success) {
            this._logoutError = false;
            this.data = this.data.data;
            return this.data;
        }
        else {
            this._logoutError = true;


            // this.user.logout();
            // this.storage.clear();
            // this.nav.setRoot(LoginPage);

            if (this.data.error.code == 200) {

            }
            this.data = this.data.data;

        }


        return this.data;
    }

    getTimeline(segment = 'all') {
        return this.load().map((data: any) => {
            this.loidings.dismiss();
            if (data) {

                console.log('timeline');
                console.log(this.data);
            } else {

            }
            let day = data.schedule;
            day.shownSessions = 0;



            let counter = 0;
            day.groups.forEach((group: any) => {

                const oneDay = 24*60*60*1000;
                const time_1 =Math.abs((new Date().getTime() -new Date(group.dates.date).getTime())/(oneDay));


                console.log("time 1");
                console.log(time_1);
                group.hide = true;
                if ( segment != "all" && time_1 > 1) {
                    return day;
                }
                counter++;

                group.sessions.forEach((session: any) => {
                    // check if this session should show or not


                    if (!session.hide) {
                        // if this session is not hidden then this group should show
                        group.hide = false;
                        day.shownSessions++;
                    }
                });

            });


            return day;
        });
    }


    getUsers() {
        return this.load().map((data: any) => {
            this.loidings.dismiss();
            if (data) {

            } else {

            }

            return data.users;
        });
    }


    getMap() {

        return this.load().map((data: any) => {
            this.loidings.dismiss();
            if (data) {
            } else {

            }

            return data.map;
        });
    }

    clear() {
        this.data = null;
        this._logoutError = false;
    }

}
