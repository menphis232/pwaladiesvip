import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class MarketService {

    constructor(
        private http: HttpClient,
    ) { }

    url = environment.serverUrl;
    token = localStorage.getItem('token')

    SearchNegocio(id:any): Promise<any> {
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + localStorage.getItem('token')
        });
        const send = this.http.get(`${this.url}search-negocios-categorias/${id}`, {headers}).toPromise()
        return send;
    }

    SearchNegocioInv(id:any): Promise<any> {
        const send = this.http.get(`${this.url}negocios-invitado/${id}`).toPromise()
        return send;
    }

    Fitrar(filtro:any,pages:any){
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + localStorage.getItem('token')
        });
        const send = this.http.post(`${this.url}filter-market?page=${pages}`, filtro, {headers} ).toPromise()
        return send;
    }

    FitrarInv(filtro:any,pages:any){
       
        const send = this.http.post(`${this.url}filter-market-invitado?page=${pages}`, filtro).toPromise()
        return send;
    }

    Search(filtro:any){
        const send = this.http.get(`${this.url}search-negocios/${filtro}`).toPromise()
        return send;
    }

    Paginate(page:any){
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + localStorage.getItem('token')
        });
        const send = this.http.get(`${page}`, {headers} ).toPromise()
        return send;
    }

    PaginateInv(page:any){
       
        const send = this.http.get(`${page}` ).toPromise()
        return send;
    }

    Destacados(){
        const headers = new HttpHeaders({
            Authorization: 'Bearer ' + localStorage.getItem('token')
        });
        const send = this.http.get(`${this.url}negocios-destacados`, {headers} ).toPromise()
        return send;
    }
    
}
