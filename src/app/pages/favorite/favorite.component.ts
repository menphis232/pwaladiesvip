import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AnunciosService } from 'src/app/services/anuncios/anuncios.service';
import { FavoritoService } from 'src/app/services/favorito/favorito.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { SplashScreenStateService } from 'src/app/services/splash-screen-state.service';
import {TranslateService} from '@ngx-translate/core';

declare var $: any;

@Component({
    selector: 'app-favorite',
    templateUrl: './favorite.component.html',
    styleUrls: ['./favorite.component.scss'],
})
export class FavoriteComponent implements OnInit, AfterViewInit {

    constructor(
        private FavoritoService:FavoritoService,
        private AnunciosService:AnunciosService,
        private router: Router,
        private splashScreenStateService: SplashScreenStateService,
        private translate: TranslateService 

    ) {
        translate.setDefaultLang('es');
        translate.use(localStorage.getItem('lang'));
     }

    ngOnInit() { 
        this.GetFavorite()
        $(document).click((e:any)=>{
            if($(".table-options").css('display') == 'grid'){
                let container = $(".table-options");
                let containerBtn = $("#btnToggle");
                console.log("container",container)
                console.log("containerBtn",containerBtn)
                console.log("target",e)
                if (!$(".table-options").is(e.target) && $(".table-options").has(e.target).length === 0) { 
                    if ((!$("#btnToggle").is(e.target) && $("#btnToggle").has(e.target).length === 0)) { 
                        $(".table-options").css("display", "none")
                    }
                }
            }
        })
    }

    async ngAfterViewInit() {


    }

    //!DATA=====================================================================

    //?CARGA===================================================================================
    favoritos:any=[]

    //?GESTION===================================================================================


    //?CONTROL===================================================================================
    server = environment.server;
    hoy = new Date();
    loading:boolean=false;

    //!FUNCIONES=============================================================
    //?CARGA=============================================================
    GetFavorite(){
        this.loading = true;
        this.FavoritoService.GetFavorite().then((res:any)=>{
            this.favoritos = res.info;
            console.log(this.favoritos)
            this.loading = false;
            this.splashScreenStateService.stop()
        })
    }


    //?GESTION============================================================
    showImage(urls: any) {
        return this.server + urls.split(",")[0];
    }
    
    OpenShow(anuncio){
        this.AnunciosService.anuncio = anuncio;
        this.router.navigateByUrl('home/favorito/show')
    }

    Delete(id:number){
        this.loading = true;
        
        $(".table-options").css("display", "none")
        this.FavoritoService.DeleteFavorite(id).then(res=>{
            console.log(res)
            this.GetFavorite()
        })
    }

    //?CONTROL==============================================================================

    GetEdad(fecha: any) {
        var cumpleanos = new Date(fecha);
        var edad = this.hoy.getFullYear() - cumpleanos.getFullYear();
        var m = this.hoy.getMonth() - cumpleanos.getMonth();

        if (m < 0 || (m === 0 && this.hoy.getDate() < cumpleanos.getDate())) {
            edad--;
        }
        return edad;
    }

    ToggleOptionTable(i: number) {
        if ($("#" + i).css("display") == 'grid') {
            $("#" + i).css("display", "none");
        } else {
            $(".table-options").css("display", "none")
            $("#" + i).css("display", "grid");
        }
    }

}
