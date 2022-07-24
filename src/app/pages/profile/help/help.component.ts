import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-help',
    templateUrl: './help.component.html',
    styleUrls: ['./help.component.scss'],
})
export class HelpComponent implements OnInit {

    constructor(
        private translate: TranslateService 

    ) { 
        translate.setDefaultLang('es');
        translate.use(localStorage.getItem('lang'));
    }
    @Output() Cerrar = new EventEmitter<any>();

    ngOnInit() { }

    fase:number=0;


    Close(){
        console.log("asd")
        this.Cerrar.emit(true)
    }

}
