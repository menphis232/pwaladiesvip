import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { SplashScreenStateService } from 'src/app/services/splash-screen-state.service';
import { NavController, Platform } from "@ionic/angular";
import { UserService } from 'src/app/services/user/user.service';
import { ControlService } from 'src/app/services/control/control.service';
import {TranslateService} from '@ngx-translate/core';
declare var $: any;

@Component({
    selector: 'app-config',
    templateUrl: './config.page.html',
    styleUrls: ['./config.page.scss'],
})
export class ConfigPage implements OnInit {

    constructor(
        private AuthService: AuthService,
        private router:Router,
        private splashScreenStateService: SplashScreenStateService,
        public navCtrl: NavController, 
        public platform: Platform,
        private UserService:UserService,
        private ControlService:ControlService,
        private translate: TranslateService 

    ) { 
        this.platform.backButton.subscribeWithPriority(10, () => {
            console.log('Handler was called!');
        });

        if(sessionStorage.getItem('guest')){
            this.guest = true;
        }else{
            let user =  JSON.parse(localStorage.getItem("usuario"))
            if(user.alert_pay == 0){
                this.check_alert_plan = true;
            }else{
                this.check_alert_plan = false;
            }
        }
        translate.setDefaultLang('es');
        translate.use(localStorage.getItem('lang'));
        if(localStorage.getItem('lang')){
            this.lang=localStorage.getItem('lang')
            translate.use(localStorage.getItem('lang'));
        }else{
            this.lang='es'
        }
    }

    ngOnInit() {
        this.splashScreenStateService.stop()
    }

    alert:boolean=false;
    guest:boolean=false;
    alert_guest:boolean=false;
    lang:any;

    check_alert_plan:boolean=false;
    display_lang:boolean=false;

    GoNegocio(){
        if(this.guest){
            this.alert_guest=true;
        }else{
            if(this.UserService.getPremium()){
                this.router.navigateByUrl('home/config/negocios')
            }else{
                this.alert = true;
            }
        }
    }

    GoPlanes(){
        if(this.guest){
            this.alert_guest=true;
        }else{
            this.router.navigate(['home/config/planes'])
        }
    }

    GoPacks(){
        if(this.guest){
            this.alert_guest=true;
        }else{
            this.router.navigate(['home/config/packs_anuncios'])
        }
    }

    GoCuentaAcceso(){
        if(this.guest){
            this.alert_guest=true;
        }else{
            this.router.navigate(['home/config/cuenta-acceso'])
        }
    }

    GoInfo(){
        if(this.guest){
            this.alert_guest=true;
        }else{
            this.router.navigate(['home/config/info_perso'])
        }
    }

    signOut():void{

        if(this.guest){
            localStorage.clear();
            sessionStorage.clear();
            this.splashScreenStateService.start();
            location.href='/'
        }else{
            this.AuthService.logOut().then(() => {
                localStorage.clear();
                this.splashScreenStateService.start();
                location.href='/'
            })
        }
    }

    GoLanding(){
        location.href='../landing'
    }

    GoTermCond(){
            const url = 'https://backend-ladies.dattatech.com//storage//files_law/Terminos_condiciones.pdf';
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'true');
            document.body.appendChild(link);
            link.click();
    }

    GoPoliticas(){
        const url = 'https://backend-ladies.dattatech.com//storage//files_law/politicas_privacidad.pdf';
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'true');
        document.body.appendChild(link);
        link.click();
    }

    ChangeAlertPay(){
        if(!this.guest){
            this.UserService.ChangeAlertPay().then(res=>{
                let user =  JSON.parse(localStorage.getItem("usuario"))
                if(user.alert_pay == 0){
                    user.alert_pay = 1
                }else{
                    user.alert_pay = 0;
                }
                localStorage.removeItem('usuario');
                localStorage.setItem('usuario', JSON.stringify(user));
            })
        }
        
    }


    SetLang(lang:string){
        this.translate.use(lang)
        localStorage.setItem('lang',lang)
        location.reload()
    }

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
