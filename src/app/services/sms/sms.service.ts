import { Injectable, Output, EventEmitter  } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class SmsService {

    constructor(
        private http: HttpClient,
    ) { }
    @Output() SignUpType: EventEmitter<any> = new EventEmitter();

    url = environment.serverUrl;
    token=localStorage.getItem('token');
    public tipo:number=null;
    sms:any={
        code_phone:null,
        country_short_name:null,
        telefono:null,
        codigo:null
    }

    Login(): Promise<any>{
        const send = this.http.post(`${this.url}login-data-sms`, this.sms).toPromise()
        return send;
    }

    SignUp(): Promise<any>{
        const send = this.http.post(`${this.url}signup-data-sms`, this.sms).toPromise()
        return send;
    }

    ValCode(tipo:number): Promise<any>{
        this.sms.tipo=tipo;
        const send = this.http.post(`${this.url}valid-data-sms`, this.sms).toPromise()
        return send;
    }

    /// SEND DATA
    async ValNumero(data:any): Promise<any> {
        const send = this.http.post(`${this.url}valid-data-sms`, data).toPromise()
        return send;
    }

}
