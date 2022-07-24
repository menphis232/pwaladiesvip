import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MarketService } from 'src/app/services/market/market.service';
import { DomController, Gesture, GestureController } from '@ionic/angular';
import { GeoLocationService } from 'src/app/services/location/geo-location.service';
import { Geolocation } from '@capacitor/geolocation';
import { Browser } from '@capacitor/browser';

declare var $: any;

@Component({
    selector: 'app-market',
    templateUrl: './market.component.html',
    styleUrls: ['./market.component.scss'],
})
export class MarketComponent implements OnInit, AfterViewInit {

    constructor(
        private MarketService:MarketService,
        private gestureCtrl: GestureController,
        private GeoLocationService:GeoLocationService
    ) { }


    @ViewChildren("images", {read: ElementRef }) images: QueryList<ElementRef>;

    ngOnInit() { 

        if(sessionStorage.getItem('guest')){
            this.guest=true;
            this.user = {pais:"Spain"}
            this.sel_ciudad = ""
            this.sel_estado = ""
            this.GeoLocationService.getStates(this.user.pais).then(res => {
                this.estados = res;
                this.loading = false;
            });
            
        }else{
            this.user = JSON.parse(localStorage.getItem("usuario"))
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
        }
        this.GetDestacados()


        // $( function() {
        //     $('div').on( 'scroll',  (e)=>{
                
        //         var elem = $(e.currentTarget);
        //         console.log( (e.currentTarget ))
        //         if ( ( (elem[0].scrollHeight - elem.scrollTop())-30 ) <= elem.outerHeight()) {
        //             console.log("bottom");
        //         }
        //     });
        // });
    }

    async ngAfterViewInit() {
        this.GestionAnunciosX(this.images.toArray())

        this.images.changes
        .subscribe(() => {
            let imagesArray = this.images.toArray();
            this.GestionAnunciosX(imagesArray)
        })

        $( () =>{

            $(document).on("click","#open_filtro",()=>{
                color_linea("","","");
            });

            $( document ).on("input","#line-km",()=>{
                // if($( "#rango-distancia-min" ).val() - $( "#rango-distancia-max" ).val() >= 0){
                //     $( "#rango-distancia-min" ).val($( "#rango-distancia-max" ).val()) 
                // }
                color_linea("","","");
                this.km = $("#line-km").val()

            });
            function color_linea(id_min:string, id_max:string, id_linea:string){
                let val1= ($("#line-km").val() /100) *100;
                $("#line-km").css('background', 'linear-gradient( to right, #FF3C76 0 '+val1+'% , #DFDFDF  0% '+(100-val1)+'%)');
                console.log(val1)
            }

        });

    }

    GestionAnunciosX(imagesArray) {
        console.log(imagesArray.length)
        
        for (let i = 0; i < imagesArray.length; i++) {
            const images = imagesArray[i];
            console.log(this.point_img)
            const gesture = this.gestureCtrl.create({
                el: images.nativeElement,
                threshold: 5,
                gestureName: 'moveX',
                disableScroll: true,
                direction:'x',
                gesturePriority:3,
                onStart: ev =>{
                    this.point_img = i;

                    
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


    //!DATA===========================================================================================================
    //?CARGA=================================================================================
    destacados:any;

    //?GESTION=================================================================================
    user:any=null;
    estados: any = [];
    ciudades: any = [];

    current:number= 0;
    last:number=0;
    data:any;
    urls_img:any;
    data_show:any=null;
    latitude:any;
    longitude:any;
    sel_estado:any="";
    sel_ciudad:any="";
    search:string="";
    //?CONTROL=================================================================================
    display_market: boolean = true ;
    display_res: boolean = false;
    display_show:boolean=false;
    display_filtro:boolean=false;
    show_distancia:boolean=false;
    url = environment.server;
    point_img = 0;
    loading:boolean=false;
    loading_tab:boolean=false;
    nombres_cat=[
        "MASAJES ERÓTICOS",
        "JUGUETES SEXUALES",
        "ESPACIOS SEXUALES",
        "AGENCIA MATRIMONIAL"
    ]
    guest:boolean=false;

    nombre_cat:string=""
    new:boolean=false;
    filtro_fase:number=0;
    display_estado:boolean=false;
    display_ciudad:boolean=false;
    estado_filtro:any=[];
    ciudad_filtro:any=[];
    filtro:string="";
    km:number=100;
    //!FUNCIONES===========================================================================================================


    CargarCiudad() {
        this.ciudades = null;
        this.sel_ciudad = null;
        this.loading = true;
        this.GeoLocationService.getCities(this.sel_estado).then(res => {
            this.ciudades = res;
            this.loading = false;
        });
    }
    
    GetDestacados(){
        this.MarketService.Destacados().then(res=>{
            this.destacados=res
        })
    }

    //?GESTION=================================================================================
    
    SelectCat(id:number){
        this.loading=true;

        if(sessionStorage.getItem('guest')){
            this.MarketService.SearchNegocioInv(id).then(res=>{
                console.log(res)
                this.current = res.current_page;
                this.last = res.last_page;
                this.data = res;
                this.display_market=false;
                this.display_res=true;
                this.loading=false;
                this.nombre_cat = this.nombres_cat[id]
            })
        }else{
            this.MarketService.SearchNegocio(id).then(res=>{
                console.log(res)
                this.current = res.current_page;
                this.last = res.last_page;
                this.data = res;
                this.display_market=false;
                this.display_res=true;
                this.loading=false;
                this.nombre_cat = this.nombres_cat[id]
            })
        }

    }
    
    OpenShow(data:any){
        this.data_show=data;
        this.display_res= false;
        this.display_show= true;
        this.urls_img = data.images.split(",");
        this.point_img = this.urls_img.length-1;
        console.log(data)
    }

    Filtrar(){
        this.loading = true;
        if(!this.show_distancia){
            this.latitude=0;
            this.longitude=0;
        }
        
        let filtro={
            estado:this.sel_estado,
            ciudad:this.sel_ciudad,
            lat: this.latitude,
            lng: this.longitude,
            km:this.km
        }

        if(this.guest){
            this.MarketService.FitrarInv(filtro,'').then( (res:any)=>{
                // this.ref.detectChanges()
                this.data = res
                this.display_market=false;
                this.display_res=true;
                this.display_filtro =false
                this.loading=false;
                console.log(res.data)
    
            })
        }else{
            this.MarketService.Fitrar(filtro,'').then( (res:any)=>{
                // this.ref.detectChanges()
                this.data = res
                this.display_market=false;
                this.display_res=true;
                this.display_filtro =false
                this.loading=false;
                console.log(res.data)

            })
        }
        console.log(filtro)
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

    Search(){
        this.loading=true;
        if(this.search == ""){
            this.loading=false;
            return
        }
        this.MarketService.Search(this.search).then( (res:any)=>{
            this.data = res
            this.display_market=false;
            this.display_res=true;
            this.loading=false;
            console.log(res.data)
        })
    }

    //?CONTROL=================================================================================

    SelectEstado(estado:string){
        this.sel_estado = estado;
        this.CargarCiudad();
        this.CerrarModal();
    }

    SelectCiudad(ciudad:string){
        this.sel_ciudad = ciudad;
        this.CerrarModal();
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

    GetImg(img:any){
        let urls_img = img.split(",");
        return urls_img[0]
    }

    CloseRes(){
        this.current = 0;
        this.last = 0;
        this.data = null;
        this.display_market= true;
        this.display_res=false;
        this.nombre_cat = '';

    }

    CloseShow(){
        this.display_res= true;
        this.display_show=false;
        this.nombre_cat = '';
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
    }

    CloseFiltro(){
        this.display_filtro =false
    }

    GoToBrowser(){
        
            Browser.open({ url: this.data_show.web });
              
    }



    LimpiarFiltro(){
        this.km=100;
        this.sel_ciudad = this.user.ciudad
        this.sel_estado = this.user.estado
        this.PintarRango()
    }

    PintarRango(){

        setTimeout(()=>{

            let val1= ($("#line-km").val() /100) *100;
            $("#line-km").css('background', 'linear-gradient( to right, #FF3C76 0 '+val1+'% , #DFDFDF  0% '+(100-val1)+'%)');
            console.log(val1)
        }, 200)
       
    }

    LimpiarFiltroLocation(){
        this.sel_ciudad = null
        this.sel_estado = null
    }


    Scroll(e){
        var elem = $(e.currentTarget);
        
        if ( ( (elem[0].scrollHeight - elem.scrollTop())-25) <= elem.outerHeight()) {
            
            if(this.data.next_page_url != null){
                
                this.loading_tab=true;
                
                if(this.data.next_page_url.split('auth/')[1].includes('filter-market')){
                    let filtro={
                        estado:this.sel_estado,
                        ciudad:this.sel_ciudad,
                        lat: this.latitude,
                        lng: this.longitude,
                        km:this.km
                    }
                    if(this.guest){
                        this.MarketService.FitrarInv(filtro,this.data.current_page+1).then((res:any)=>{
                            for (const property of res.data) {
                                this.data.data.push(property)
                            }
                            this.data.next_page_url = res.next_page_url
                            this.loading_tab=false;
        
                        })
    
                    }else{
                        
                        this.MarketService.Fitrar(filtro,this.data.current_page+1).then( (res:any)=>{
                            // this.ref.detectChanges()
                            for (const property of res.data) {
                                this.data.data.push(property)
                            }
                            this.data.next_page_url = res.next_page_url
                            this.loading_tab=false;
                            console.log(res.data)
            
                        })
                    }

                }else{

                    if(this.guest){
                        this.MarketService.PaginateInv(this.data.next_page_url).then((res:any)=>{
                            for (const property of res.data) {
                                this.data.data.push(property)
                            }
                            this.data.next_page_url = res.next_page_url
                            this.loading_tab=false;
        
                        })
    
                    }else{
                        this.MarketService.Paginate(this.data.next_page_url).then((res:any)=>{
                            for (const property of res.data) {
                                this.data.data.push(property)
                            }
                            this.data.next_page_url = res.next_page_url
                            this.loading_tab=false;
        
                        })
                    }
                }

                this.data.next_page_url =null;

            }
        }
    }
}
