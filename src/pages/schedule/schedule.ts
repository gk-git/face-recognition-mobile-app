import {Component, ViewChild} from '@angular/core';

import{
    Events,
    AlertController,
    App,
    ToastController,
    List,
    NavController,
    LoadingController
} from 'ionic-angular';

import {Http, RequestOptions, Headers} from '@angular/http';


import {Storage} from '@ionic/storage';

import {LoginPage} from '../login/login';

/*
 To learn how to use third party libs in an
 Ionic app check out our docs here: http://ionicframework.com/docs/v2/resources/third-party-libs/
 */
// import moment from 'moment';

import {ConferenceData} from '../../providers/conference-data';
import {SessionDetailPage} from '../session-detail/session-detail';
import {UserData} from '../../providers/user-data';
import {Api} from '../../providers/api';


@Component({
    selector: 'page-schedule',
    templateUrl: 'schedule.html'
})
export class SchedulePage {
    // the list is a child of the schedule page
    // @ViewChild('scheduleList') gets a reference to the list
    // with the variable #scheduleList, `read: List` tells it to return
    // the List and not a reference to the element
    @ViewChild('scheduleList', {read: List}) scheduleList: List;

    dayIndex = 0;
    queryText = '';
    segment = 'all';
    shownSessions: any = [];
    groups: any = [];
    confDate: string;

    constructor(public events: Events,
                public alertCtrl: AlertController,
                public app: App,
                public loadingCtrl: LoadingController,
                public navCtrl: NavController,
                public confData: ConferenceData,
                public storage: Storage,
                public user: UserData,
                public api: Api,
                public http: Http,
                public toastCtrl: ToastController) {


    }

    ionViewDidLoad() {
        this.app.setTitle('History');
        this.updateSchedule();
    }

    updateSchedule() {
        // Close any open sliding items when the schedule updates


        console.log("update");


        this.confData.getTimeline(this.segment).subscribe((data: any) => {
            // console.log(data);
            if (this.confData._logoutError) {
                this.user.logout();
                this.user.clearUser();
                this.storage.clear();
                this.events.publish('user:logout');

                let toast = this.toastCtrl.create({
                    message: "An Error accrued for security reason we did sign you out",
                    duration: 3000,
                    position: 'top'
                });
                toast.present();
                this.navCtrl.setRoot(LoginPage);

            }
            this.shownSessions = data.shownSessions;

            this.groups = data.groups;
            console.log("log");
            console.log(this.groups);
        });
    }


    goToSessionDetail(sessionData: any) {
        // go to the session detail page
        // and pass in the session data
        this.navCtrl.push(SessionDetailPage, sessionData);
    }

    doRefresh(refresher: any) {
        console.log('Begin async operation', refresher);


        let headers = new Headers({
            'content-type': 'application/x-www-form-urlencoded'
        });
        let options = new RequestOptions({
            headers: headers
        });
        // TODO: Encode the values using encodeURIComponent().
        let body = 'api_token=' + this.user._apiToken + '&door_key=' + this.user._door_key.door_key;
        let seq = this.api.post('schedule', body, options).share();
        seq
            .map(res => res.json())
            .subscribe(res => {
                console.log(res);

                // If the API returned a successful response, mark the user as logged in
                if (res.success) {
                    // logic for the data update
                    // this.groups = res.data;
                    console.log("success");
                    this.confData.data = res.data;
                    this.updateSchedule();
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


        setTimeout(() => {
            console.log('Async operation has ended');
            refresher.complete();
        }, 2000);
    }




}
