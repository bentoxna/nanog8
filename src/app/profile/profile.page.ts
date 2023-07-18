import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(private route : ActivatedRoute, private http : HttpClient,
    private platform : Platform) { }

  user = {} as any
  appointment = []
  userid = 'LbdDaz3w3yPFVjTEQVr6PbGP3PC3'
  dateselected2 = '2022-10-11 00:00:00'
  tomorrow ='2022-10-12 00:00:00'
  ngOnInit() {
    
    // this.route.queryParams.subscribe(a =>{
    //   this.http.post('https://api.nanogapp.com/getSalesExec', {uid : a.uid}).subscribe(b =>
    //   {
    //     this.user = b['user']
    //     console.log(this.user)
    //   })
    // })

    this.http.post('https://api.nanogapp.com/getAppointmentForExecByDate', { execId: this.userid, startDate: this.dateselected2, endDate: this.tomorrow }).subscribe((s) => {
      this.appointment = s['data']
      console.log(this.appointment)
    })
  }

  platformType(){
    return this.platform.platforms()
  }

}
