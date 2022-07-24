import { Component, OnInit } from '@angular/core';
import { PagoService } from 'src/app/services/pago/pago.service';
import { Router } from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-packs-anuncios',
    templateUrl: './packs-anuncios.component.html',
    styleUrls: ['./packs-anuncios.component.scss'],
})
export class PacksAnunciosComponent implements OnInit {

    constructor(
        private PagoService:PagoService,
        private route:Router,
        private translate: TranslateService 

    ) { 
        translate.setDefaultLang('es');
        translate.use(localStorage.getItem('lang'));
    }

    ngOnInit() { 
        if(sessionStorage.getItem('free')){
            this.free=true;
        }else{
            this.free=false;
        }
        
    }

    free:boolean=false;
    SelectPack(tipo:number){

        this.PagoService.tipo = tipo;

        this.route.navigateByUrl('home/config/pago')
    }

}
