import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
    providedIn: 'root'
})
export class NegociosService {

    constructor(
        private http: HttpClient,
    ) { }

    url = environment.serverUrl;
    token = localStorage.getItem('token')


    CrearNegocio(anuncio:any): Promise<any> {
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + localStorage.getItem('token')
        });
        const send = this.http.post(`${this.url}crear-negocio`, anuncio , {headers}).toPromise()
        return send;
    }

    GetNegocio(): Promise<any> {
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + localStorage.getItem('token')
        });
        const send = this.http.get(`${this.url}mis-negocios`,  {headers}).toPromise()
        return send;
    }

    UpdateNegocio(id:number, data:any){
        
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + localStorage.getItem('token')
        });
        const send = this.http.post(`${this.url}update-negocio/${id}`,  data , {headers}).toPromise()
        return send;
    }

    DeleteNegocio(id:number){
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + localStorage.getItem('token')
        });
        const send = this.http.get(`${this.url}delete-negocios/${id}`,  {headers}).toPromise()
        return send;
    }



}