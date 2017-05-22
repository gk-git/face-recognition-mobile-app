import {Component} from '@angular/core';

import{
    Events,
    ToastController,
    NavController,
    NavParams
} from 'ionic-angular';
import  {Api} from '../../providers/api';
import {RequestOptions, Headers} from '@angular/http';

import {Storage} from '@ionic/storage';

import {LoginPage} from '../login/login';

import {ConferenceData} from '../../providers/conference-data';
import {UserData} from '../../providers/user-data';

/*
 Generated class for the UserDetail page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-user-detail',
    templateUrl: 'user-detail.html'
})
export class UserDetailPage {
    user: any;
    userData: any;
    pasts: any;
    pasts_available: boolean;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public api: Api,
                public storage: Storage,
                public confData: ConferenceData,
                public toastCtrl: ToastController,
                public userDatas: UserData,
                public events: Events) {
        this.pasts_available= false;
        this.user = this.navParams.data.user;
        let headers = new Headers({
            'content-type': 'application/x-www-form-urlencoded'
        });
        let options = new RequestOptions({
            headers: headers
        });
        // TODO: Encode the values using encodeURIComponent().
        let body = 'api_token=' + this.userDatas._apiToken + '&door_key=' + this.user._door_key;
        let seq = this.api.post('userdata', body, options).share();

        seq
            .map(res => res.json())
            .subscribe(res => {
                console.log(res);

                // If the API returned a successful response, mark the user as logged in
                if (res.success) {
                    // logic for the login
                    this.pasts = res.data;

                } else {
                    this.user.logout();
                    this.storage.clear();
                    this.user.clearUser();
                    this.confData.clear();
                    this.events.publish('user:logout');

                    let toast = this.toastCtrl.create({
                        message: "An Error accrued for security reason we did sign you out.",
                        duration: 3000,
                        position: 'top'
                    });
                    toast.present();
                    this.navCtrl.setRoot(LoginPage);
                }
            }, err => {
                this.user.logout();
                this.storage.clear();
                this.user.clearUser();
                this.confData.clear();
                this.events.publish('user:logout');

                let toast = this.toastCtrl.create({
                    message: "An Error accrued for security reason we did sign you out Try to check your internet and try again",
                    duration: 3000,
                    position: 'top'
                });
                toast.present();
                this.navCtrl.setRoot(LoginPage);
                console.error('ERROR', err);
            });


    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad UserDetailPage');
    }

}
