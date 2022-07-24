import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import {loadStripe, Stripe } from '@stripe/stripe-js';
import { environment } from 'src/environments/environment';
import {first} from 'rxjs/operators';
import { loadScript } from "@paypal/paypal-js";
import { PagoService } from 'src/app/services/pago/pago.service';
import { Router } from '@angular/router';
import { Vacio, VacioU, SoloLetra, SoloNumero } from 'src/assets/script/general';
import { UserService } from 'src/app/services/user/user.service';
import { Location } from '@angular/common';
import {TranslateService} from '@ngx-translate/core';

declare var paypal;

@Component({
    selector: 'app-pago',
    templateUrl: './pago.component.html',
    styleUrls: ['./pago.component.scss'],
})
export class PagoComponent implements OnInit, AfterViewInit {

    private stripe:Stripe;

    constructor(
        private http:HttpClient,
        private PagoService:PagoService,
        private route:Router,
        private UserService:UserService,
        private _location: Location,
        private translate: TranslateService 

    ) {
        translate.setDefaultLang('es');
        translate.use(localStorage.getItem('lang'));
    }   

    async ngOnInit() {


        this.tipo = this.PagoService.tipo;

            console.log(this.PagoService.titulo[this.PagoService.tipo])
            this.titulo = this.PagoService.titulo[this.PagoService.tipo];
        if(this.tipo ==8){
            this.titulo="Plan premium"
        }


        console.log("tipo",this.tipo)
        if(this.tipo == 0){
            if(sessionStorage.getItem('free')){
                this.free=true;
                this.mount="0.00"
            }else{
                this.free=false;
                this.mount="5.99"
            }
        }
        if(this.tipo == 1){
            this.mount="9.99"
        }
        if(this.tipo == 2){
            this.mount="19.99"
        }
        if(this.tipo == 3){
            this.mount="3.99"
        }
        if(this.tipo == 4){
            this.mount="0.99"
        }
        
        this.PagoService.change.subscribe(res=>{
            this.titulo = res.tipo;
            this.tipo = res.tipo;
        })

    }

    async ngAfterViewInit() {
        // this.stripe = await loadStripe("pk_test_51KcEeCGTu8C9ATXJ27WhTKVVnV9hQ9fC9F4uFVtL3ni61XdwHDBwZ9UzGk5utqZPjhC9wfpGY0j3NyYjbbXyorO6001gyUwCa5")
        // const elements = this.stripe.elements(); 
        // this.card = elements.create('card');
        // this.card.mount('#card')
        // console.log( "card" )
        // console.log(this.card)

        // loadScript({ "client-id": 'AfMbL49xhYNp98gwCLrZDpChIvolqowH9K4AIUVjbSr4F9Rnpw0Jr3P4fQvM9MmVIqkDuN9ILllD3ZDC', currency: "EUR" })
        // .then((paypal) => {

            console.log("paypal ")
            paypal
            .Buttons({
                createOrder: (data, actions)=> {
                    this.error = false;

                    // Set up the transaction
                    return actions.order.create({
              
                      purchase_units: [{
              
                        amount: {
                            currency_code:'EUR',
                            value: this.mount
              
                        }
              
                      }]
              
                    })
                },
                onApprove:async (data, actions) =>{
                    const order =await actions.order.capture()
                    console.log(order)
                    this.PagoService.UpdatePackPaypal({charge:order, tipo: this.tipo+1}).then(res=>{
                        console.log("ready")
                        console.log(res)
                        this.UserService.ValidatePack().then(res=>{
                            console.log(this.UserService.getPack());
                
                            if(localStorage.getItem('pack') == null){
                                localStorage.removeItem('pack')
                            }
                            localStorage.setItem('pack',JSON.stringify(res) )
                            
                        })
                        this.fase_pago = 3;
                    })
                },
                onError: err =>{
                    console.log(err)
                    this.error = true;
                }
            })
            .render("#paypal")
            .catch((error) => {
                console.error("failed to render the PayPal Buttons", error);
            });
            // start to use the PayPal JS SDK script

        // })
        // .catch((err) => {

        //     console.error("failed to load the PayPal JS SDK script", err);

        // });

        
    }
    

   

    //!DATA===========================================================================================================
    //?CARGA=================================================================================
    titulo="";
    
    //?GESTION=================================================================================
    tipo:number=0;

    card:any = {
        number: null,
        exp_month: null,
        exp_year: null,
        cvc: null
    }

    mount="1.00";

    //?CONTROL=================================================================================
    fase_pago=0;
    metodo_pago:number=0;
    loading:boolean=false;
    error:boolean=false;
    free:boolean=false;
    //!FUNCIONES===========================================================================================================
   
    //?CARGA=================================================================================


    //?FUNCION=================================================================================

    async go(){
        console.log("res")
        this.loading = true;
        this.error = false;


        this.PagoService.Pagar({token:0,amount:this.tipo+1,card:this.card})
        .then( (res:any) => {
            this.loading = false;

            if(res.code){
                this.error = true;
                
                console.log('esta es la respuesta del pago',res.code);
            }else{
                this.PagoService.UpdatePack(res).then(res=>{
                    console.log("ready")
                    console.log(res)
                    this.UserService.ValidatePack().then(res=>{
                        console.log(this.UserService.getPack());
            
                        if(localStorage.getItem('pack') == null){
                            localStorage.removeItem('pack')
                        }
                        localStorage.setItem('pack',JSON.stringify(res) )
                        
                    })
                    
                    this.fase_pago = 3;
                })
                console.log('esta es la respuesta del pago',res);
            }
            // this.cateSpinner=false
        })
        
        // const ownerInfo = {
        //     owner: {name: 'codexmaker'},
        //     amount: 1,
        //     currency:'eur'
        // }

        // this.stripe.createToken(this.card).then(res=>{
        //     console.log("token")
        //     console.log(res.token)
            
        // });
        // const res = await this.stripe.createSource(this.card, ownerInfo).then(res=>{
        //     console.log(res.source)
        //     this.stripe.redirectToCheckout


        // })

    }


    //?CONTROL=================================================================================
    SelectMetodo(metodo:number){
        this.metodo_pago = metodo;
        if(this.tipo == 4){
            this.mount="0.99"
        }
        if(this.tipo == 5){
            this.mount="6.99"
        }
        if(this.tipo == 6){
            this.mount="19.99"
        }
        if(this.tipo == 7){
            this.mount="2.99"
        }
        if(this.tipo == 8){
            this.mount="8.99"
        }
        this.fase_pago = 1;
    }

    Return(){
        this.fase_pago = 0;
        // this.route.navigateByUrl('home/config/packs_anuncios')
        this._location.back();
    }

    SoloNumero(evt: any) {
        return SoloNumero(evt)
    }

    SoloLetra(evt: any) {
        return SoloLetra(evt)
    }

    VacioU(evt: any) {
        return VacioU(evt)
    }

    goHome(){
        location.href = '/home';
    }
}
