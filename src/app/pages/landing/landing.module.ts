import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule, HttpClient } from '@angular/common/http';

// ! FIRE BASE ======================================================================
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { firebaseApp } from 'src/environments/firebaseConfig';

import { LandingPageRoutingModule } from './landing-routing.module';

import { LandingPage } from './landing.page';
import { LoginComponent } from '../login/login.component';
import { SignupComponent } from '../signup/signup.component';
import { RecoverypassComponent } from '../recoverypass/recoverypass.component';
import { SignupSmsComponent } from '../signup-sms/signup-sms.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

SignupComponent 
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    LandingPageRoutingModule,
    AngularFireModule.initializeApp(firebaseApp.firebase),
    AngularFireAuthModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [HttpClient]
      }
    })
  ],
  declarations: [
    LandingPage,
    LoginComponent,
    SignupComponent,
    RecoverypassComponent,
    SignupSmsComponent
  ]
})
export class LandingPageModule {}
