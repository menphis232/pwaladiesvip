import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';

@Component({
    selector: 'app-notify',
    templateUrl: './notify.component.html',
    styleUrls: ['./notify.component.scss'],
})
export class NotifyComponent implements OnInit {

    constructor(
        private router: Router,
        public UserService:UserService,

    ) { }

    ngOnInit() {
        
        this.notifys=this.UserService.notifys;
        console.log(this.notifys)
    }

    notifys:any;

    GoPlacks(){
        this.router.navigate(['home/config/packs_anuncios'])
    }

    GoPlan(){
        this.router.navigate(['home/config/planes'])
    }
}
