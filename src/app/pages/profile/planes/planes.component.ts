import { Component, OnInit } from '@angular/core';
import { PagoService } from 'src/app/services/pago/pago.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-planes',
    templateUrl: './planes.component.html',
    styleUrls: ['./planes.component.scss'],
})
export class PlanesComponent implements OnInit {

    constructor(
        private PagoService:PagoService,
        private route:Router,
        private UserService:UserService,
        private translate: TranslateService 

    ) { 
        translate.setDefaultLang('es');
        translate.use(localStorage.getItem('lang'));
    }

    ngOnInit() { 
        this.premium = this.UserService.getPremium()
        console.log(this.UserService.getPremium())
    }

    premium:boolean=false;
    free:boolean=false;

    GoPago(){

        this.PagoService.tipo = 8;

        this.route.navigateByUrl('home/config/pago')
    }

}
