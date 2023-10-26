import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tab0-notification-history',
  templateUrl: './tab0-notification-history.page.html',
  styleUrls: ['./tab0-notification-history.page.scss'],
})
export class Tab0NotificationHistoryPage implements OnInit {

  userid = localStorage.getItem('nanogapp_uid') || ''
  notificationHistory = [] as any

  constructor(
    private nav : NavController,
    private http : HttpClient,
  ) { }

  ngOnInit() {
    this.refresher()
  }

  refresher(){
    this.http.post('https://api.nanogapp.com/getNotificationHistory', { uid: this.userid }).subscribe((s) => {
      // console.log(s)
       this.notificationHistory = s['data']
       // console.log(this.notificationHistory)
    })
  }


  back(){
    this.nav.pop()
  }
  
  godetail(x){
    if(x.task_id)
    {
      this.http.post('https://api.nanogapp.com/updatestatus', { uid: this.userid, his_id : x.his_id }).subscribe((s) => {
        // console.log(s)
        this.refresher()
      })
      this.nav.navigateForward('task-detail?uid=' + this.userid + '&tid=' + x.task_id)
    }
    else
    {
      this.http.post('https://api.nanogapp.com/updatestatus', { uid: this.userid, his_id : x.his_id }).subscribe((s) => {
        // console.log(s)
        this.refresher()
      })
    }
    // console.log(x)

  }

  updateallstatus(){
    Swal.fire({
      text : 'Are you sure to read all?',
      icon : 'info',
      heightAuto : false,
      showCancelButton : true,
      reverseButtons : true,
    }).then(a => {
      if(a['isConfirmed'])
      {
        this.http.post('https://api.nanogapp.com/updateallstatus', { uid: this.userid }).subscribe((s) => {
          // console.log(s)
          this.refresher()
        })
      }
    })

  }

}
