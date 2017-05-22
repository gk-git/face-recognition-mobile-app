import {Component, ViewChild} from '@angular/core';

import {Events, MenuController, Nav, Platform} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {
    Push,
    PushToken
} from '@ionic/cloud-angular';

import {AboutPage} from '../pages/about/about';
import {AccountPage} from '../pages/account/account';
import {LoginPage} from '../pages/login/login';
import {MapPage} from '../pages/map/map';
import {TutorialPage} from '../pages/tutorial/tutorial';
import {SchedulePage} from '../pages/schedule/schedule';
import {SupportPage} from '../pages/support/support';
import {SupportNotLoginPagePage} from '../pages/support-not-login/support-not-login';
import {UserListPage} from '../pages/user-list/user-list';
import {HomePagePage} from '../pages/home/home';

import {ConferenceData} from '../providers/conference-data';
import {UserData} from '../providers/user-data';

export interface PageInterface {
    title: string;
    component: any;
    icon: string;
    logsOut?: boolean;
    index?: number;

}

@Component({
    templateUrl: 'app.template.html'
})
export class ConferenceApp {
    // the root nav is a child of the root app component
    // @ViewChild(Nav) gets a reference to the app's root nav
    @ViewChild(Nav) nav: Nav;

    // List of pages that can be navigated to from the left menu
    // the left menu only works after login
    // the login page disables the left menu
    appPagesAdmin: PageInterface[] = [
        {title: 'Schedule', component: SchedulePage, icon: 'calendar'},
        {title: 'Action', component: HomePagePage, icon: 'calendar'},
        {title: 'Users', component: UserListPage, index: 1, icon: 'contacts'},
        {title: 'Map', component: MapPage, icon: 'map'},
        {title: 'About', component: AboutPage, icon: 'information-circle'}
    ];
    appPagesUser: PageInterface[] = [
        {title: 'Schedule', component: SchedulePage, icon: 'calendar'},
        {title: 'Map', component: MapPage, icon: 'map'},
        {title: 'About', component: AboutPage, icon: 'information-circle'}
    ];
    appPagesLogOut: PageInterface[] = [
        {title: 'Map', component: MapPage, index: 2, icon: 'map'},
        {title: 'About', component: AboutPage, index: 3, icon: 'information-circle'}
    ];
    loggedInPages: PageInterface[] = [
        {title: 'Account', component: AccountPage, icon: 'person'},
        {title: 'Support', component: SupportPage, icon: 'help'},
        {title: 'Logout', component: LoginPage, icon: 'log-out', logsOut: true}
    ];
    loggedOutPages: PageInterface[] = [
        {title: 'Login', component: LoginPage, icon: 'log-in'},
        {title: 'Support', component: SupportNotLoginPagePage, icon: 'help'},
    ];
    rootPage: any;

    constructor(public events: Events,
                public userData: UserData,
                public menu: MenuController,
                public push: Push,
                public platform: Platform,
                public confData: ConferenceData,
                public storage: Storage,
    ) {

        // Check if the user has already seen the tutorial
        this.storage.clear();
        this.storage.get('hasSeenTutorial')
            .then((hasSeenTutorial) => {
                if (hasSeenTutorial) {
                    this.rootPage = LoginPage;
                } else {
                    this.rootPage = TutorialPage;
                }
                this.platformReady()
            });

        this.push.register().then((t: PushToken) => {
            return this.push.saveToken(t);
        }).then((t: PushToken) => {
            console.log('Token saved:', t.token);
            alert(t.token);
        });

        this.push.rx.notification()
            .subscribe((msg) => {
                alert(msg.title + ': ' + msg.text);
            });

        // decide which menu items should be hidden by current login status stored in local storage
        this.userData.hasLoggedIn().then((hasLoggedIn) => {


            if (this.userData._role_id == 1){
                this.enableMenuAdmin();
            }
            else
            if (this.userData._role_id == 2){
                this.enableMenuAdmin();
            } else if(this.userData._role_id == 3){
                this.enableMenu();
            }
        });

        this.listenToLoginEvents();
    }

    openPage(page: PageInterface) {

        if (page.logsOut === true) {
            // Give the menu time to close before changing to logged out
            setTimeout(() => {
                this.userData.logout();
                this.storage.clear();
                this.confData.data= null;
                this.userData.clearUser();
                this.events.publish('user:logout');
                this.nav.setRoot(LoginPage);
            }, 500);
        }
        // the nav component was found using @ViewChild(Nav)
        // reset the nav to remove previous pages and only have this page
        // we wouldn't want the back button to show in this scenario

        this.nav.setRoot(page.component).catch(() => {
            console.log("Didn't set nav root");
        });


    }

    openTutorial() {
        this.nav.setRoot(TutorialPage);
    }

    listenToLoginEvents() {
        this.events.subscribe('user:login', () => {
            if (this.userData._role_id == 1){
                this.enableMenuAdmin();
            }
            else
            if (this.userData._role_id == 2){
                this.enableMenuAdmin();
            } else if(this.userData._role_id == 3){
                this.enableMenu();
            }

        });


        this.events.subscribe('user:logout', () => {
            this.enableMenuLogout();
        });
    }

    enableMenu() {
        this.menu.enable(true, 'loggedInMenu');
        this.menu.enable(false, 'loggedOutMenu');
        this.menu.enable(false, 'loggedInMenuAdmin');
    }

    enableMenuLogout() {

        this.menu.enable(false, 'loggedInMenu');
        this.menu.enable(false, 'loggedInMenuAdmin');
        this.menu.enable(true, 'loggedOutMenu');

    }

    enableMenuAdmin() {
        this.menu.enable(true, 'loggedInMenuAdmin');
        this.menu.enable(false, 'loggedInMenu');
        this.menu.enable(false, 'loggedOutMenu');
    }

    platformReady() {
        // Call any initial plugins when ready
        this.platform.ready().then(() => {
        });
    }

    isActive(page: PageInterface) {


        if (this.nav.getActive() && this.nav.getActive().component === page.component) {
            return 'primary';
        }
        return;
    }
}
