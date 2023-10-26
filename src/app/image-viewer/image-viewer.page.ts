import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.page.html',
  styleUrls: ['./image-viewer.page.scss'],
})
export class ImageViewerPage implements OnInit {

  photo

  constructor(private route : ActivatedRoute, private nav: NavController, private platform : Platform) { }

  ngOnInit() {
    this.route.queryParams.subscribe(res => {
      // console.log(res)
      this.photo = res['imageurl']
    })
  }

  back(){
    this.nav.pop()
  }

  platformType(){
    return this.platform.platforms()
  }


}
