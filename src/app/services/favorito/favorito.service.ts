import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class FavoritoService {

    constructor(
        private http: HttpClient,
    ) { }

    url = environment.serverUrl;
    token = localStorage.getItem('token')

    AddFavorite(id:any): Promise<any> {
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + localStorage.getItem('token')
        });
        const send = this.http.post(`${this.url}crear-favorito`,{anuncio:id} ,{headers}).toPromise()
        return send;
    }

    GetFavorite(){
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + localStorage.getItem('token')
        });
        const send = this.http.get(`${this.url}mis-favoritos`,{headers}).toPromise()
        return send;
    }

    DeleteFavorite(id:number){
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + localStorage.getItem('token')
        });
        const send = this.http.get(`${this.url}delete-favoritos/${id}`,{headers}).toPromise()
        return send;
    }
}
