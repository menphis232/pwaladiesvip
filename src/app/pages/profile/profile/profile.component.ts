import { Component, OnInit } from '@angular/core';
import { AnunciosService } from 'src/app/services/anuncios/anuncios.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';


@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

    constructor(
        private AnunciosService: AnunciosService,
        private Router:Router,
        private UserService:UserService
    ) { }

    ngOnInit() {

        if(sessionStorage.getItem('guest')){
            this.guest = true;
            this.datos = {name:"Invitado"}
        }
        else{
            this.GetMyAdd();
            this.datos = JSON.parse(localStorage.getItem("usuario"))
            this.premium = this.UserService.getPremium()
    
            this.mypack = JSON.parse(localStorage.getItem("pack"))
            console.log(this.mypack)
    
            if(localStorage.getItem("pack") ){
                this.mypack = JSON.parse(localStorage.getItem("pack"))
                console.log("asd")
                if(this.mypack.pack == 1){
                    this.img_pack="pack-add-standar.png"
                }
                if(this.mypack.pack == 2){
                    this.img_pack="pack-add-plus.png"
                }
                if(this.mypack.pack == 3){
                    this.img_pack="pack-add-extra.png"
                }
                if(this.mypack.pack == 4){
                    this.img_pack="pack-add-carrusel.png"
                }
            }else{
                this.mypack =null;
            }
        }
       
    }

    //!DATA=====================================================================
    //?CARGA===================================================================================
    myadd:any;
    datos:any;
    mypack:any=null;
    //?GESTION===================================================================================


    //?CONTROL===================================================================================
    url = environment.server;
    hoy = new Date();
    premium:boolean=false;
    img_pack:string="";
    loading:boolean=false;
    guest:boolean=false;
    alert_guest:boolean=false;
    GetMyAdd(){
        this.AnunciosService.GetMyAdd().then(res => {
            this.myadd = res[0];
            console.log(this.myadd)
            this.AnunciosService.anuncio = res[0];
        });
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


    config(){
        this.Router.navigate(['home/config'])       
    }

    Gofavorito(){
        if(this.guest){
            this.alert_guest = true;
        }else{
            this.loading=true;
            location.href='/home/favorito'
        }
    }

    GoPacks(){
        if(this.guest){
            this.alert_guest = true;
        }else{
            this.Router.navigate(['/home/config/packs_anuncios'])
        }
    }

    GoLanding(){
        this.loading=true;
        location.href='../landing'
    }
}
