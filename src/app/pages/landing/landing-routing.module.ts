import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { SignupSmsComponent } from '../signup-sms/signup-sms.component';
import { SignupComponent } from '../signup/signup.component';
import { LandingPage } from './landing.page';

const routes: Routes = [
  {
    path: '',
    component: LandingPage
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'signup-sms',
    component: SignupSmsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LandingPageRoutingModule {}
