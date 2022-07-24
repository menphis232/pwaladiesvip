import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SplashScreenStateService } from 'src/app/services/splash-screen-state.service';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { FacebookLogin } from '@capacitor-community/facebook-login';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';

// ! SERVICIOS ============================================
import { AuthService } from 'src/app/services/auth/auth.service';
import { GoogleService } from 'src/app/services/google/google.service';
import { FacebookService } from 'src/app/services/facebook/facebook.service';
import { SmsService } from 'src/app/services/sms/sms.service';
// ! ASSETS ============================================
declare var $: any;

import { Vacio, VacioU } from '../../../assets/script/general';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

    constructor(
        private router: Router,
        private AuthService: AuthService,
        private GoogleService: GoogleService,
        private FacebookService: FacebookService,
        private splashScreenStateService: SplashScreenStateService,
        private SmsService:SmsService,
        private platform:Platform,
        private http:HttpClient,
        private translate: TranslateService 

    ) { 
        translate.use(localStorage.getItem('lang'));
    }

    ngOnInit() { 
        this.splashScreenStateService.stop()
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
          GoogleAuth.initialize()
        })
    }

    //!DATA=====================================================================
    //?CARGA===================================================================================


    //?GESTION===================================================================================
   
    usuario: any = {
        datos: {
            correo: null,
            clave: null,
            tipo:null,
            nombre:null
        },
        tipo: 1,
    }

    //?CONTROL===================================================================================
    isOpen = false;
    habLogin = false;
    error: number = 0;
    viewPass:boolean=false;
    loading:boolean = false;
    displayRecovery:boolean=false;
    token:any=null;
    display_block:boolean=false;
    display_delete:boolean=false;
    fase_block:number=0;
    //!FUNCIONES=============================================================

    //?CARGA=============================================================


    //?GESTION============================================================
    async LogInGoogle(){
        this.error = 0;

        GoogleAuth.signOut().then(()=>{

            GoogleAuth.signIn().then((res:any)=>{
                console.log(res.email)
                this.usuario.tipo = 2;
                this.usuario.datos.correo = res.email;
                this.AuthService.ValEmail({ tipo: 2, email: res.email })
                .then(email => {
                    if (email.success) {
                        this.AuthService.loginSocial(this.usuario)
                        .then(login => {
                            if(login.data.status == 2){
                                this.display_delete = true;
                            }else if(login.data.status == 1){
                                this.display_block = true;
                            }else{
                                localStorage.setItem('usuario', JSON.stringify(login.data));
                                localStorage.setItem('ruta_img', JSON.stringify(login.data.img_route));
                                localStorage.setItem('token', login.access_token);
                                location.href = '/home';
                            }
                        })
                    }
                    if(email.block){
                        this.display_delete = true;
                        this.loading=false;
                    }
    
                    if (email.error) {
                        this.error = 1;
                    }
                })
            })
        })
    }

    async LogInFacebook(){
        this.error = 0;
        const FACEBOOK_PERMISSIONS = [
          'email',
          'user_birthday',
          'user_photos',
          'user_gender',
        ];
    
        const result = await FacebookLogin.login({
          permissions: FACEBOOK_PERMISSIONS,
        });

        if (result && result.accessToken) {
            this.token = result.accessToken;
            this.usuario.tipo = 3;
            console.log(result)
            const url = `https://graph.facebook.com/${this.token.userId}?fields=id,name,picture.width(720),birthday,email&access_token=${this.token.token}`;
            this.http.get(url).subscribe( (res:any) => {
                console.log("load")
                console.log(res)
                this.usuario.datos.correo = res.email;
                this.usuario.tipo = 3;
                this.AuthService.ValEmail({ tipo: this.usuario.tipo, email: this.usuario.datos.correo })
                .then(email=>{
                    if (email.success) {
                        this.AuthService.loginSocial(this.usuario)
                        .then(login => {
                            console.log(login)
                            if(login.data.status == 2){
                                this.display_delete = true;
                            }else if(login.data.status == 1){
                                this.display_block=true;
                            }else{
                                localStorage.setItem('usuario', JSON.stringify(login.data));
                                localStorage.setItem('ruta_img', JSON.stringify(login.data.img_route));
                                localStorage.setItem('token', login.access_token);
                                location.href = '/home';
                            }

                        })
                    }

                    if(email.block){
                        this.display_delete = true;
                        this.loading=false;
                    }
                    
                    if (email.error) {
                        this.error = 1;
                    }
                })
            })
        }else{
            this.logoutFacebook().then(()=>{
                this.LogInFacebook()
            });
        }
    }

    async logoutFacebook() {
        await FacebookLogin.logout();
    }



    LoginSms(){
        // localStorage.setItem('usuario', JSON.stringify(event.data));
        // localStorage.setItem('token', event.access_token);
        // location.href = '/home';
        this.SmsService.tipo = 1;
        this.router.navigate(['/signup-sms'])

    }

    facebookUser: any;
    LogIn() {
        this.error = 0; 
        if(this.habLogin){
            this.loading = true;
            this.usuario.tipo = 1;
            //valida el email
            this.AuthService.ValEmail({ tipo: this.usuario.tipo, email: this.usuario.datos.correo })
                .then(email => {
                    //si existe procede a iniciar sesison
                    if (email.success) {
                        this.AuthService.login(this.usuario)
                            .then(login => {
                                if(login.data.status == 1){
                                    this.display_block = true;
                                }else{
                                    localStorage.setItem('usuario', JSON.stringify(login.data));
                                    localStorage.setItem('ruta_img', JSON.stringify(login.data.img_route));
                                    localStorage.setItem('token', login.access_token);
                                    this.AuthService.ValUser().then(res=>{
                                        if(res.length != 0){
                                            location.href = '/admin/main';
                                        }else{
                                            this.splashScreenStateService.start();
                                            this.loading=false;
                                            location.href='/home'
                                        }
                                    })
                                }
                            })
                            ///erro de credenciales
                            .catch(err => {
                                if (err.status == 401) {
                                    this.error = 2;
                                    this.loading=false;
                                }
                            })
                    }

                    if(email.block){
                        this.display_delete = true;
                        this.loading=false;
                    }
                    //error de email incorrecto
                    if (email.error) {
                        this.error = 1;
                         this.loading=false;

                    }
                })
        }
        
    }
    
    //?CONTROL==============================================================================

    tooglePass(){
        this.viewPass = !this.viewPass;
        let pass =$("#password")

        if(pass[0].type == 'text'){
            pass[0].type = 'password'
        }else{
            pass[0].type = 'text'
        }
    }

    ValAcceso() {
        if (
            VacioU(this.usuario.datos.correo) || VacioU(this.usuario.datos.clave) ||
            !/^\w+([\.-]?\w+)*@(?:|hotmail|outlook|yahoo|live|gmail)\.(?:|com|es)+$/.test(this.usuario.datos.correo) ||
            this.usuario.datos.clave.length < 8
        ) {
            this.habLogin = false;
        } else {
            this.habLogin = true;
        }
    }


}
