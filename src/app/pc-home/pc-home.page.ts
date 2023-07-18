import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-pc-home',
  templateUrl: './pc-home.page.html',
  styleUrls: ['./pc-home.page.scss'],
})
export class PcHomePage implements OnInit {

  uid = localStorage.getItem('nanogapp_uid') || ''
  user = {} as any

  constructor(private route : ActivatedRoute,
    private http : HttpClient, private nav : NavController) { }

  ngOnInit() {
    this.route.queryParams.subscribe(a => {
      console.log(a)
      this.http.post('https://api.nanogapp.com/getSalesExec', {uid:a.uid}).subscribe((s) => {
        console.log(s)
        this.user = s['data']
      })
    })
  }

  goprofile(){
    this.nav.navigateForward('profile-edit?uid=' + this.user.uid)
  }

  goupcomingtask(){

  }

  gopending(){

  }

  gotaskall(){

  }

  homecalendar(){

  }

  addLead(){
    this.nav.navigateForward('pc-lead')
  }

}
