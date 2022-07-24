import { Component, ElementRef, OnInit, AfterViewInit, ViewChildren, QueryList, NgZone, ViewChild, ChangeDetectorRef  } from '@angular/core';
import { AnunciosService } from 'src/app/services/anuncios/anuncios.service';
import { SplashScreenStateService } from 'src/app/services/splash-screen-state.service';
import { environment } from 'src/environments/environment';
import { DomController, Gesture, GestureController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { NavController, Platform } from "@ionic/angular";
import { UserService } from 'src/app/services/user/user.service';
import { PagoService } from 'src/app/services/pago/pago.service';
import { FavoritoService } from 'src/app/services/favorito/favorito.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GeoLocationService } from 'src/app/services/location/geo-location.service';
import { FilePicker } from '@robingenz/capacitor-file-picker';
import {TranslateService} from '@ngx-translate/core';

// ! ASSETS ============================================
declare var $: any;
declare var google;

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {

    constructor(
        private splashScreenStateService: SplashScreenStateService,
        private AnunciosService: AnunciosService,
        private gestureCtrl: GestureController,
        private domCtrl: DomController,
        private router: Router,
        public navCtrl: NavController, 
        public platform: Platform,
        public UserService:UserService,
        private PagoService:PagoService,
        private FavoritoService:FavoritoService,
        private AuthService:AuthService,
        private GeoLocationService:GeoLocationService,
        private ref: ChangeDetectorRef,
        private translate: TranslateService 

    ) {
        this.platform.backButton.subscribeWithPriority(10, () => {
            console.log('Handler was called!');
        });
        translate.setDefaultLang('es');
        translate.use(localStorage.getItem('lang'));

    }


    @ViewChildren("card", {read: ElementRef }) card: QueryList<ElementRef>;
    map: any;
    chosen:any = 0;
    marker: any;
    text:any;
    data:any;
    lat:any;
    lng:any;
    detected:any;
    changing:any = 0;
    polygons:any = [];
    quartier:any = 0;

    cont = 10;

    async ngOnInit() {
        
        if(sessionStorage.getItem('guest')){
            this.guest=true;
            this.new=true;
            this.AnunciosService.GetAnunciosInv().then(res=>{
                this.anuncios.data = res.data;

                this.AnunciosService.GetCarruselInv().then(res=>{
                    this.carrusel = res;
                    this.splashScreenStateService.stop();
                })

                if(sessionStorage.getItem('max_ads')){
                    this.max_ads = parseInt(sessionStorage.getItem('max_ads'))
                }else{
                    sessionStorage.setItem('max_ads', '15')
                    this.max_ads = 15;
                }

            })

            this.user = {pais:'Spain'}
            this.ctrl_intereses = [0,1,2,3,4,5,6,7,8];
            this.sel_ciudad = ""
            this.sel_estado = ""
            this.GeoLocationService.getStates(this.user.pais).then(res => {
                this.estados = res;
                this.loading = false;
            });


        }else{
            
            this.token_push = localStorage.getItem('token_push');
            this.UserService.GetNotifys().then( (res:any)=>{
                this.UserService.notifys = res;
                let fil =res.filter(res=>{return res.tipo == 4} )
                if(fil.length >0){
                    sessionStorage.setItem('free','1')
                }else{
                    sessionStorage.removeItem('free')
                }
            })
            this.UserService.SaveToken(this.token_push)

            if(localStorage.getItem('new')){
                this.new=true;
                localStorage.removeItem('new')
            }

            this.GetAnuncios();
        
            this.UserService.ValidatePremium().then(res=>{
                if(res[0]){
                    this.UserService.setPremium(true);
                    this.premium = true;
                    if(localStorage.getItem('max_ads')){
                        localStorage.removeItem('max_ads')
                    }
                }else{

                    if(localStorage.getItem('max_ads')){
                        this.max_ads = parseInt(localStorage.getItem('max_ads'))
                    }else{
                        localStorage.setItem('max_ads', '15')
                        this.max_ads = 15;
                    }

                    this.UserService.ValMaxAds().then(res=>{
                        console.log(res)
                        if(res== 1){
                            this.max_ads = 0;
                            this.user.max_anuncios =1;
                            localStorage.setItem('usuario', JSON.stringify(this.user));
                        }else{
                            this.user.max_anuncios =0;
                            localStorage.setItem('usuario', JSON.stringify(this.user));
                        }
                    })
                }
    
                this.AnunciosService.GetMyAdd().then(res=>{
                    if(localStorage.getItem('myadd')){
                        localStorage.removeItem('myadd')
                    }
                    if(res[0]){
                        localStorage.setItem('myadd',JSON.stringify(res[0]) )
                    }
    
                    this.UserService.ValidatePack().then((res:any)=>{
    
                        if(localStorage.getItem('pack')){
                            localStorage.removeItem('pack')
                        }
            
                        if(res.anuncios){
                            localStorage.setItem('pack',JSON.stringify(res) )
                        }
    
                        this.AnunciosService.GetCarrusel().then(res=>{
                            this.carrusel = res;
                            this.splashScreenStateService.stop();
                        })
                        
                    })
                    .catch(error=>{
                        console.log("error")
                        console.log(error)
                        localStorage.clear();
                        sessionStorage.clear();
                        this.splashScreenStateService.start();
                        location.href='/'
                    })
    
                })
                .catch(error=>{
                    console.log("error")
                    console.log(error)
                    localStorage.clear();
                    sessionStorage.clear();
                    this.splashScreenStateService.start();
                    location.href='/'
                })

                this.user = JSON.parse(localStorage.getItem("usuario"))
                this.ctrl_intereses = this.user.interes_identidad.split(",");
                this.sel_ciudad = this.user.ciudad
                this.sel_estado = this.user.estado
                
                this.GeoLocationService.getStates(this.user.pais).then(res => {
                    this.estados = res;
                    this.loading = false;
                });
                this.GeoLocationService.getCities(this.sel_estado).then(res => {
                    this.ciudades = res;
                    this.loading = false;
                });
            })
            .catch(error=>{
                console.log("error")
                console.log(error)
                localStorage.clear();
                sessionStorage.clear();
                this.splashScreenStateService.start();
                location.href='/'
            })
        }

    }


    async ngAfterViewInit() {
        this.card.changes
        .subscribe(() => {
            let cardArray = this.card.toArray();
            this.cards_length = cardArray.length;
            this.cards_arrays=[];
            this.cards_arrays=cardArray;
            this.index_card = cardArray.length-1;

            if(cardArray[this.index_card-1]){
                cardArray[this.index_card-1].nativeElement.style.display = 'grid';
            }
            if(cardArray[this.index_card]){
                cardArray[this.index_card].nativeElement.style.display = 'grid';
            }else{
                if(cardArray.length > 0){
                    cardArray[this.index_card+1].nativeElement.style.display = 'grid';
                }
            }
            this.GestionAnunciosX(cardArray)
            this.GestionAnunciosY(cardArray)
        })

        
        this.AnunciosService.add_select.subscribe(res=>{
            
            $(this.add_select[0]).remove()
            this.card.forEach((car: any, index: any, object: any)=> {
                
                if (car.nativeElement.id == this.add_select[0].id) {
                    object.splice(index, 1);
                }
            });
        })

        $( ()=> {

            $(document).on("click","#open_filtro",()=>{
                color_linea("","","");
            });

            $( document ).on("input","#line-km",()=>{
                // if($( "#rango-distancia-min" ).val() - $( "#rango-distancia-max" ).val() >= 0){
                //     $( "#rango-distancia-min" ).val($( "#rango-distancia-max" ).val()) 
                // }
                this.km = $("#line-km").val()
                color_linea("","","");

            });
            function color_linea(id_min:string, id_max:string, id_linea:string){
                let val1= ($("#line-km").val() /100) *100;
                $("#line-km").css('background', 'linear-gradient( to right, #FF3C76 0 '+val1+'% , #DFDFDF  0% '+(100-val1)+'%)');
            }

        });

    }

    GestionAnunciosX(cardArray) {
        if(cardArray[this.index_card-2]){
            cardArray[this.index_card-2].nativeElement.style.display = 'grid';
        }
        if(cardArray[this.index_card-1]){
            cardArray[this.index_card-1].nativeElement.style.display = 'grid';
        }else{
            if(cardArray.length > 0){
                cardArray[this.index_card].nativeElement.style.display = 'grid';
            }
        }
        for (let i = 0; i < cardArray.length; i++) {
            const card = cardArray[i];
            if(i < cardArray.length-2){
                // card.nativeElement.style.display = 'none'
            }
            const gesture = this.gestureCtrl.create({
                el: card.nativeElement,
                threshold: 5,
                gestureName: 'moveX',
                disableScroll: true,
                direction:'x',
                gesturePriority:3,
                onMove: ev => {
                    this.index_card = i;
                    if(cardArray[i-1]){
                        cardArray[i-1].nativeElement.style.display = 'grid';
                    }
                    const currentX = ev.currentX;
                    const currentY = ev.currentY;
                    card.nativeElement.style.transform = `
                        translateX(${ev.deltaX}px) 
                        rotate(${(currentX - ev.startX) / 12}deg)
                    `;
                },
                onEnd: ev => {
                    card.nativeElement.style.transition = '0.2s ease-out';

                    if (Math.abs(ev.deltaX) >= 110) {
                        card.nativeElement.style.opacity = '0';
                        
                        cardArray.splice(i)
                        this.cards_length = cardArray.length
                        $(card.nativeElement).remove()
                        this.anuncios.data.splice(0,1)
                        this.cards_arrays=cardArray;
                        if(cardArray[i-2]){
                            cardArray[i-2].nativeElement.style.display = 'grid';
                        }

                        if(!this.guest){
                            if(this.cards_arrays.length <5 && this.anuncios.index != ''){
                                this.GetAnuncios();
                            }
                        }

                        setTimeout(()=>{
                            card.nativeElement.style.display = 'none'

                        }
                        ,1000)

                    } else {
                        card.nativeElement.style.transform = `translateX(0px)`;
                    }

                }
            })
            gesture.enable(true);
        }

    }

    GestionAnunciosY(cardArray) {
        if(cardArray[this.index_card-2]){
            cardArray[this.index_card-2].nativeElement.style.display = 'grid';
        }
        if(cardArray[this.index_card-1]){
            cardArray[this.index_card-1].nativeElement.style.display = 'grid';
        }else{
            if(cardArray.length > 0){
                cardArray[this.index_card].nativeElement.style.display = 'grid';
            }
        }
        for (let i = 0; i < cardArray.length; i++) {
            const card = cardArray[i];
            const gesture = this.gestureCtrl.create({
                el: card.nativeElement,
                threshold: 5,
                gestureName: 'moveY',
                disableScroll: true,
                direction:'y',
                gesturePriority:2,
                onMove: ev => {
                    if(cardArray[i-1]){
                        cardArray[i-1].nativeElement.style.display = 'grid';
                    }
                    if(ev.deltaY > -130 && ev.deltaY < 0){
                        card.nativeElement.style.transform = `
                            translateY(${ev.deltaY}px) 
                        `;
                    }
                },
                onEnd: ev => {
                    if (ev.deltaY < -100) {

                        if( this.guest){
                            this.alert_guest=true;
                            $( "#home" ).trigger( "click" );
                        }else{
                            this.cardFav(card.nativeElement.id.split('card')[1],{id:card.nativeElement.id.split('card')[1]})
                        }
                        card.nativeElement.style.opacity = '0';
                        if(cardArray[i-2]){
                            cardArray[i-2].nativeElement.style.display = 'grid';
                        }
                        cardArray.splice(i)
                        this.cards_length = cardArray.length
                        $(card.nativeElement).remove()
                        this.anuncios.data.splice(0,1)
                        this.cards_arrays=cardArray;
                        if(!this.guest){
                            if(this.cards_arrays.length <5 && this.anuncios.index != ''){
                                this.GetAnuncios();
                            }
                        }
                        setTimeout(()=>{
                            card.nativeElement.style.display = 'none'
                        }
                        ,800)
 
                    } else {
                        card.nativeElement.style.transform = `translateY(0px)`;
                    }
                    card.nativeElement.style.transition = '0.2s ease-out';
                }
            })
            gesture.enable(true);
        }

    }

    

    //!DATA=====================================================================
    latitude: number;
    longitude: number;
    zoom: number;
    address: string;
    private geoCoder;
    //?CARGA===================================================================================
    anuncios: any = {
        data: [],
        length: null,
        index: ""
    };
    user:any=null;
    estados: any = [];
    ciudades: any = [];
    token_push:any;
    //?GESTION===================================================================================
    anuncio: any = [];
    carrusel:any=[];

    sel_estado:any="";
    sel_ciudad:any="";
    edad_min:number=18;
    edad_max:number=60;
    //?CONTROL===================================================================================
    add_select:any;
    loggedIn: boolean = false;
    load: boolean = false;
    hoy = new Date();
    display_filtro:boolean=false;
    show_distancia:boolean=false;
    ctrl_intereses: any = [];
    // * MODALES ================================
    ctrl_menu: number = 0;
    server = environment.server;
    premium:boolean=false;
    alert:number=0;
    guest:boolean=false;
    alert_guest:boolean=false;
    new:boolean=false;
    filtro_fase:number=0;
    display_estado:boolean=false;
    display_ciudad:boolean=false;
    estado_filtro:any=[];
    ciudad_filtro:any=[];
    loading:boolean=false;
    filtro:string="";
    cards_length:any;
    index_card:any; 
    cards_arrays:any;
    km:number = 100;
    alert_max:boolean=false;
    max_ads:number=0;
    max_fav:boolean=false;
    //!FUNCIONES=============================================================
    //?CARGA=============================================================
    GetAnuncios() {
        this.AnunciosService.GetAnuncios(this.anuncios.index).then(res => {

            if(this.anuncios.index == ''){
                this.anuncios.data = res.data;
                this.anuncios.length = res.total;
                this.anuncio = this.anuncios.data[0]
            }else{
                res.data.forEach((car: any, index: any, object: any)=> {
                    this.anuncios.data.push(car);
                });
            }
            
            if(res.next_page_url != null){
                this.anuncios.index = res.next_page_url.split('page=')[1]
                console.log(this.anuncios.index)
            }else{
                this.anuncios.index="";
            }
        });
    }


    CargarCiudad() {
        this.ciudades = null;
        this.sel_ciudad = null;
        this.loading = true;
        this.GeoLocationService.getCities(this.sel_estado).then(res => {
            this.ciudades = res;
            this.loading = false;
        });
    }

    //?GESTION============================================================

    PassAnuncio() {
        this.anuncio.usuario.name = 'prueba';
        let actual = this.anuncios.index + 1;
    }


    showImage(urls: any) {
        return this.server + urls.split(",")[0];
    }


    cardCheck(id:any){

        if(localStorage.getItem('max_ads') && !this.guest){

            if(this.max_ads >0){
                this.max_ads -=1;
                localStorage.setItem('max_ads', this.max_ads.toString())
                $("#"+id).addClass("card_check")

                setTimeout(()=>{
                    $("#"+id).css("display","none")
                    $(this.cards_arrays[this.cards_arrays.length-1].nativeElement).remove()
                    this.anuncios.data.splice(0,1)
                    if(this.cards_arrays[this.cards_arrays.length-2]){
                        $(this.cards_arrays[this.cards_arrays.length-2].nativeElement).css('display','grid')
                    }
                    
                },500)
            }else{
                this.alert_max =true;

                if(this.user.max_anuncios ==0 || this.user.max_anuncios == null){
                    this.UserService.MaxAds().then(()=>{
                        this.user.max_anuncios = 1;
                    })
                }
            }

        }else if(sessionStorage.getItem('max_ads')){
            if(this.max_ads >0){
                this.max_ads -=1;
                sessionStorage.setItem('max_ads', this.max_ads.toString())
                $("#"+id).addClass("card_check")

                setTimeout(()=>{
                    $("#"+id).css("display","none")
                    $(this.cards_arrays[this.cards_arrays.length-1].nativeElement).remove()
                    this.anuncios.data.splice(0,1)
                    if(this.cards_arrays[this.cards_arrays.length-2]){
                        $(this.cards_arrays[this.cards_arrays.length-2].nativeElement).css('display','grid')
                    }
                    
                },500)
            }else{
                this.alert_max =true;
            }
        }
        else{
            $("#"+id).addClass("card_check")

            setTimeout(()=>{
                $("#"+id).css("display","none")
                $(this.cards_arrays[this.cards_arrays.length-1].nativeElement).remove()
                this.anuncios.data.splice(0,1)
                if(this.cards_arrays[this.cards_arrays.length-2]){
                    $(this.cards_arrays[this.cards_arrays.length-2].nativeElement).css('display','grid')
                }
                if(!this.guest){
                    if(this.cards_arrays.length <5 && this.anuncios.index != ''){
                        this.GetAnuncios();
                    }
                }
                
            },500)
        }
    }

    cardDiss(id:any,anuncio:any){

        if(localStorage.getItem('max_ads')){

            if(this.max_ads >0){
                this.max_ads -=1;
                localStorage.setItem('max_ads', this.max_ads.toString())
                $("#"+id).addClass("card_diss")
            
                setTimeout(()=>{
                    $("#"+id).css("display","none")
                    $(this.cards_arrays[this.cards_arrays.length-1].nativeElement).remove()
                    this.anuncios.data.splice(0,1)
                    if(this.cards_arrays[this.cards_arrays.length-2]){
                        $(this.cards_arrays[this.cards_arrays.length-2].nativeElement).css('display','grid')
                    }
                },450)
    
                if(!this.guest){
                    this.AnunciosService.RechazarAnuncio(anuncio.id)
                }
            }else{
                this.alert_max =true;
                if(this.user.max_anuncios ==0 || this.user.max_anuncios == null){
                    this.UserService.MaxAds().then(()=>{
                        this.user.max_anuncios = 1;
                    })
                }
            }

        }else{
            $("#"+id).addClass("card_diss")
            
            setTimeout(()=>{
                $("#"+id).css("display","none")
                $(this.cards_arrays[this.cards_arrays.length-1].nativeElement).remove()
                this.anuncios.data.splice(0,1)
                if(this.cards_arrays[this.cards_arrays.length-2]){
                    $(this.cards_arrays[this.cards_arrays.length-2].nativeElement).css('display','grid')
                }
            },450)

            if(!this.guest){
                if(this.cards_arrays.length <5 && this.anuncios.index != ''){
                    this.GetAnuncios();
                }
                this.AnunciosService.RechazarAnuncio(anuncio.id)
            }
        }

    }

    cardFav(id:any,anuncio:any){
        if( this.guest){
            this.alert_guest=true;
            $( "#home" ).trigger( "click" );
        }
        else{

            if(localStorage.getItem('max_ads')){

                if(this.max_ads >0){
                    this.max_ads -=1;
                    localStorage.setItem('max_ads', this.max_ads.toString())
                    
                    $("#"+id).addClass("card_fav")
    
                    $(this.cards_arrays[this.cards_arrays.length-1].nativeElement).remove()
                    this.anuncios.data.splice(0,1)
                    if(this.cards_arrays[this.cards_arrays.length-2]){
                        $(this.cards_arrays[this.cards_arrays.length-2].nativeElement).css('display','grid')
                    }
    
                    setTimeout(()=>{
                        $("#"+id).css("display","none")
                    },450)
                    this.FavoritoService.AddFavorite(anuncio.id).then(res=>{
                        
                    }).catch(res=>{
                        this.max_fav=true;
                    })
                }else{
                    this.alert_max =true;
                    if(this.user.max_anuncios ==0 || this.user.max_anuncios == null){
                        this.UserService.MaxAds().then(()=>{
                            this.user.max_anuncios = 1;
                        })
                    }
                }
    
            }else{
            
                if(this.cards_arrays.length <5 && this.anuncios.index != ''){
                    this.GetAnuncios();
                }
                $("#"+id).addClass("card_fav")

                setTimeout(()=>{
                    $(this.cards_arrays[this.cards_arrays.length-1].nativeElement).remove()
                    this.anuncios.data.splice(0,1)
                    if(this.cards_arrays[this.cards_arrays.length-2]){
                        $(this.cards_arrays[this.cards_arrays.length-2].nativeElement).css('display','grid')
                    }
                    $("#"+id).css("display","none")
                },450)
                this.FavoritoService.AddFavorite(anuncio.id).then(res=>{
                    
                }).catch(res=>{
                    this.max_fav=true;
                })
            }
        } 
    }

    SelectEstado(estado:string){
        this.sel_estado = estado;
        this.CargarCiudad();
        this.CerrarModal();
        this.filtro="";
        this.estado_filtro=[];
    }

    SelectCiudad(ciudad:string){
        this.sel_ciudad = ciudad;
        this.CerrarModal();
        this.filtro="";
        this.ciudad_filtro=[];
    }

    Filtrar(){
        if(!this.show_distancia){
            this.latitude=0;
            this.longitude=0;
        }

        let filtro={
            estado:this.sel_estado,
            ciudad:this.sel_ciudad,
            intereses:this.ctrl_intereses.join(),
            edad_min: this.edad_min,
            edad_max: this.edad_max,
            lat: this.latitude,
            lng: this.longitude,
            km: this.km
        }
        this.loading=true;

        if(sessionStorage.getItem('guest')){
            this.AnunciosService.FitrarInv(filtro).then( (res:any)=>{
                this.anuncios.data = res.data
                this.loading=false;
                this.display_filtro = false;    
            })
            
        }else{
            this.AnunciosService.Fitrar(filtro).then( (res:any)=>{
                this.anuncios.data = res.data
                this.loading=false;
                this.display_filtro = false;
    
            })
        }


    }

    ReturnFiltro(){
        
        this.filtro_fase = 0;
    }

    //?CONTROL==============================================================================
    GoFav(){
        this.loading=true;
        this.splashScreenStateService.start()
        location.href='/home/favorito'
    }
    filtrarSelect(id:any){

        var res;

        res = this.ctrl_intereses.filter(res => res == id);

        return res.length > 0 ? true:false;
    }

    selectIdentidad(id: number, event: any) {
        if (!$(event.target).hasClass("btn-genero-active")) {
            $(event.target).removeClass("btn-genero");
            $(event.target).addClass("btn-genero-active");
            
                this.ctrl_intereses.push(id);
        } else {
            $(event.target).removeClass("btn-genero-active");
            $(event.target).addClass("btn-genero");

            this.ctrl_intereses.forEach(function (car: any, index: any, object: any) {
                if (car == id) {
                    object.splice(index, 1);
                }
            });
        }
    }

    OpenAnuncio(anuncio:any, id:any){
        this.add_select = $("#"+id);
        this.AnunciosService.anuncio = anuncio;
        this.router.navigate(['home/anuncio'])
    }

    OpenAnuncioPopular(anuncio:any){
        if(this.guest){
            this.alert_guest=true;
        }
        else if(this.premium){
            this.OpenAnuncio(anuncio,'null')
        }else{
            this.alert=1;
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

    nav(menu: number) {
        this.ctrl_menu = menu;
    }

    getKilometros = function(lat1,lon1,lat2,lon2)
    {
        let rad = function(x) {return x*Math.PI/180;}
        var R = 6378.137; //Radio de la tierra en km
        var dLat = rad( lat2 - lat1 );
        var dLong = rad( lon2 - lon1 );
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLong/2) * Math.sin(dLong/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;
        return d.toFixed(3); //Retorna tres decimales
    }

    async OpenFiltro(){

        const coordinates = await Geolocation.getCurrentPosition().then(res=>{
            console.log(res)
            this.latitude = res.coords.latitude
            this.longitude = res.coords.longitude
            console.log(res.coords.latitude)
            console.log(res.coords.longitude)
            this.show_distancia = true;
            this.display_filtro = true;

            setTimeout(()=>{
                let val1= ($("#line-km").val() /100) *100;
                $("#line-km").css('background', 'linear-gradient( to right, #FF3C76 0 '+val1+'% , #DFDFDF  0% '+(100-val1)+'%)');
                console.log(val1)
            },420)

        }).catch(res=>{
            console.log("res")
            console.log(res)
            
            this.show_distancia = false;
            this.display_filtro = true;

        });

        // Geolocation.requestPermissions().then( async ()=>{
            
        //     const coordinates = await Geolocation.getCurrentPosition().then(res=>{
        //         this.latitude = res.coords.latitude
        //         this.longitude = res.coords.longitude
        //         this.show_distancia = true;
        //         this.display_filtro = true;
        //         this.PintarRango()
        //     }).catch(res=>{
        //         console.log("res")
        //         console.log(res)
        //         if(res.message=='location disabled'){
        //             alert('Para utilizar el filtro de distancia debes activar tu ubicación')
        //         }
        //         this.show_distancia = false;
        //         this.display_filtro = true;
        //         this.PintarRango()
        //     });
        // } ).catch(res=>{
        //     console.log("ERROR")
        //     this.display_filtro = true;
        //     this.PintarRango()
        // })
        this.PintarRango()

    }

    CloseFiltro(){
        this.display_filtro =false
    }

    GoLanding(){
        location.href='../landing'
    }

    CloseNew(){
        this.new=false;
    }

    CerrarModal(){
        $(".filtros").removeClass("fadeIn")
        $(".filtros").addClass("fadeOut")
        $(".filtros").removeClass("fadeIn")
        $(".card-option").removeClass("onUp")
        $(".card-option").addClass("onDown")
        setTimeout(()=>{
            this.display_estado = false;
            this.display_ciudad = false;
        }, 450);
        this.filtro = "";
    }

    
    filtrar(){

        if(this.display_estado){
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


    PintarRango(){
        setTimeout(()=>{
            let val1=  ( (this.edad_min-18) /(60-18)) *100;
            let val2=( (this.edad_max -18) / (60-18)) *100;
            let valk= ($("#line-km").val() /100) *100;
            $("#line-km").css('background', 'linear-gradient( to right, #FF3C76 0 '+valk+'% , #DFDFDF  0% '+(100-valk)+'%)');
            $("#line-distancia").css('background', 'linear-gradient( to right, #DFDFDF '+(val1)+'%'+', #FF3C76 '+(val1)+'%'+', #FF3C76 '+val2+'%'+', #DFDFDF '+val2+'%'+')');
        },500)
    
    }

    LimpiarFiltro(){
        this.edad_min=18;
        this.edad_max=60;
        this.km=100;
        if(this.guest){
            this.ctrl_intereses = [0,1,2,3,4,5,6,7,8]
        }else{
            this.ctrl_intereses = this.user.interes_identidad.split(",");
        }
        this.sel_ciudad = this.user.ciudad
        this.sel_estado = this.user.estado
        this.PintarRango()
    }

    LimpiarFiltroLocation(){
        this.sel_ciudad = null
        this.sel_estado = null
    }

    getCantidad(type:boolean, anuncio:any){
        if(type){
            return anuncio.urls.split(",").length;
        }else{
            return anuncio.url_video.split(",").length;
        }
    }
}
