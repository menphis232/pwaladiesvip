import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
})
export class ControlService {

    constructor(
        private http: HttpClient,
        private translate: TranslateService 
    ) { 
        translate.setDefaultLang('en');
        // translate.use(localStorage.getItem('lang'));
        translate.use('en');
        this.generos=[]
        this.servicios=[]
        this.generos.push(this.translate.instant(`identidad.upt_0`))
        this.generos.push(this.translate.instant(`identidad.upt_1`))
        this.generos.push(this.translate.instant(`identidad.upt_2`))
        this.generos.push(this.translate.instant(`identidad.upt_3`))
        this.generos.push(this.translate.instant(`identidad.upt_4`))
        this.generos.push(this.translate.instant(`identidad.upt_5`))
        this.generos.push(this.translate.instant(`identidad.upt_6`))
        this.generos.push(this.translate.instant(`identidad.upt_7`))
        this.generos.push(this.translate.instant(`identidad.upt_8`))
        this.servicios.push(this.translate.instant(`servicios.upt_0`))
        this.servicios.push(this.translate.instant(`servicios.upt_1`))
        this.servicios.push(this.translate.instant(`servicios.upt_2`))
        this.servicios.push(this.translate.instant(`servicios.upt_3`))
        this.servicios.push(this.translate.instant(`servicios.upt_4`))
    }

    public signupsms={
        code_phone:null,
        telefono:null,
        tipo:null
    }


    public generos=[
        
    ];

    public servicios=[
        
    ];


    SearchNegocio(): Promise<any> {
        
        const headers = new HttpHeaders({
            responseType: 'arraybuffer'
        });
        const send = this.http.get(`../../../assets/files_law/Terminos_condiciones.pdf`,{headers}).toPromise()
        return send;
    }


}
