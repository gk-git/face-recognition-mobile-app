import {Component} from '@angular/core';
import {Http, RequestOptions, Headers} from '@angular/http';

import {NavController, NavParams,  ToastController,
    LoadingController,
    Loading} from 'ionic-angular';

import {UserData} from '../../providers/user-data';
import {Api} from '../../providers/api';

/*
 Generated class for the HomePage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePagePage {

    loading: Loading;
    private OpenErrorString: string;
    private DoorOpenString: string;

    constructor(public navCtrl: NavController,private loadingCtrl: LoadingController,  public toastCtrl: ToastController,public navParams: NavParams,
                public  user: UserData, public http: Http, public api: Api) {
        this.OpenErrorString = "Unable to Open The door. Check your internet connection and try again";
        this.DoorOpenString = "The Door will be Open Soon";

    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad HomePagePage');
    }

    Click() {

        const door_key = this.user._door_key.door_key;
        let headers = new Headers({
            'content-type': 'application/x-www-form-urlencoded'
        });
        let options = new RequestOptions({
            headers: headers
        });

        console.log(door_key);

        const url: string = 'opendoor/' +door_key + '/1' ;
        // TODO: Encode the values using encodeURIComponent().
        this.showLoading();

         this.api.get(url, null,options).subscribe((resp) => {

             this.loading.dismiss();
             let toast = this.toastCtrl.create({
                 message: this.DoorOpenString,
                 duration: 3000,
                 position: 'top'
             });
             toast.present();

         }, (err) => {
             setTimeout(() => {
                 this.loading.dismiss();
             });

             // this.navCtrl.push(MainPage);
             // Unable to log in
             let toast = this.toastCtrl.create({
                 message: this.OpenErrorString,
                 duration: 3000,
                 position: 'top'
             });
             toast.present();
         })

    }

    showLoading() {

        this.loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        this.loading.present();
    }

}
