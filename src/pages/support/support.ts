import {Component} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Storage} from '@ionic/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {AlertController, NavController, ToastController} from 'ionic-angular';


@Component({
    selector: 'page-user',
    templateUrl: 'support.html'
})
export class SupportPage {

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
            message: ['', Validators.compose([Validators.minLength(10), Validators.required])],
        });
    }

    ionViewDidLoad() {
        this.storage.get('hasLoggedIn')
            .then((hasLoggedIn) => {

                if (hasLoggedIn) {
                    this.login = true;
                    this.notLogin = false;

                } else {
                    this.notLogin = true;
                    this.login = false;
                }
                console.log("Support");
                console.log(this.login);
            });


    }


    submit(form: NgForm) {
        this.submitted = true;

        if (form.valid) {
            this.supportMessage = 'Hi ';
            this.submitted = false;

            let toast = this.toastCtrl.create({
                message: 'Your support request has been sent.',
                duration: 3000
            });
            toast.present();
        }
    }

    submitNotLogin(form: NgForm) {
        this.submitted = true;

        if (form.valid) {
            this.supportMessage = 'Hi ';
            this.submitted = false;

            let toast = this.toastCtrl.create({
                message: 'Your support request has been sent.',
                duration: 3000
            });
            toast.present();
        }
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
        if (!this.supportMessage || this.supportMessage.trim().length === 0) {
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
