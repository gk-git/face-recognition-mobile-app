import { Component } from '@angular/core';

import { ActionSheet, NavController ,NavParams} from 'ionic-angular';

import { ConferenceData } from '../../providers/conference-data';

import { UserDetailPage } from '../user-detail/user-detail';
/*
  Generated class for the UserList page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-user-list',
  templateUrl: 'user-list.html'
})
export class UserListPage {

  actionSheet: ActionSheet;
  users: any[] = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public confData: ConferenceData) {}
  ionViewDidLoad() {
    this.confData.getUsers().subscribe((speakers: any[]) => {
      this.users = speakers;
    });
  }


  goToUserDetail(user: any) {
    this.navCtrl.push(UserDetailPage, {
      user: user,
    });
  }



}
