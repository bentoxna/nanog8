import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-video-viewer',
  templateUrl: './video-viewer.page.html',
  styleUrls: ['./video-viewer.page.scss'],
})
export class VideoViewerPage implements OnInit {

  constructor(private route : ActivatedRoute, private nav : NavController, private modal : ModalController, private platform : Platform) { }

   link
   temp
   horizontal = false
   howidth =  (this.heighter() / 100 * 90 )+ 'px'
   hoheight = (this.widther())+ 'px'
  ngOnInit() {
    this.route.queryParams.subscribe(a => {
      this.link = a['link']
      // this.temp = a
      // console.log(a)
      // if(typeof a === 'object' && Object.keys(a).length === 0)
      // {

      //   this.link = this.navparam.get('link')
      //   console.log(this.link)
      // }
      // else if(typeof a === 'object')
      // {
      //   console.log(a)
      //   this.link = a['link']

      // }


      // const videoPlayer = document.getElementById('videoPlayer') as HTMLVideoElement
      // videoPlayer.play();
      // videoPlayer.addEventListener('ended',() => {
      //   this.nav.pop()
      // })
    })




  }

  close(){
    this.nav.pop()
    // if(typeof this.temp === 'object' && Object.keys(this.temp).length === 0)
    // {
    //   this.modal.dismiss()
    // }
    // else
    // {
    //   this.nav.pop()
    // }
  }

  fullscreen(){
    this.horizontal = !this.horizontal

    // const box = document.querySelector('.videosize');

    // setTimeout(() => {
    //   box.classList.add('animate');
    // }, 200);
  }

  widther(){
    return this.platform.width()
  }
  
  heighter(){
    return this.platform.height()
  }

}
