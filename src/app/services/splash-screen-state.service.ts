import { Injectable, Output, EventEmitter  } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class SplashScreenStateService {
    
    @Output() change: EventEmitter<any> = new EventEmitter();

    start() {
        
        this.change.emit({ isOpen: true});
    }

    stop(){
        this.change.emit({ isOpen: false});
    }

    // subject = new Subject();
    // subscribe(onNext): Subscription {
    //     console.log(this.subject)
    //     return this.subject.subscribe(onNext);
    // }


    // stop() {
    //     this.subject.next(false);
    // }
}
