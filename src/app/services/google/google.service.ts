import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class GoogleService {

  constructor(
    public afAuth: AngularFireAuth // Inject Firebase auth service
  ) { }

  // Sign in with Google
  GoogleAuth() {
    let provider = new GoogleAuthProvider();
    return this.AuthLogin(provider);
  }
  // Auth logic to run auth providers
  AuthLogin(provider:any) {
    return this.afAuth.signInWithPopup(provider)
  }

  logout(){
    return this.afAuth.signOut();
  }
}
