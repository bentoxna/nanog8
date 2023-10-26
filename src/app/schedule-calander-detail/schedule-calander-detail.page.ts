import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-schedule-calander-detail',
  templateUrl: './schedule-calander-detail.page.html',
  styleUrls: ['./schedule-calander-detail.page.scss'],
})
export class ScheduleCalanderDetailPage implements OnInit {
  p: number = 1;
  q: number = 1;
  o: number = 1;
  collection: any[];
  userid
  taskid
  salesid
  filterword

  schedulework = [] as any
  scheduleworkapprove = [] as any
  scheduleworkreject = [] as any
  scheduleworknull = [] as any

  constructor(private route: ActivatedRoute,
    private nav: NavController,
    private http: HttpClient,
    private platform : Platform) { }

  ngOnInit() {

    this.route.queryParams.subscribe(a => {
      this.userid = a['uid']

      // console.log(this.userid)

      // this.http.post('https://api.nanogapp.com/getAllScheduleBySales', { sales_id: this.salesid }).subscribe(res => {
      //   // console.log(res)
      //   this.schedulework = res['data']
      //   this.scheduleworkapprove = this.schedulework.filter(a => a['approve_status'] == true)
      //   this.scheduleworkreject = this.schedulework.filter(a => a['approve_status'] == false)
      //   this.scheduleworknull = this.schedulework.filter(a => a['approve_status'] == null)
      // })

      this.http.post('https://api.nanogapp.com/getAllScheduleByUid', {uid : this.userid}).subscribe(res => {
        // console.log(res)
          this.schedulework = res['data']
          // this.scheduleworkapprove = this.schedulework.filter(a => a['approve_status'] == true)
          // this.scheduleworkreject = this.schedulework.filter(a => a['approve_status'] == false)
          // this.scheduleworknull = this.schedulework.filter(a => a['approve_status'] == null)
      })
    })
  }

  // filtererSchedule(x){
  //   return this.schedulework.filter()
  // }

  back() {
    this.nav.pop()
  }

  platformType(){
    return this.platform.platforms()
  }

}
