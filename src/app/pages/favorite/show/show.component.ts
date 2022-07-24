import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AnunciosService } from 'src/app/services/anuncios/anuncios.service';
import { Browser } from '@capacitor/browser';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';
import { DomController, Gesture, GestureController } from '@ionic/angular';
import {Location} from '@angular/common';
import { UserService } from 'src/app/services/user/user.service';
import { FavoritoService } from 'src/app/services/favorito/favorito.service';
import {TranslateService} from '@ngx-translate/core';

declare var $: any;

@Component({
    selector: 'app-show',
    templateUrl: './show.component.html',
    styleUrls: ['./show.component.scss'],
})
export class ShowComponent implements OnInit, AfterViewInit  {

    constructor(
        private AnunciosService: AnunciosService,
        private callNumber: CallNumber,
        private gestureCtrl: GestureController,
        private domCtrl: DomController,
        private location: Location,
        private UserService:UserService,
        private FavoritoService:FavoritoService,
        private translate: TranslateService 

    ) { 
        translate.setDefaultLang('es');
        translate.use(localStorage.getItem('lang'));
    }

    @ViewChildren("images", {read: ElementRef }) images: QueryList<ElementRef>;
    loading:boolean=false;
    hoy = new Date();


    ngOnInit() {
        this.anuncioGes = this.AnunciosService.anuncio;
        this.anuncio = this.AnunciosService.anuncio.anuncio;
        console.log("anuncio")
        console.log(this.anuncio)
        this.urls_image = this.anuncio.urls.split(",");
        this.premium=this.UserService.getPremium();
     }


    async ngAfterViewInit() {
        this.GestionAnunciosX(this.images.toArray())

        this.images.changes
        .subscribe(() => {
            let imagesArray = this.images.toArray();
            this.GestionAnunciosX(imagesArray)
        })
    }


    
    GestionAnunciosX(imagesArray) {
        
        for (let i = 0; i < imagesArray.length; i++) {
            const images = imagesArray[i];
            this.point_img = i;
            const gesture = this.gestureCtrl.create({
                el: images.nativeElement,
                threshold: 5,
                gestureName: 'moveX',
                disableScroll: true,
                direction:'x',
                gesturePriority:3,
                onStart: ev =>{
                    console.log(i);
                    this.point_img = i;

                    
                    console.log(this.point_img)
                    if(ev.deltaX < 0){
                        if(imagesArray[i-1]){
                            imagesArray[i-1].nativeElement.style.display = 'none';
                        }
                    }
                },
                onMove: ev => {
                    const currentX = ev.currentX;
                    const currentY = ev.currentY;
                    if(ev.deltaX < 0){
                        if(imagesArray[i-1]){
                            images.nativeElement.style.transform = `
                                translateX(${ev.deltaX}px) 
                            `;
                        }
                    }else{
                        if(imagesArray[i+1]){
                            images.nativeElement.style.transform = `
                                translateX(${ev.deltaX}px) 
                            `;
                        }
                    }
                    
                },
                onEnd: ev => {
                    console.log('move end!');
                    images.nativeElement.style.transition = '0.2s ease-out';

                    if(ev.deltaX < 0){
                        if(imagesArray[i-1]){
                            $('.point-active').removeClass("point-active").addClass("point")
                            $('#'+(i-1)).removeClass("point").addClass("point-active")
                            imagesArray[i-1].nativeElement.style.transition = '0.2s ease-out';
                            imagesArray[i-1].nativeElement.style.display = 'grid';
                            imagesArray[i-1].nativeElement.style.opacity = '1';
                            imagesArray[i-1].nativeElement.style.transform = `translateX(0px)`;

                            if (Math.abs(ev.deltaX) >= 110) {
                                images.nativeElement.style.opacity = '0';
                                setTimeout(()=>{
                                    images.nativeElement.style.display = 'none'
                                }
                                ,500)
                            } else {
                                images.nativeElement.style.transform = `translateX(0px)`;
                            }
                        }

                    }else{
                        if(imagesArray[i+1]){
                            $('.point-active').removeClass("point-active").addClass("point")
                            $('#'+(i+1)).removeClass("point").addClass("point-active")
                            if (Math.abs(ev.deltaX) >= 110) {
                                imagesArray[i+1].nativeElement.style.transition = '0.2s ease-out';
                                images.nativeElement.style.opacity = '0';
                                imagesArray[i+1].nativeElement.style.display = 'grid';
                                imagesArray[i+1].nativeElement.style.opacity = '1';
                                imagesArray[i+1].nativeElement.style.transform = `translateX(0px)`;
                                setTimeout(()=>{
                                    images.nativeElement.style.display = 'none'
                                }
                                ,500)
    
                            } else {
                                images.nativeElement.style.transform = `translateX(0px)`;
                            }
                        }
                    }


                }
            })
            gesture.enable(true);
        }

    }


    ToggleOptionTable() {
        if ($(".table-optionsS").css("display") == 'grid') {
            $(".table-optionsS").css("display", "none");
        } else {
            $(".table-optionsS").css("display", "grid");
        }
    }

    Delete(){
        this.loading = true;
        $(".table-options").css("display", "none")
        this.FavoritoService.DeleteFavorite(this.anuncioGes.id).then(res=>{
            console.log(res)
            location.href='/home/favorito'

        })
    }



    //!DATA=====================================================================
    //?CARGA===================================================================================
    anuncio: any;
    anuncioGes:any
    urls_image: any = [];

    //?GESTION===================================================================================

    //?CONTROL===================================================================================
    url = environment.server;
    point_img = 0;
    premium: boolean = false;
    alert: number = 0;



    GoToBrowser(){
        if(this.premium){
            Browser.open({ url: 'https://api.whatsapp.com/send?phone='+this.anuncio.usuario.code_phone+this.anuncio.usuario.telefono });
        }else{
            this.alert = 1;
        }        
    }

    GoToCall(){
        if(this.premium){
            this.callNumber.callNumber(this.anuncio.usuario.code_phone+this.anuncio.usuario.telefono, true);
        }else{
            this.alert = 1;
        }
    }

    GetEdad(fecha: any) {
        var cumpleanos = new Date(fecha);
        var edad = this.hoy.getFullYear() - cumpleanos.getFullYear();
        var m = this.hoy.getMonth() - cumpleanos.getMonth();

        if (m < 0 || (m === 0 && this.hoy.getDate() < cumpleanos.getDate())) {
            edad--;
        }
        return edad;
    }


}
