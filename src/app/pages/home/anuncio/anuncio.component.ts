import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren ,ChangeDetectorRef} from '@angular/core';
import { environment } from 'src/environments/environment';
import { AnunciosService } from 'src/app/services/anuncios/anuncios.service';
import { Browser } from '@capacitor/browser';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';
import { DomController, Gesture, GestureController } from '@ionic/angular';
import {Location} from '@angular/common';
import { UserService } from 'src/app/services/user/user.service';
import { FavoritoService } from 'src/app/services/favorito/favorito.service';
import { Router } from '@angular/router';
import {TranslateService} from '@ngx-translate/core';


declare var $: any;

@Component({
    selector: 'app-anuncio',
    templateUrl: './anuncio.component.html',
    styleUrls: ['./anuncio.component.scss'],
})
export class AnuncioComponent implements OnInit, AfterViewInit {

    constructor(
        private AnunciosService: AnunciosService,
        private callNumber: CallNumber,
        private gestureCtrl: GestureController,
        private domCtrl: DomController,
        private location: Location,
        private UserService:UserService,
        private FavoritoService:FavoritoService,
        private ref: ChangeDetectorRef,
        private router: Router,
        private translate: TranslateService,
    ) { }
    
    @ViewChildren("images", {read: ElementRef }) images: QueryList<ElementRef>;

    ngOnInit() {
        if(sessionStorage.getItem('guest')){
            this.guest=true;
        }
        this.anuncio = this.AnunciosService.anuncio;
        this.urls_image = this.anuncio.urls.split(",");
        if(this.anuncio.url_video != null){
            if(this.anuncio.url_video.split(",")[0] != ''){
                this.urls_video = this.anuncio.url_video.split(",");
                this.urls_thumbs = this.anuncio.thumbnails.split(',')
            }
        }
        let intereses = this.anuncio.intereses.split(",");
        this.intereses_name=[];
        for (const interes in intereses) {
            this.translate.get('identidad.upt_'+interes).subscribe((res: any) => {
                this.intereses_name.push(this.translate.instant(res))
            })
            // this.intereses_name.push(this.ControlService.generos[parseInt(interes)])
        }
        this.intereses_name = this.intereses_name.join(', ')
        
        this.premium=this.UserService.getPremium();

        this.urls_image.forEach(async(car: any, index: any, object: any) => {
            this.urls_show.push({type:1, val:car})
        })
        this.urls_thumbs.forEach(async(car: any, index: any, object: any) => {
            this.urls_show.push({type:2, val:car})
        })
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
                    this.show_play = false;
                    
                    console.log(this.point_img)
                    if(ev.deltaX < 0){
                        if(imagesArray[i-1]){
                            imagesArray[i-1].nativeElement.style.display = 'none';
                        }
                    }
                    this.ref.detectChanges();

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
                    $('.point-active').removeClass("point-active").addClass("point")
                    console.log($('.section-photo > img'))
                    images.nativeElement.style.transition = '0.2s ease-out';
                    console.log(this.urls_show.slice().reverse()[i].type)
                    if(this.urls_show.slice().reverse()[i].type == 2){
                        this.show_play = true;
                    }else{
                        this.show_play = false;
                    }
                    this.index = i;

                    if(ev.deltaX < 0){
                        if(imagesArray[i-1]){
                            
                            imagesArray[i-1].nativeElement.style.transition = '0.2s ease-out';
                            imagesArray[i-1].nativeElement.style.display = 'grid';
                            imagesArray[i-1].nativeElement.style.opacity = '1';
                            imagesArray[i-1].nativeElement.style.transform = `translateX(0px)`;

                            if (Math.abs(ev.deltaX) >= 110) {
                                this.index = i-1;
                                if(this.urls_show.slice().reverse()[i-1].type == 2){
                                    this.show_play = true;
                                }else{
                                    this.show_play = false;
                                }
                                $('.point-active').removeClass("point-active").addClass("point")
                                $('#'+(i-1)).removeClass("point").addClass("point-active")
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
                            if (Math.abs(ev.deltaX) >= 110) {
                                if(this.urls_show.slice().reverse()[i+1].type == 2){
                                    this.show_play = true;
                                }else{
                                    this.show_play = false;
                                }
                                this.index = i+1;
                                $('.point-active').removeClass("point-active").addClass("point")
                                $('#'+(i+1)).removeClass("point").addClass("point-active")
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
                    this.ref.detectChanges();

                }
                
            })
            gesture.enable(true);
        }

    }

    load(a:number){
        console.log(a)
        var canvas:any = document.getElementById('canvas');
        var video:any = document.getElementById('video_here');
        video.currentTime = 3;
        setTimeout(function(){
            canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight)
        }, 500)
    }

    //!DATA=====================================================================
    //?CARGA===================================================================================
    anuncio:any;
    urls_show:any=[]
    urls_image:any=[];
    urls_video:any=[];
    urls_thumbs:any=[]
    //?GESTION===================================================================================
    intereses_name:any;
    //?CONTROL===================================================================================
    url = environment.server;
    point_img = 0;
    premium:boolean=false;
    alert:number=0;
    guest:boolean=false;
    alert_guest:boolean=false;
    show_play:boolean=false;
    index:any;
    hoy = new Date();

    GetUrls(urls:any){
        return urls.split(",");
    }

    cardCheck(){
        
        $(".temp-anuncio").addClass("card_check")
        this.AnunciosService.add_select.emit(true);

        setTimeout(()=>{
            $(".temp-anuncio").css("display","none")
            this.location.back();
        },450)
    }

    cardDiss(){
        $(".temp-anuncio").addClass("card_diss")
        this.AnunciosService.add_select.emit(true);

        setTimeout(()=>{
            $(".temp-anuncio").css("display","none")
            this.location.back();
        },450)
        if(this.premium){
            
            this.AnunciosService.RechazarAnuncio(this.anuncio.id).then(res=>{
                console.log(res)
            })
        }
    }

    cardFav(){
        if(this.guest){
            this.alert_guest = true;
        }else{
            $(".temp-anuncio").addClass("card_fav")
            this.AnunciosService.add_select.emit(true);

            setTimeout(()=>{
                $(".temp-anuncio").css("display","none")
                this.location.back();
            },450)
            this.FavoritoService.AddFavorite(this.anuncio.id).then(res=>{
                console.log(res)
            })
        }

    }

    GoToBrowser(){
        if(this.guest){
            this.alert_guest = true;
        }
        else if(this.premium){
            Browser.open({ url: 'https://api.whatsapp.com/send?phone='+this.anuncio.usuario.code_phone+this.anuncio.usuario.telefono });
        }else{
            this.alert = 1;
        }        
    }

    GoToCall(){
        if(this.guest){
            this.alert_guest = true;
        }
        else if(this.premium){
            this.callNumber.callNumber(this.anuncio.usuario.code_phone+this.anuncio.usuario.telefono, true);
        }else{
            this.alert = 1;
        }
    }

    GoLanding(){
        location.href='../landing'
    }

    PlayVideo(){

        if(this.guest){
            this.alert_guest = true;
            this.ref.detectChanges();
        }else{
            if(this.premium){
                console.log( this.urls_show.slice().reverse()[this.index])
                console.log( this.urls_video.slice().reverse()[this.index])
                this.AnunciosService.index_vid = this.urls_video.slice().reverse()[this.index];
                this.router.navigate(['home/anuncio/video'])
            }else{
                this.alert = 2;
            }
        }
        this.ref.detectChanges();
    }

    CerrarAlert(){
        this.alert = 0;
        this.ref.detectChanges();
    }
    

    CerrarGuest(){
        this.alert_guest = false;
        this.ref.detectChanges();
    }

    GetEdad(fecha:any){
        var cumpleanos = new Date(fecha);
        var edad = this.hoy.getFullYear() - cumpleanos.getFullYear();
        var m = this.hoy.getMonth() - cumpleanos.getMonth();

        if (m < 0 || (m === 0 && this.hoy.getDate() < cumpleanos.getDate())) {
            edad--;
        }
        return edad;
    }

}
