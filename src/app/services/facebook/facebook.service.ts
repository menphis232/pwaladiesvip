import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FacebookAuthProvider } from 'firebase/auth';
@Injectable({
    providedIn: 'root'
})
export class FacebookService {

    constructor(
    public afAuth: AngularFireAuth // Inject Firebase auth service
    ) { }

    // Sign in with Facebook
    FacebookAuth() {
        let provider = new FacebookAuthProvider();
        return this.AuthLogin(provider);
    }
    // Auth logic to run auth providers
    AuthLogin(provider: any) {
        return this.afAuth.signInWithPopup(provider)
    }

    logout() {
        return this.afAuth.signOut();
    }
}
