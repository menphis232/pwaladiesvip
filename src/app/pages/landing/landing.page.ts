import { Component, OnInit } from '@angular/core';
import { SplashScreenStateService } from 'src/app/services/splash-screen-state.service';
import { StatusBar, StatusBarAnimation, Style } from '@capacitor/status-bar';
import { Router } from '@angular/router';
import { FacebookLogin } from '@capacitor-community/facebook-login';
import { HttpClient } from '@angular/common/http';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Platform } from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
declare var $: any;

@Component({
    selector: 'app-landing',
    templateUrl: './landing.page.html',
    styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {
    username=null;
    constructor(
        private splashScreenStateService: SplashScreenStateService,
        private router: Router,
        private http:HttpClient,
        private platform:Platform,
        private translate: TranslateService 
    ) {
        StatusBar.setOverlaysWebView({ overlay: true});
        StatusBar.hide({ animation: StatusBarAnimation.Slide}); 
        translate.setDefaultLang('es');
        if(sessionStorage.getItem('guest')){
            sessionStorage.clear()
        }

        if(localStorage.getItem('lang')){
            this.lang=localStorage.getItem('lang')
            translate.use(localStorage.getItem('lang'));
        }else{
            this.lang='es'
        }
     }

     

    ngOnInit() {
        this.splashScreenStateService.stop();
        if(localStorage.getItem('token')){
            location.href = '/home';
        }
    }

    async signInGoogle() {
        this.user = await GoogleAuth.signIn()
        console.log(this.user)
    }

    token=null;
    user=null;
    display_inv:boolean=false;
    inv:boolean=false;
    checkterm:boolean=false;
    display_lang:boolean=false;
    lang:any;
    lang_name:any='Spanish';
    async logoutGoogle(){
        await GoogleAuth.signOut();
        this.user =''
    }

    
    GoCreate(){
        this.display_inv=false;
        $('#crear').trigger('click')
        // this.router.navigate(['signup'])
        // this.router.navigateByUrl('signup')
    }

    LogInAsGuest(){
        this.splashScreenStateService.start();

        sessionStorage.setItem('guest', 'true');
        location.href='/home'
    }

    //!DATA===========================================================================================================
    //?CARGA=================================================================================


    //?GESTION=================================================================================
    
    
    //?CONTROL=================================================================================
    //!FUNCION===========================================================================================================

    //?CARGA=================================================================================


    //?GESTION=================================================================================
    SetLang(lang:string){
        this.translate.use(lang)
        localStorage.setItem('lang',lang)
        location.reload()
    }
    
    //?CONTROL=================================================================================

    CerrarModal(){
        $(".bg-card").removeClass("fadeIn")
        $(".bg-card").addClass("fadeOut")
        $(".bg-card").removeClass("fadeIn")
        $(".card-option").removeClass("onUp")
        $(".card-option").addClass("onDown")
        setTimeout(()=>{
            this.display_lang = false;
        }, 450);
    }
}
