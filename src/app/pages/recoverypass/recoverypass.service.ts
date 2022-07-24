import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class RecoverypassService {

    constructor(
        private http: HttpClient,
    ) { }


    url = environment.serverUrl;
    token = localStorage.getItem('token');

    usuario: any = {
        correo: null,
        clave: null,
        codigo: null,
        code_phone: null,
        telefono: null
    }

    ValidateEmail(): Promise<any>{
        const send = this.http.post(`${this.url}validate-email-reset`, this.usuario).toPromise()
        return send;
    }

    ValidatePhone(): Promise<any>{
        const send = this.http.post(`${this.url}validate-telefono-reset`, this.usuario).toPromise()
        return send;
    }

    ValCode(tipo:number): Promise<any>{
        this.usuario.tipo=tipo;
        const send = this.http.post(`${this.url}validate-code-reset`, this.usuario).toPromise()
        return send;
    }

    ChangePass(tipo:number): Promise<any>{
        this.usuario.tipo=tipo;
        const send = this.http.post(`${this.url}update-password-reset`, this.usuario).toPromise()
        return send;
    }

}
