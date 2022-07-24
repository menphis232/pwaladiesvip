import { Component, OnInit } from '@angular/core';
import { AnunciosService } from 'src/app/services/anuncios/anuncios.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

declare var $: any;

@Component({
    selector: 'app-video',
    templateUrl: './video.component.html',
    styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements OnInit {

    constructor(
        private AnunciosService:AnunciosService,
        private router: Router,

    ) { }

    ngOnInit() {

        this.video = this.AnunciosService.index_vid ;
        console.log(this.video)
    }

    video:any;
    url = environment.server;

    Return(){
        console.log("ASDSDAS")
        this.router.navigateByUrl('home/anuncio')
    }

    Play(){
        console.log($('#video_here')[0].paused)
        if($('#video_here')[0].paused){
            console.log($('#video_here')[0].play())
            $('.bg-control').addClass('fadeOut')
            $('.btn-play').addClass('fadeOut')
            setTimeout(()=>{
                $('.bg-control').css('display','none')
                $('.btn-play').css('display','none')
            },400)
            
        }else{
            console.log($('#video_here')[0].pause())
            $('.bg-control').removeClass('fadeOut').addClass('fadeIn')
            $('.btn-play').removeClass('fadeOut').addClass('fadeIn')
            $('.bg-control').css('display','grid')
            $('.btn-play').css('display','block')
        }
        console.log($('#video_here')[0].paused)

        // console.log($('#video_here')[0])
        // $('#video_here').play()
    }

    ProgressBar(){
        let progres = ($('#video_here')[0].currentTime /$('#video_here')[0].duration)*100 
        $(".progress-bar").css('background', 'linear-gradient( to right, #FF3C76 0 '+progres+'% , #DFDFDF  0% '+(100-progres)+'%)');
    }

    Muted(){
        if($('#video_here')[0].muted){
            $('#video_here')[0].muted =false
            $(".btn-volume").find('img')[0].src='../../../../assets/img/volume.svg'
        }else{
            $('#video_here')[0].muted =true
            $(".btn-volume").find('img')[0].src='../../../../assets/img/muted.svg'

        }
    }

}
