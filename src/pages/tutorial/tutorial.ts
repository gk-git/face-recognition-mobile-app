import {Component, ViewChild} from '@angular/core';
import {MenuController, NavController, Slides} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {Events} from 'ionic-angular';
import {LoginPage} from '../login/login';
import {SpeakerListPage} from '../speaker-list/speaker-list';

@Component({
    selector: 'page-tutorial',
    templateUrl: 'tutorial.html'
})

export class TutorialPage {
    showSkip = true;
    login: any;
    @ViewChild('slides') slides: Slides;

    constructor(public events: Events,
                public navCtrl: NavController,
                public menu: MenuController,
                public storage: Storage) {

    }

    startApp() {

        this.login =  this.storage.get('hasLoggedIn');
        this.storage.get('hasSeenTutorial')
            .then((hasSeeTutorial) => {
                console.log(hasSeeTutorial);
                if (hasSeeTutorial) {
                    console.log(this.storage.get('hasLoggedIn'));
                    if(this.login) {

                        this.navCtrl.setRoot(SpeakerListPage).then(()=>{
                            this.events.publish('user:login');
                        });
                    }else {
                        this.navCtrl.setRoot(LoginPage);
                    }
                } else {
                    this.navCtrl.push(LoginPage).then(() => {
                        this.storage.set('hasSeenTutorial', 'true');
                    })
                }

            });


    }

    onSlideChangeStart(slider: Slides) {
        this.showSkip = !slider.isEnd();
    }

    ionViewWillEnter() {
        this.slides.update();
    }

    ionViewDidEnter() {
        // the root left menu should be disabled on the tutorial page
        this.menu.enable(false);
    }

    ionViewDidLeave() {
        // enable the root left menu when leaving the tutorial page
        this.menu.enable(true);
    }

}
