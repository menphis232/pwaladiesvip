import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(
        private http: HttpClient,
    ) { }

    
    url = environment.serverUrl;
    token = localStorage.getItem('token');

    /// VALIDAR EMAIL
    async ValEmail(data: any): Promise<any> {
        const send = this.http.post(`${this.url}validate-email`, data).toPromise()
        return send;
    }
    /// PRIMERA IMAGEN
    async UpImage(data: any, id: any): Promise<any> {
        const send = this.http.post(`${this.url}sendImg/${id}`, data).toPromise()
        return send;
    }

    ValUser(): Promise<any> {
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + localStorage.getItem('token')
        });
        const send = this.http.get(`${this.url}validate-role`, {headers}).toPromise()
        return send;
    }
    //// LOGIN Y RESGISTRO POR REDES ////
    async signUpSocial(data: any): Promise<any> {
        const send = this.http.post(`${this.url}signup-social`, data).toPromise()
        return send;
    }
    async loginSocial(data: any): Promise<any> {
        const send = this.http.post(`${this.url}signin-social`, data).toPromise()
        return send;
    }

    //// LOGIN Y RESGISTRO ////
    async signUp(data: any): Promise<any> {
        const send = this.http.post(`${this.url}signup`, data).toPromise()
        return send;
    }
    async login(data: any): Promise<any> {
        const send = this.http.post(`${this.url}signin`, data).toPromise()
        return send;
    }

    async SendEmail(data: any): Promise<any> {
        const send = this.http.post(`${this.url}signup-email-validate`, data).toPromise()
        return send;
    }

    /// CERRAR SESION
    async logOut(): Promise<any> {
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + this.token
        });
        const send = this.http.get(`${this.url}logout`, { headers }).toPromise()
        return send;
    }
}
