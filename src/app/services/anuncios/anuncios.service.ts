import { EventEmitter, Injectable, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AnunciosService {

    constructor(
        private http: HttpClient,
    ) { }


    @Output() add_select: EventEmitter<any> = new EventEmitter();
    // url = environment.serverUrl;
    url = environment.serverUrl;
    token = localStorage.getItem('token');
    
    anuncio:any;
    index_vid:any;
    
    GetAnuncios(page:any): Promise<any> {
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + localStorage.getItem('token')
        });
        const send = this.http.get(`${this.url}anuncios-user?page=${page}`, {headers}).toPromise()
        return send;
    }

    GetAnunciosInv(): Promise<any> {
        
        const send = this.http.get(`${this.url}anuncios-invitado?page=1`).toPromise()
        return send;
    }

    GetCarrusel(): Promise<any> {
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + localStorage.getItem('token')
        });
        const send = this.http.get(`${this.url}anuncios-carousel-user`, {headers}).toPromise()
        return send;
    }

    GetCarruselInv(): Promise<any> {

        const send = this.http.get(`${this.url}anuncios-carousel-invitado`).toPromise()
        return send;
    }
    
    RechazarAnuncio(id:any): Promise<any>{
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + localStorage.getItem('token')
        });
        const send = this.http.post(`${this.url}anuncio-rechazado`,{anuncio:id} ,{headers}).toPromise()
        return send;
    }

    GetMyAdd(): Promise<any>{
        const headers = new HttpHeaders({
            'Content-Type':  'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token')
        });
        const send = this.http.get(`${this.url}mis-anuncios`, {headers}).toPromise()
        return send;
    }

    CrearAnuncio(anuncio:any): Promise<any> {
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + localStorage.getItem('token')
        });
        const send = this.http.post(`${this.url}send-anuncios`, anuncio , {headers}).toPromise()
        return send;
    }

    UpdateAnuncio(anuncio:any,id:number): Promise<any> {
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + localStorage.getItem('token')
        });
        const send = this.http.post(`${this.url}update-anuncio/${id}`, anuncio , {headers}).toPromise()
        return send;
    }


    Fitrar(filtro:any){
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + localStorage.getItem('token')
            
        });
        const send = this.http.post(`${this.url}filter`, filtro , {headers}).toPromise()
        return send;
    }

    FitrarInv(filtro:any){

        const send = this.http.post(`${this.url}filter-invitado`, filtro ).toPromise()
        return send;
    }

    
}
