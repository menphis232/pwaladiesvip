import { Component, OnInit } from '@angular/core';
import { SplashScreenStateService } from 'src/app/services/splash-screen-state.service';
import {
    Router,
    Event as RouterEvent,
    NavigationStart,
    NavigationEnd,
    NavigationCancel,
    NavigationError
} from '@angular/router'
@Component({
    selector: 'app-splash-screen-state',
    templateUrl: './splash-screen-state.component.html',
    styleUrls: ['./splash-screen-state.component.scss'],
})
export class SplashScreenStateComponent implements OnInit {

    constructor(
        private splashScreenStateService: SplashScreenStateService,
        private router: Router
    ) { 
        this.router.events.subscribe((e: RouterEvent) => {
            // this.navigationInterceptor(e);
        })
    }

    loading = true;

    navigationInterceptor(event: RouterEvent): void {
        if (event instanceof NavigationStart) {
            this.opacityChange = 1;
            this.showSplash = true;
            this.splashTransition=null;
            this.hideSplashAnimation()
        }
        if (event instanceof NavigationEnd) {
        }
    
        if (event instanceof NavigationCancel) {
          this.loading = false
        }
        if (event instanceof NavigationError) {
          this.loading = false
        }
    }

    public opacityChange = 1;
    public splashTransition;
    public showSplash = true;
    readonly ANIMATION_DURATION = 1;
    
    start(){
        this.opacityChange = 1;
        this.splashTransition;
        this.showSplash = true;
    }

    private hideSplashAnimation() {
        setTimeout(() => {
            this.splashTransition = `opacity ${this.ANIMATION_DURATION}s`;
            this.opacityChange = 0;
            setTimeout(() => {
                this.showSplash = false;
            }, 1000)
        }, 2000);
    }

    ngOnInit() {

        this.splashScreenStateService.change.subscribe(res => {
            if(res.isOpen){
                this.start()
            }else{
                this.hideSplashAnimation();
            }

        })
    }

}
