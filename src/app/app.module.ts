import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { LandingPageModule } from './pages/landing/landing.module';
import { SplashScreenStateService } from './services/splash-screen-state.service';
import { SplashScreenStateComponent } from './pages/splash-screen-state/splash-screen-state.component';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent,SplashScreenStateComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    HttpClientModule, 
    AppRoutingModule, 
    LandingPageModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWhenStable:30000'
    }),
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [HttpClient]
      }
    })
  ],
  // providers: [
  //   StatusBar,SplashScreenStateService,
  //   { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  //   // { provide: LocationStrategy, useClass: HashLocationStrategy }
  // ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy, },

    // { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
