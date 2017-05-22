import {Component} from '@angular/core';
import {Storage} from '@ionic/storage';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {AlertController, NavController, ToastController} from 'ionic-angular';

/*
 Generated class for the SupportPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */

@Component({
    selector: 'page-support-not-login',
    templateUrl: 'support-not-login.html'
})
export class SupportNotLoginPagePage {
    submitted: boolean = false;
    supportMessage: string;
    supportEmail: string;
    login: any;
    notLogin: any;

    slideOneForm: FormGroup;
    submitAttempt: boolean = false;


    constructor(public navCtrl: NavController,
                public alertCtrl: AlertController,
                public storage: Storage,
                public formBuilder: FormBuilder,
                public toastCtrl: ToastController) {
        this.slideOneForm = formBuilder.group({
            email: ['', Validators.compose([Validators.maxLength(244), Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'), Validators.required])],
            message: ['', Validators.compose([Validators.minLength(10),Validators.required])],
        });
    }

    save(){

        this.submitAttempt = true;

        if(!this.slideOneForm.valid){
            // this.signupSlider.slideTo(0);
        }
        else {
            console.log("success!")
            console.log(this.slideOneForm.value);
            // console.log(this.slideTwoForm.value);

            this.submitted = false;

            let toast = this.toastCtrl.create({
                message: 'Your support request has been sent.',
                duration: 3000,
                position: 'top'
            });
            toast.present();
        }

    }


    // If the user enters text in the support question and then navigates
    // without submitting first, ask if they meant to leave the page
    ionViewCanLeave(): boolean | Promise<boolean> {
        // If the support message is empty we should just navigate
        if ((!this.supportMessage || this.supportMessage.trim().length === 0)&&(!this.supportEmail || this.supportEmail.trim().length === 0)) {
            return true;
        }

        return new Promise((resolve: any, reject: any) => {
            let alert = this.alertCtrl.create({
                title: 'Leave this page?',
                message: 'Are you sure you want to leave this page? Your support message will not be submitted.'
            });
            alert.addButton({text: 'Stay', handler: reject});
            alert.addButton({text: 'Leave', role: 'cancel', handler: resolve});

            alert.present();
        });
    }
}
