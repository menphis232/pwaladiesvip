import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ControlService } from 'src/app/services/control/control.service';
import { GeoLocationService } from 'src/app/services/location/geo-location.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { UserService } from 'src/app/services/user/user.service';
import { SplashScreenStateService } from 'src/app/services/splash-screen-state.service';
import {TranslateService} from '@ngx-translate/core';
import { iif } from 'rxjs';

declare var $: any;


@Component({
    selector: 'app-informacion-personal',
    templateUrl: './informacion-personal.component.html',
    styleUrls: ['./informacion-personal.component.scss'],
})


export class InformacionPersonalComponent implements OnInit {

    constructor(
        private ControlService:ControlService,
        private GeoLocationService: GeoLocationService,
        private UserService:UserService,
        private splashScreenStateService: SplashScreenStateService,
        private translate: TranslateService 

    ) { 
        translate.setDefaultLang('es');
        translate.use(localStorage.getItem('lang'));
    }

    ngOnInit() { 
        this.datos = JSON.parse(localStorage.getItem("usuario"))

        this.ctrl_intereses = this.datos.interes_identidad.split(",");
        this.ctrl_identidad = this.datos.identidad.split(",");
        if(this.datos.interes_servicio != "" && this.datos.interes_servicio != null){
            this.ctrl_servicios = this.datos.interes_servicio.split(",");
        }
        console.log(this.ctrl_intereses)
        for (const interes in this.ctrl_intereses) {
            this.intereses_name.push(this.ControlService.generos[this.ctrl_intereses[interes]])
        }
        for (const interes in this.ctrl_identidad) {
            this.identidad_name.push(this.ControlService.generos[this.ctrl_identidad[interes]])
            
        }
        for (const interes in this.ctrl_servicios) {
            this.servicios_name.push(this.ControlService.servicios[this.ctrl_servicios[interes]])
            
        }
        this.GeoLocationService.getCountries().then(res => {
            this.locaciones = res;
        });

        this.GeoLocationService.getStates('Spain').then(res => {
            this.estados = res;
            this.loading = false;
        });

        this.splashScreenStateService.stop();
    }

    //!DATA=====================================================================
    //?CARGA===================================================================================
    datos:any;
    locaciones: any = null;
    estados: any = null;
    ciudades: any = null;

    //?GESTION===================================================================================
    usuario={
        locacion:{
            pais:null,
            estado:null,
            ciudad:null
        },
        fecha_nac:null,
        interes_identidad:null,
        interes_servicio:null
    }
    intereses_name:any=[];
    identidad_name:any=[];
    servicios_name:any=[];
    ctrl_intereses: any = [];
    ctrl_servicios: any = [];
    ctrl_identidad: any = [];

    user_imagen_show:any;
    data = new FormData();
    //?CONTROL===================================================================================
    
    hoy = new Date();
    url = environment.server;
    display_main:boolean=true;
    display_fecha:boolean=false;
    display_residencia:boolean=false;
    display_identidad:boolean=false;
    display_preferencia:boolean=false;
    display_pais:boolean=false;
    display_estado:boolean=false;
    display_ciudad:boolean=false;

    loading:boolean=false;
    loading_global:boolean=false;
    //? FILTROS==========================================================
    filtro:string="";
    pais_filtro:any=[];
    estado_filtro:any=[];
    ciudad_filtro:any=[];


    //!FUNCIONES===========================================================================================================

    //?CARGA=================================================================================
    
    CargarImagen() {
        let res = Camera.getPhoto({
            quality: 30,
            source: CameraSource.Photos,
            resultType: CameraResultType.Uri
        }).then(async res=>{
            console.log(res);
            let blob = await fetch(res.webPath).then(r => r.blob());
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.user_imagen_show = e.target.result;
            }
            reader.readAsDataURL(blob);
            let formData = new FormData();
            formData.append("imagen", blob);
            this.data = formData;
            this.UpdateUser();
        });
 
    }

    CargarEstados() {
        this.estados = null;
        this.ciudades = null;
        this.datos.estado = null;
        this.datos.ciudad = null;
        this.loading = true;
        this.GeoLocationService.getStates(this.datos.pais).then(res => {
            this.estados = res;
            this.loading = false;
        });
    }

    CargarCiudad() {
        this.ciudades = null;
        this.datos.ciudad = null;
        this.loading = true;
        this.GeoLocationService.getCities(this.datos.estado).then(res => {
            this.ciudades = res;
            this.loading = false;
        });
    }

    //?GESTION=================================================================================

    SelectPais(pais:string){
        this.datos.pais = pais;
        this.CargarEstados();
        this.CerrarModal();
    }

    SelectEstado(estado:string){
        this.datos.estado = estado;
        this.CargarCiudad();
        this.CerrarModal();
    }

    SelectCiudad(ciudad:string){
        this.datos.ciudad = ciudad;
        this.CerrarModal();
    }

    UpdateUser():any{

        this.data.append("user", JSON.stringify(this.datos));
        this.loading_global = true;
        this.UserService.UpdateUser(this.data).then(res=>{
            console.log(res)
            this.datos.img_route = res.url;
            localStorage.removeItem("usuario");
            localStorage.setItem("usuario",JSON.stringify(this.datos))
            this.loading_global = false;

            this.splashScreenStateService.start();
            location.reload();
        });
    }

    UpdateIdentidad(){
        this.datos.identidad = this.ctrl_identidad.join();
        this.UpdateUser();
    }

    UpdateInteres(){
        this.datos.interes_identidad = this.ctrl_intereses.join();
        this.datos.interes_servicio = this.ctrl_servicios.join();
        this.UpdateUser();
    }
    
    //?CONTROL=================================================================================

    selectIdentidad(id: number, event: any, tipo:any) {
        console.log(id);
        console.log(tipo);
        if (!$(event.target).hasClass("btn-genero-active")) {
            $(event.target).removeClass("btn-genero");
            $(event.target).addClass("btn-genero-active");
            if(tipo == 1){
                this.ctrl_identidad.push(id);
            }
            if(tipo == 2){
                this.ctrl_intereses.push(id);
            }
        } else {
            $(event.target).removeClass("btn-genero-active");
            $(event.target).addClass("btn-genero");
            if(tipo == 1){
                this.ctrl_identidad.forEach(function (car: any, index: any, object: any) {
                    if (car == id) {
                        object.splice(index, 1);
                    }
                });
            }else{
                this.ctrl_intereses.forEach(function (car: any, index: any, object: any) {
                    if (car == id) {
                        object.splice(index, 1);
                    }
                });
            }
        }
        console.log(this.ctrl_identidad)
        console.log(this.ctrl_intereses)
    }

    selectServicio(id: number, event: any) {
        console.log(id);
        if (!$(event.target).hasClass("btn-genero-active")) {
            $(event.target).removeClass("btn-genero");
            $(event.target).addClass("btn-genero-active");
            this.ctrl_servicios.push(id);
        } else {
            $(event.target).removeClass("btn-genero-active");
            $(event.target).addClass("btn-genero");
            this.ctrl_servicios.forEach(function (car: any, index: any, object: any) {
                if (car == id) {
                    object.splice(index, 1);
                }
                
            });

        }
    }

    GetEdad(){
        var cumpleanos = new Date(this.datos.fecha_nac);
            var edad = this.hoy.getFullYear() - cumpleanos.getFullYear();
            var m = this.hoy.getMonth() - cumpleanos.getMonth();

            if (m < 0 || (m === 0 && this.hoy.getDate() < cumpleanos.getDate())) {
                edad--;
            }
            return edad;
    }

    filtrarSelect(id:any,tipo:any){

        var res;

        if(tipo == 2){
            res = this.ctrl_intereses.filter(res => res == id);
        }
        if(tipo == 1){
            res = this.ctrl_identidad.filter(res => res == id);
        }
        if(tipo == 3){
            res = this.ctrl_servicios.filter(res => res == id);

        }
        return res.length > 0 ? true:false;
    }

    CerrarModal(){
        $(".bg-card").removeClass("fadeIn")
        $(".bg-card").addClass("fadeOut")
        $(".bg-card").removeClass("fadeIn")
        $(".card-option").removeClass("onUp")
        $(".card-option").addClass("onDown")
        setTimeout(()=>{
            this.display_pais = false;
            this.display_estado = false;
            this.display_ciudad = false;
        }, 450);
        this.filtro = "";
    }

    filtrar(){

        if(this.display_pais){
            this.pais_filtro = [];
            this.locaciones.forEach((arrayItem:any)=> {
                if(arrayItem.country_name.toLowerCase().indexOf(this.filtro.toLowerCase())> -1){
                    this.pais_filtro.push(arrayItem)
                }
            });
        }else if(this.display_estado){
            this.estado_filtro = [];
            this.estados.forEach((arrayItem:any)=> {
                if(arrayItem.state_name.toLowerCase().indexOf(this.filtro.toLowerCase())> -1){
                    this.estado_filtro.push(arrayItem)
                }
            });
        }else{
            this.ciudad_filtro = [];
            this.ciudades.forEach((arrayItem:any)=> {
                if(arrayItem.city_name.toLowerCase().indexOf(this.filtro.toLowerCase())> -1){
                    this.ciudad_filtro.push(arrayItem)
                }
            });
        }


    }

    closeModal(){
        this.display_fecha = false; 
        this.display_residencia = false;
        this.display_identidad = false;
        this.display_preferencia = false;
        this.display_main= true;

        this.datos = JSON.parse(localStorage.getItem("usuario"))
    }
    openMFecha(){
        this.display_fecha = false; 
        this.display_main= true;
        this.usuario.fecha_nac = this.datos.fecha_nac
    }
    closeMFecha(){
        this.usuario.fecha_nac = null;
    }

    openMLocation(){
        this.display_residencia = false; 
        this.display_main= true;
        this.usuario.locacion.pais = this.datos.pais
        this.usuario.locacion.estado = this.datos.estado
        this.usuario.locacion.ciudad = this.datos.ciudad
    }

}
