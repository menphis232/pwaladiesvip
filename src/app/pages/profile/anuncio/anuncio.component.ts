import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AnunciosService } from 'src/app/services/anuncios/anuncios.service';
import { environment } from 'src/environments/environment';
import { SplashScreenStateService } from 'src/app/services/splash-screen-state.service';
import { ControlService } from 'src/app/services/control/control.service';
import { UserService } from 'src/app/services/user/user.service';
import { Router } from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

declare var $: any;


@Component({
    selector: 'app-anuncio',
    templateUrl: './anuncio.component.html',
    styleUrls: ['./anuncio.component.scss'],
})
export class AnuncioComponent implements OnInit {

    constructor(
        private AnunciosService:AnunciosService,
        private splashScreenStateService: SplashScreenStateService,
        private ControlService:ControlService,
        private UserService:UserService,
        private router: Router,
        private translate: TranslateService 

    ) { 
        translate.setDefaultLang('es');
        translate.use(localStorage.getItem('lang'));
    }

    ngOnInit() {

        this.datos = JSON.parse(localStorage.getItem("usuario"))

        this.mypack = JSON.parse(localStorage.getItem("pack"))
        console.log(this.mypack)

        if(this.mypack.pack == 1){
            this.myboost = "boost-standar.png"
            this.mycolor = "#567BFF"
        }
        if(this.mypack.pack == 2){
            this.myboost = "boost-plus.png"
            this.mycolor = "#EBA046"
        }
        if(this.mypack.pack == 3){
            this.myboost = "boost-extra.png"
            this.mycolor = "#29C56D"
        }
        if(this.mypack.pack == 4){
            this.myboost = "boost-carrusel.png"
            this.mycolor = "#567BFF"
        }
        if(this.AnunciosService.anuncio){
            this.PrepararAnuncio(this.AnunciosService.anuncio)
        }else{
            this.myboost = "Boost.png"
            this.isFirstAdd = true;
        }
    }

    //!DATA===========================================================================================================
    //?CARGA=================================================================================
    datos:any;
    urls_image=[];
    urls_video=[];
    urls_thumbs=[]
    //?GESTION=================================================================================
    id:any=null;
    anuncio:any={
        intereses:"",
        descripcion:"",
        hab_notificacion:false,
        hab_chat:false,
        hab_wts:false
    };
    videos:any=[];
    formData = new FormData();
    img_length=0;
    video_length=0;
    intereses_name:any=[];
    user_imagen_show:any=[];
    user_videos_show:any=[];
    urls_delete:any=[];
    urls_videos_delete:any=[];    
    //?CONTROL=================================================================================
    menu:boolean=false;
    display_interes:boolean=false;
    ctrl_intereses: any = [];
    url = environment.server;

    isFirstAdd:boolean=true;
    isFirstBoost:boolean=true;
    hoy = new Date();
    loading:boolean=false;
    done:boolean=false;
    blur:boolean=false;
    update:boolean=false;
    fase_update=0;
    mypack:any=null;
    myboost:any=null;
    mycolor:any=null;
    reno:boolean=false;
    show_video:boolean=false;
    thumbnail:any=[];

    //!FUNCIONES===========================================================================================================


    //?GESTION=================================================================================

        selectIdentidad(id: number, event: any) {
            console.log(id);
            if (!$(event.target).hasClass("btn-genero-active")) {
                $(event.target).removeClass("btn-genero");
                $(event.target).addClass("btn-genero-active");
                this.ctrl_intereses.push(id);
                this.intereses_name.push(event.target.textContent)
            } else {
                $(event.target).removeClass("btn-genero-active");
                $(event.target).addClass("btn-genero");
                this.ctrl_intereses.forEach(function (car: any, index: any, object: any) {
                    if (car == id) {
                        object.splice(index, 1);
                    }
                });

                this.intereses_name.forEach(function (car: any, index: any, object: any) {
                    if (car == event.target.textContent) {
                        object.splice(index, 1);
                    }
                });
            }
        }

    CargarImagen() {
        Camera.getPhoto({
            quality: 40,
            source: CameraSource.Photos,
            resultType: CameraResultType.Uri
        }).then(async res=>{
            console.log(res);
            let blob = await fetch(res.webPath).then(r => r.blob());
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.user_imagen_show.push({img:e.target.result, id:this.img_length+1,blob:blob});
            }
            reader.readAsDataURL(blob);
            this.img_length = this.img_length+1;
            
        });
 
    }

    CrearAnuncio(){
        this.anuncio.intereses = this.ctrl_intereses.join();

        this.img_length = 0;
        this.user_imagen_show.forEach((car: any, index: any, object: any) => {
            if(car.blob){
                this.img_length+=1;
                this.formData.append("imagen"+this.img_length, car.blob);
            }
        })

        this.video_length = 0;
        this.user_videos_show.forEach(async(car: any, index: any, object: any) => {
            if(car.blob){
                this.video_length+=1;
                this.formData.append("thumbnail"+this.video_length, this.dataURLtoFile(this.thumbnail[this.video_length-1],'img.jpg '));
                this.formData.append("video"+this.video_length, car.blob);
            }
        })

        this.formData.append("video_length", ""+this.video_length);
        this.formData.append("length", ""+this.img_length);
        this.formData.append("anuncio",JSON.stringify(this.anuncio))
        this.loading= true;

        this.AnunciosService.CrearAnuncio(this.formData).then((res:any)=>{
            console.log(res)
            this.loading= false;
            this.done = true;
            // location.href='/home'

        })
    }

    async UpdateAnuncio(){
        this.anuncio.intereses = this.ctrl_intereses.join();
        
        this.img_length = 0;
        this.user_imagen_show.forEach((car: any, index: any, object: any) => {
            if(car.blob){
                this.img_length+=1;
                this.formData.append("imagen"+this.img_length, car.blob);
            }
        })

        this.video_length = 0;
        this.user_videos_show.forEach((car: any, index: any, object: any) => {
            console.log(car.blob)
            console.log(index)
            console.log(object)
            if(car.blob){
                this.video_length+=1;
                this.formData.append("thumbnail"+this.video_length, this.dataURLtoFile(this.thumbnail[this.video_length-1],'img.jpg '));
                this.formData.append("video"+this.video_length, car.blob);
            }
        })
        this.formData.append("video_length", ""+this.video_length);
        this.formData.append("length", ""+this.img_length);
        this.formData.append("anuncio",JSON.stringify(this.anuncio))
        this.formData.append("img_delete",JSON.stringify(this.urls_delete))
        this.formData.append("video_delete",JSON.stringify(this.urls_videos_delete))
        this.fase_update = 1;
        console.log("id")
        console.log(this.id)
        await this.AnunciosService.UpdateAnuncio(this.formData,this.id)
        .then((res)=>{
            console.log(res)
            if(res.error){
                console.log("te jo")
            }else{
                this.UserService.ValidatePack().then(res=>{
                    console.log(this.UserService.getPack());
                    this.UserService.ValidatePack().then((res:any)=>{

                        localStorage.removeItem('pack')
            
                        if(res.anuncios){
                            localStorage.setItem('pack',JSON.stringify(res) )
                        }

                        this.fase_update = 2;
                        // locatsion.href='/home'
                        setTimeout(()=>{
                            this.fase_update = 0;
                            this.update=false;
                            this.blur = false;

                        }, 1000)

                        
                        
                    })
                });
                
            }
            console.log(res)
        })
        .catch((error)=>{
            console.log(error)
            this.fase_update = 0;
            this.update=false;
            this.blur = false;
        })
    }

    PrepararAnuncio(anuncio:any){
        this.isFirstAdd = false;
        this.anuncio.hab_notificacion = anuncio.hab_notificacion;
        this.anuncio.hab_chat = anuncio.hab_chat;
        this.anuncio.hab_wts = anuncio.hab_wts;
        this.anuncio.descripcion = anuncio.descripcion;
        this.urls_image = anuncio.urls.split(",");
        console.log(anuncio.url_video)
        if(anuncio.url_video != null){
            if(anuncio.url_video.split(",")[0] != ''){
                this.urls_video = anuncio.url_video.split(",");
                this.urls_thumbs = anuncio.thumbnails.split(',')
                this.video_length +=this.urls_video.length;
            }
        }
        
        this.id = anuncio.id;
        this.ctrl_intereses = anuncio.intereses.split(",");
        
        for (const interes in this.ctrl_intereses) {
            this.translate.get('identidad.upt_'+interes).subscribe((res: any) => {
                this.intereses_name.push(this.translate.instant(res))

            })
            // this.intereses_name.push(this.ControlService.generos[interes])
        }
        console.log("anuncio")
        console.log(anuncio)
        console.log(this.id)

    }

    DeleteImg(img:any, tipo:number){
        if(tipo == 1){
            this.urls_image.forEach((car: any, index: any, object: any) => {

                if (car == img) {
                    this.urls_delete.push(img);
                    object.splice(index, 1);
                }
            });
        }else{
            this.user_imagen_show.forEach((car: any, index: any, object: any) => {
                
                if (car.id == img.id) {
                    object.splice(index, 1);
                }
            });
        }

    }

    DeleteVid(video:any,tipo:number){
        console.log(video)
        if(tipo == 1){
            this.urls_video.forEach((car: any, index: any, object: any) => {
                console.log("car")
                console.log(car)
                console.log("video")
                console.log(video)
                console.log("index")
                console.log(index)
                if (car == video) {
                    this.urls_videos_delete.push(video);
                    this.urls_thumbs.splice(index,1)
                    object.splice(index, 1);
                    this.video_length -=1;
                    $('#video_here')[0].src=""; 
                }
            });
        }else{
            this.user_videos_show.forEach((car: any, index: any, object: any) => {
                
                console.log("car")
                console.log(car)
                console.log(index)
                console.log(object)
                if (car == video) {
                    object.splice(index, 1);
                    console.log(this.thumbnail)
                    this.thumbnail.splice(index, 1)
                    console.log(this.thumbnail)
                    $('#video_here')[0].src=''
                    this.video_length -=1;
                }
                

            });
        }
    }

    // ! GESTION VIDEOS =============================================================

    Video(ev){
        console.log(ev.target.files )
    }

 
    
    // AddVideo(control){
    //     var $source = $('#video_here');

    //     var video = document.createElement('video');
    //     video.preload = 'metadata';
    //     video.onloadedmetadata = function () {
    //         window.URL.revokeObjectURL(video.src);
    //         let arr:any = video.duration.toString().split('.')
    //         console.log(arr)
    //         if(arr[0] >62 || arr.length > 2){
    //             alert("El video es muy pesado");

    //         }else{
    //             $source[0].src = URL.createObjectURL(control.target.files[0]);
    //             $(".video").attr("src", $source);
    //         }
    //     }
    //     video.src = URL.createObjectURL(control.target.files[0]);
    // }
    
    UploadVideo(control) {
        var video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = ()=> {
            window.URL.revokeObjectURL(video.src);
            let arr:any = video.duration.toString().split('.')
            console.log(arr)
            if(arr[0] >80 || arr.length > 2){
                alert("El video es muy largo");

            }else{
                this.user_videos_show.push({blob:control.target.files[0]})
                this.video_length +=1;
                console.log(this.user_videos_show)
                control.target.value = ''; 
                this.loading=true;
                this.GenerateThumb()
            }
        }
        video.src = URL.createObjectURL(control.target.files[0]);
        // var fileUrl = window.URL.createObjectURL(fileInput.files[0]);
        // $source.parent()[0].load();
        // if(control.target.files[0].size > 2097152){
        //     alert("File is too big!");
        //  };
    }

    PlayVideo(index:number,type:number){
        var $source = $('#video_here');
        $('.content-slots > .active').removeClass('active')

        if(type == 1){
            $('#cardPlay'+index).addClass('active')
            console.log(this.user_videos_show[index].blob)
            $source[0].src = URL.createObjectURL(this.user_videos_show[index].blob);
            $(".video").attr("src", $source);
        }else{
            $('#cardPlayShow'+index).addClass('active')
            $source[0].src =this.url+this.urls_video[index];
            $(".video").attr("src", $source);
        }

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

    //?CONTROL=================================================================================
    ClickVideoInput(){
        $('.input-video').trigger('click')
    }
    check(event:any){
        console.log(event)
    }

    filtrarSelect(id:any){
        var res = this.ctrl_intereses.filter(res => res == id);
        return res.length > 0 ? true:false;
    }

    CerrarModal(){
        $(".bg-card").addClass("fadeOut")
        $(".bg-card").removeClass("fadeIn")
        $(".card-option").removeClass("onUp")
        $(".card-option").addClass("onDown")
        setTimeout(()=>{
            this.display_interes = false;
        }, 450)
    }

    change(tipo:number){
        if(tipo == 1){
            this.anuncio.hab_notificacion = !this.anuncio.hab_notificacion;
        }

        if(tipo == 2){
            this.anuncio.hab_chat = !this.anuncio.hab_chat;
        }

        if(tipo == 3){
            this.anuncio.hab_wts = !this.anuncio.hab_wts;
        }
        console.log(this.anuncio.hab_notificacion)
    }

    Cerrar(){
        this.splashScreenStateService.start();
        location.href = '/home';
    }

    checkUpdate(){
        if(this.mypack.boosts == 0){
            this.reno = true;
        }else{
            this.update=true;
        }
    }

    closeUpdate(){
        this.blur=false; 
        this.update=false;
    }

    Play(){
        console.log($('#video_here')[0].paused)
        if($('#video_here')[0].paused){
            console.log($('#video_here')[0].play())
            $('.bg-control').addClass('fadeOut')
            $('.btn-play').addClass('fadeOut')
            setTimeout(()=>{
                $('.bg-control').css('display','none')
                $('.btn-play').css('display','none')
            },400)
            
        }else{
            console.log($('#video_here')[0].pause())
            $('.bg-control').removeClass('fadeOut').addClass('fadeIn')
            $('.btn-play').removeClass('fadeOut').addClass('fadeIn')
            $('.bg-control').css('display','grid')
            $('.btn-play').css('display','block')
        }
        console.log($('#video_here')[0].paused)

        // console.log($('#video_here')[0])
        // $('#video_here').play()
    }

    ProgressBar(){
        let progres = ($('#video_here')[0].currentTime /$('#video_here')[0].duration)*100 
        $(".progress-bar").css('background', 'linear-gradient( to right, #FF3C76 0 '+progres+'% , #DFDFDF  0% '+(100-progres)+'%)');
    }

    Muted(){
        if($('#video_here')[0].muted){
            $('#video_here')[0].muted =false
            $(".btn-volume").find('img')[0].src='../../../../assets/img/volume.svg'
        }else{
            $('#video_here')[0].muted =true
            $(".btn-volume").find('img')[0].src='../../../../assets/img/muted.svg'

        }
    }

    GenerateThumb(){
        // var video = $('#video_here_u')[0];
        $('.content-video').prepend("<video id='vid_temp'></video>");
        var video = $('#vid_temp')[0];
        console.log(video)
        // video.style.display='grid'
        video.onloadedmetadata=(()=>{
            if (video.objectURL){
                URL.revokeObjectURL(video.src);
            }
            video.objectURL=false;
            var preview=document.createElement("canvas");
            preview.setAttribute("width",video.videoWidth);
            preview.setAttribute("height",video.videoHeight);
            var ctx=preview.getContext('2d');      
            video.play();
            video.muted=true;
            setTimeout(()=>{
            video.pause();

                // video.currentPostion=2000;
                ctx.drawImage(video,0,0,video.videoWidth,video.videoHeight);
                // cargar en una imagen HTML
                var dataURL = preview.toDataURL();
                this.thumbnail.push(dataURL);
                // this.loading=false;
                $('#vid_temp').remove()
                this.loading=false; 
            },1000);
        });
        video.src = URL.createObjectURL(this.user_videos_show[this.user_videos_show.length-1].blob);
        video.play();
        video.currentPostion=2000;
        video.pause();

    }

    dataURLtoFile(dataurl, filename) {
 
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), 
            n = bstr.length, 
            u8arr = new Uint8Array(n);
            
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        
        return new File([u8arr], filename, {type:mime});
    }


}
