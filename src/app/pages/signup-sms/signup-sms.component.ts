import { Component, OnInit } from '@angular/core';
import { SoloNumero, Vacio, VacioU } from 'src/assets/script/general';
import { Platform } from '@ionic/angular';
import { Location } from "@angular/common";
import { Router } from '@angular/router';

// ! SERVICIOS ========================================================================
import { GeoLocationService } from 'src/app/services/location/geo-location.service';
import { SmsService } from 'src/app/services/sms/sms.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SplashScreenStateService } from 'src/app/services/splash-screen-state.service';
import { ControlService } from 'src/app/services/control/control.service';
// ! SERVICIOS ========================================================================

declare var $: any;

@Component({
    selector: 'app-signup-sms',
    templateUrl: './signup-sms.component.html',
    styleUrls: ['./signup-sms.component.scss'],
})
export class SignupSmsComponent implements OnInit {

    constructor(
        private GeoLocationService: GeoLocationService,
        private SmsService:SmsService,
        private AuthService:AuthService,
        private splashScreenStateService: SplashScreenStateService,
        private platform: Platform,
        private location: Location,
        private ControlService:ControlService,
        private router: Router,

    ) {
        this.platform.backButton.subscribeWithPriority(10, () => {
            this.location.back();
         });
     }

    ngOnInit() {
        this.GeoLocationService.getCountries().then(res => {
            this.locaciones = res;
        });
        this.tipo = this.SmsService.tipo;
        console.log("tipo: "+this.SmsService.tipo)

     }


    //!DATA===========================================================================================================
    //?CARGA=================================================================================
    locaciones: any = null;

    //?GESTION=================================================================================
    sms:any={
        code_phone:null,
        country_short_name:null,
        telefono:null,
        codigo:null
    }

    usuario:any={
        tipo: null,
        datos: {
            nombre: "",
            correo: "",
            code_phone: '+',
            telefono: "",
            clave: ""
        },
        fecha_nac: "",
        locacion: {
            pais: 0,
            estado: null,
            ciudad: null
        },
        geo:{
            long:null,
            lat:null
        },
        identidad: null,
        servicio: null,
        interes_identidad: null,
        interes_servicio: null
    }

    code_1: string = "";
    code_2: string = "";
    code_3: string = "";
    code_4: string = "";
    code_5: string = "";
    re_code: boolean = false;
    fase: number = 1;

    //?CONTROL=================================================================================
    loading:boolean=false;
    error:number=0;
    tipo:number =0;
    filtro:string="";
    telf_filtro:any=[];

    //* MODALES========================================================
    display_telf:boolean=false;

    //!FUNCION===========================================================================================================

    //?CARGA=================================================================================


    //?GESTION=================================================================================
    SelectCodeTlf(code_phone: string, country_short_name: string) {
        this.sms.code_phone = code_phone;
        this.sms.country_short_name = country_short_name;
        this.CerrarModal();
        this.telf_filtro = [];
    }


    Continuar(){

        this.code_1="";
        this.code_2="";
        this.code_3="";
        this.code_4="";
        this.code_5="";

        this.loading = true;
        this.SmsService.sms = this.sms;
        this.re_code = false;
        this.error = 0;
        if(Vacio({code_phone:this.sms.code_phone, telefono:this.sms.telefono})){
            this.error =2;
            this.loading = false;
            return
        }
        if(this.tipo == 1){
            this.SmsService.Login()
            .then( res=>{
                console.log(res)
                if(res.success){
                    this.fase = 2;
                    this.loading = false;
                    setTimeout(()=>{
                        this.re_code =true;
                    }, 120000);
                }else{
                    this.error = 1;
                    this.loading = false;
                }
            })
            .catch(error=>{
                if(error.status == "200"){
                    this.error = 3;
                    this.loading = false;

                }
                if(error.status == "429" || error.status == "503"){
                    this.error = 4;
                    this.loading = false;
                }
            })
        }else{
            this.SmsService.SignUp()
            .then( res=>{
                console.log(res)
                if(res.success){
                    this.fase = 2;
                    this.loading = false;
                    setTimeout(()=>{
                        this.re_code =true;
                    }, 120000);
                }else{
                    this.error = 1;
                    this.loading = false;
                }
            })
            .catch(error=>{
               if(error.status == "200"){
                   this.error = 3;
                   this.loading = false;
               }
               if(error.status == "429" || error.status == "503"){
                this.error = 4;
                this.loading = false;
            }
            })
        }
    }

    EnviarCodigo(){
        this.code_1="";
        this.code_2="";
        this.code_3="";
        this.code_4="";
        this.code_5="";
        if(this.tipo == 1){
            this.SmsService.Login()
            .then( res=>{
                console.log(res)
                if(res.success){
                    this.fase = 2;
                    this.loading = false;
                    setTimeout(()=>{
                        this.re_code =true;
                    }, 120000);
                }else{
                    this.error = 1;
                    this.loading = false;
                }
            })
        }else{
            this.SmsService.SignUp()
            .then( res=>{
                console.log(res)
                if(res.success){
                    this.loading = false;
                    setTimeout(()=>{
                        this.re_code =true;
                    }, 120000);
                    this.fase = 1;
                }else{
                    this.error = 5;
                    this.loading = false;
                }
            })
        }

    }

    VerificarCodigoSMS() {
        this.loading = true;
        this.sms.codigo = this.code_1 + this.code_2 + this.code_3 + this.code_4 + this.code_5;
        this.SmsService.sms = this.sms;
        this.SmsService.ValCode(this.tipo).then(res=>{
            console.log(res);
            if(!res.error){
                console.log(res)
                this.loading = false;
                if(this.tipo == 0){
                    // this.SmsService.SignUpType = 4;
                    this.SmsService.SignUpType.emit({ signup_type:4 });
                    this.router.navigate(['/signup'])
                }else{
                    console.log(res)
                    localStorage.setItem('usuario', JSON.stringify(res.data));
                    localStorage.setItem('token', res.access_token);
                    //redirige
                    this.splashScreenStateService.start();
                    location.href = '/home';
                }
            }else{
                this.error = 1;
                this.loading = false;
            }
        });
    }

    // SignUp(){
    //     this.usuario.tipo = 4;
    //     this.usuario.datos.code_phone =  this.SmsService.sms.code_phone;
    //     this.usuario.datos.telefono =  this.SmsService.sms.telefono;
    //     this.AuthService.signUpSocial(this.usuario)
    //         .then(res => {
    //             console.log(res)
    //             if (res.success) {
    //                 // inicia sesion y redirige
    //                 this.AuthService.loginSocial(this.usuario)
    //                     .then(login => {
    //                         this.splashScreenStateService.start();
    //                         sessionStorage.setItem('usuario', JSON.stringify(login.data));
    //                         sessionStorage.setItem('token', login.access_token);
    //                         //redirige
    //                         location.href = '/home';
    //                     })
    //             }
    //         })
    // }
    //?CONTROL=================================================================================
    filtrar(){
        this.telf_filtro = [];
        this.locaciones.forEach((arrayItem:any)=> {
            if(arrayItem.country_name.toLowerCase().indexOf(this.filtro.toLowerCase())> -1){
                this.telf_filtro.push(arrayItem)
            }

            if(String(arrayItem.country_phone_code).indexOf(this.filtro)> -1){
                this.telf_filtro.push(arrayItem)
            }
        });
    }

    CerrarModal(){
        $(".bg-card").removeClass("fadeIn")
        $(".bg-card").addClass("fadeOut")
        $(".bg-card").removeClass("fadeIn")
        $(".card-option").removeClass("onUp")
        $(".card-option").addClass("onDown")
        setTimeout(()=>{
            this.display_telf = false;
        }, 450);
        this.filtro = "";
    }

    SoloNumero(evt: any) {
        return SoloNumero(evt)
    }

    VacioU(obj:any){
        return VacioU(obj)
    }
    
    nextInput(e:any, next:string){
        if( e.target.value.length == e.target.getAttribute('maxlength')){
            $(`input[name='${next}']`).focus()
        }
    }
}
