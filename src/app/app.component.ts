import { Component } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { PushNotifications } from '@capacitor/push-notifications';
import { Router } from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
})
export class AppComponent {

    constructor(
        // private StatusBar: StatusBar,
        private router: Router,
        private translate: TranslateService 
    ) {

        // this.StatusBar.overlaysWebView(false);
        // this.StatusBar.backgroundColorByHexString('#fcfcfc');
        // this.StatusBar.styleDefault();
        translate.setDefaultLang('es');
        if(localStorage.getItem('lang')){
            translate.use(localStorage.getItem('lang'));

        }else{
            translate.use('es');
            localStorage.setItem('lang','es')
        }
        PushNotifications.addListener("registration", (token) => {
            this.token = token.value;
            localStorage.removeItem('token_push');
            localStorage.setItem('token_push', this.token);
        });

        PushNotifications.addListener("pushNotificationReceived", (Notification) => {
        })


        PushNotifications.addListener('pushNotificationActionPerformed', notification => {
            this.router.navigate(['/'])
        });

        PushNotifications.register();

    }


    token: any;

}

