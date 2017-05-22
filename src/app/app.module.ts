import {NgModule} from '@angular/core';

import {IonicApp, IonicModule} from 'ionic-angular';
import {IonicStorageModule} from '@ionic/storage';

import {ConferenceApp} from './app.component';

import {AboutPage} from '../pages/about/about';
import {AccountPage} from '../pages/account/account';
import {LoginPage} from '../pages/login/login';
import {MapPage} from '../pages/map/map';
import {SchedulePage} from '../pages/schedule/schedule';
import {ScheduleFilterPage} from '../pages/schedule-filter/schedule-filter';
import {SessionDetailPage} from '../pages/session-detail/session-detail';
import {SpeakerDetailPage} from '../pages/speaker-detail/speaker-detail';
import {UserDetailPage} from '../pages/user-detail/user-detail';
import {TutorialPage} from '../pages/tutorial/tutorial';
import {SupportPage} from '../pages/support/support';
import {SupportNotLoginPagePage} from '../pages/support-not-login/support-not-login';
import {UserListPage} from '../pages/user-list/user-list';
import {HomePagePage} from '../pages/home/home';

import {ConferenceData} from '../providers/conference-data';
import {UserData} from '../providers/user-data';
import {Api} from '../providers/api';

import {InAppBrowser} from '@ionic-native/in-app-browser';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import {CloudSettings, CloudModule} from '@ionic/cloud-angular';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
const cloudSettings: CloudSettings = {
    'core': {
        'app_id': '49d72be8'
    }
    , 'push': {
        'sender_id': '3510990185',
        'pluginConfig': {
            'ios': {
                'badge': true,
                'sound': true
            },
            'android': {
                'iconColor': '#343434'
            }
        }
    }
};

@NgModule({
    declarations: [
        ConferenceApp,
        AboutPage,
        AccountPage,
        LoginPage,
        MapPage,
        SchedulePage,
        ScheduleFilterPage,
        SessionDetailPage,
        SpeakerDetailPage,
        TutorialPage,
        SupportPage,
        SupportNotLoginPagePage,
        UserListPage,
        UserDetailPage,
        HomePagePage
    ],
    imports: [
        BrowserModule,
        HttpModule,
        IonicModule.forRoot(ConferenceApp),
        CloudModule.forRoot(cloudSettings),
        IonicStorageModule.forRoot()
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        ConferenceApp,
        AboutPage,
        AccountPage,
        LoginPage,
        MapPage,
        SchedulePage,
        ScheduleFilterPage,
        SessionDetailPage,
        SpeakerDetailPage,
        TutorialPage,
        SupportPage,
        SupportNotLoginPagePage,
        UserListPage,
        UserDetailPage,
        HomePagePage
    ],
    providers: [
        ConferenceData,
        UserData,
        StatusBar,
        SplashScreen,
        InAppBrowser,
        Api
    ]
})
export class AppModule {
}
