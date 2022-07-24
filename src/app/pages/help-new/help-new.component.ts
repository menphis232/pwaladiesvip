import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-help-new',
    templateUrl: './help-new.component.html',
    styleUrls: ['./help-new.component.scss'],
})
export class HelpNewComponent implements OnInit {

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
