import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home-calendar',
  templateUrl: './home-calendar.page.html',
  styleUrls: ['./home-calendar.page.scss'],
})
export class HomeCalendarPage implements OnInit {

  userid
  taskid
  salesid
  user = {} as any
  appointment = {} as any

  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sut']
  today = this.changeformat(new Date())
  todayyear
  todaymonth
  todaydate
  dates = [] as any
  selectedyear
  selectedmonth
  selecteddate
  selecteddatedetail
  fulldate
  startdate
  enddate
  allschedule
  allfromdate
  alldate
  bookinglist
  installlist
  alllist

  schedulework
  scheduleworkapprove

  heighfordate = (((this.widther() / 100 * 90) / 100 * 95) / 7) + 'px'

  constructor(private http: HttpClient,
    private route: ActivatedRoute,
    private modal: ModalController,
    private platform: Platform,
    private nav: NavController,
    private datepipe: DatePipe,
    private socket: Socket) { }

  ngOnInit() {
    // console.log(this.today)
    // console.log(this.todaydate)

    this.socket.connect();
    this.socket.fromEvent('a').subscribe(message => {
      // console.log(message)
      this.refresher()
    });

    this.createdate((new Date().getMonth() + 1), new Date().getFullYear())

    this.route.queryParams.subscribe(a => {
      this.userid = a['uid']
      this.taskid = a['tid']
      this.salesid = a['sid']

      // console.log(this.userid, this.taskid, this.salesid)

      // console.log(this.selectedyear, this.selectedmonth)
      this.startdate = new Date(parseInt(this.selectedyear), parseInt(this.selectedmonth) - 1, 1).getTime()
      // console.log(this.startdate)

      this.enddate = new Date(parseInt(this.selectedyear), parseInt(this.selectedmonth), 0, 23, 59, 59).getTime()
      // console.log(this.enddate)
      this.getworkschedule()
    })

    // console.log(this.userid, this.taskid, this.salesid)
    // console.log(this.dates)
  }

  // refresher(){
  //   setTimeout(() => {
  //     this.getworkschedule()
  //   }, 4000);
  // }

  refresher() {
    // console.log('here')
    this.createdate((new Date().getMonth() + 1), new Date().getFullYear())

    this.route.queryParams.subscribe(a => {

      this.userid = a['uid']
      this.taskid = a['tid']
      this.salesid = a['sid']

      // console.log(this.userid, this.taskid, this.salesid)

      // console.log(this.selectedyear, this.selectedmonth)
      this.startdate = new Date(parseInt(this.selectedyear), parseInt(this.selectedmonth) - 1, 1).getTime()
      // console.log(this.startdate)

      this.enddate = new Date(parseInt(this.selectedyear), parseInt(this.selectedmonth), 0, 23, 59, 59).getTime()
      // console.log(this.enddate)
      this.getworkschedule()
    })
  }

  // getworkschedule() {
  //   // console.log(this.startdate, this.enddate)
  //   this.http.post('https://api.nanogapp.com/getScheduleByDateForList', { minimum: this.startdate, maximum: this.enddate }).subscribe(res => {

  //     this.allschedule = res['data']
  //     // console.log(this.allschedule)

  //     this.http.post('https://api.nanogapp.com/getFromDateByDateForList', { minimum: this.startdate, maximum: this.enddate }).subscribe(s => {
  //       // console.log(s)
  //       this.allfromdate = s['data']
  //       this.alldate = this.allschedule.concat(this.allfromdate)
  //       // console.log(this.alldate)
  //       if (this.alldate.length < 1) {
  //         for (let i = 0; i < this.dates.length; i++) {
  //           if (this.dates[i] != '') {
  //             this.dates[i].num = 0
  //             this.dates[i].isthisappointment = false
  //           }
  //         }
  //       }
  //       else if (this.alldate.length > 0) {
  //         for (let i = 0; i < this.dates.length; i++) {
  //           if (this.dates[i] != '') {
  //             this.dates[i].num = 0
  //             this.dates[i].isthisappointment = false
  //             for (let j = 0; j < this.alldate.length; j++) {
  //               // // console.log(new Date(parseInt(this.alldate[j].schedule_date)).getDate())
  //               if (this.dates[i].date == new Date(parseInt(this.alldate[j].schedule_date)).getDate()) {
  //                 this.dates[i].num = this.dates[i].num + 1
  //                 if (this.alldate[j]['sales_id'] == this.salesid) {
  //                   this.dates[i].isthisappointment = true
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       }
  //       this.getdate(this.selecteddate)
  //     })


  //   })
  // }
  getworkschedule(){
    // for (let i = 0; i < this.dates.length; i++) {
    //   if(this.dates[i] != '')
    //   {
    //     this.dates[i].num = 0
    //     let start = new Date(parseInt(this.selectedyear), parseInt(this.selectedmonth) - 1, parseInt(this.dates[i]['date'])).getTime()
    //     let end = new Date(parseInt(this.selectedyear), parseInt(this.selectedmonth) - 1, parseInt(this.dates[i]['date']) , 23, 59, 59).getTime()
    //     this.http.post('https://api.nanogapp.com/getScheduleByDate2', { minimum:start, maximum: end, sales_id : this.salesid}).subscribe(res => {
    //       this.dates[i].num = res['data']['sum']
    //     })
    //   }
    // }
    // console.log(this.startdate, this.enddate)
    this.http.post('https://api.nanogapp.com/getScheduleByDateForList', { minimum: this.startdate, maximum: this.enddate}).subscribe(res => {


      this.allschedule = res['data']
      // console.log(this.allschedule)
      this.http.post('https://api.nanogapp.com/getFromDateByDateForList', { minimum: this.startdate, maximum: this.enddate }).subscribe(s => {
        // console.log(s)
        this.allfromdate = s['data']
        this.alldate = this.allschedule.concat(this.allfromdate)
        // console.log(this.alldate)
        if (this.alldate.length < 1) {
          for (let i = 0; i < this.dates.length; i++) {
            if (this.dates[i] != '') {
              this.dates[i].num = 0
              this.dates[i].isthisappointment = false
            }
          }
        }
        else if (this.alldate.length > 0) {
          for (let i = 0; i < this.dates.length; i++) {
            if (this.dates[i] != '') {
              this.dates[i].num = 0
              this.dates[i].isthisappointment = false
              for (let j = 0; j < this.alldate.length; j++) {
                // // console.log(new Date(parseInt(this.alldate[j].schedule_date)).getDate())
                if(this.alldate[j].schedule_date && (!this.alldate[j].schedule_date2 || this.alldate[j].schedule_date2 && this.alldate[j].schedule_date2.length < 1))
                {
                  if (this.dates[i].date == new Date(parseInt(this.alldate[j].schedule_date)).getDate()) {

                    if(this.dates[i]['sales_id'] && this.dates[i]['sales_id'].length > 0)
                    {
                      let findsalesid = this.dates[i]['sales_id'].findIndex(a => a == this.alldate[j].sales_id)
                      if(findsalesid == -1)
                      {
                        this.dates[i]['sales_id'].push(this.alldate[j].sales_id)
                        this.dates[i].num = this.dates[i].num + 1
                        if (this.alldate[j]['sales_id'] == this.salesid) {
                          this.dates[i].isthisappointment = true
                        }
                      }
                    }
                    else
                    {
                      this.dates[i]['sales_id'] = [this.alldate[j].sales_id]
                      this.dates[i].num = this.dates[i].num + 1
                      if (this.alldate[j]['sales_id'] == this.salesid) {
                        this.dates[i].isthisappointment = true
                      }
                    }


                  }
                }
                else if(this.alldate[j].schedule_date2)
                {
                  for(let k = 0; k < this.alldate[j].schedule_date2.length; k++)
                  {
                    if (this.dates[i].date == new Date(parseInt(this.alldate[j].schedule_date2[k])).getDate()) {
                      

                      if(this.dates[i]['sales_id'] && this.dates[i]['sales_id'].length > 0)
                      {
                        let findsalesid = this.dates[i]['sales_id'].findIndex(a => a == this.alldate[j].sales_id)
                        if(findsalesid == -1)
                        {
                          this.dates[i]['sales_id'].push(this.alldate[j].sales_id)
                          this.dates[i].num = this.dates[i].num + 1
                          if (this.alldate[j]['sales_id'] == this.salesid) {
                            this.dates[i].isthisappointment = true
                          }
                        }
                      }
                      else{
                        
                        this.dates[i]['sales_id'] = [this.alldate[j].sales_id]
                        this.dates[i].num = this.dates[i].num + 1
                        if (this.alldate[j]['sales_id'] == this.salesid) {
                          this.dates[i].isthisappointment = true
                        }
                      }
                      

                      

                    }
                  }
                }

              }
            }
          }
        }
        this.getdate(this.selecteddate)
      })
      // this.refresher()
    })
    // this.http.post('https://api.nanogapp.com/getScheduleByDate', { minimum: this.startdate, maximum: this.enddate}).subscribe(res => {
    //   // console.log(res)
    //   this.allschedule = res['data']
    //   if (this.allschedule.length < 1) {
    //     for (let i = 0; i < this.dates.length; i++) {
    //       if (this.dates[i] != '') {
    //         this.dates[i].num = this.dates[i].num
    //         this.dates[i].isthisappointment = false
    //       }
    //     }
    //   }
    //   else if(this.allschedule.length > 0) {
    //     for (let i = 0; i < this.dates.length; i++) {
    //       if (this.dates[i] != '') {
    //         this.dates[i].isthisappointment = false
    //         for (let j = 0; j < this.allschedule.length; j++) {
    //           if (this.dates[i].date == new Date(parseInt(this.allschedule[j].schedule_date)).getDate()) {
    //             this.dates[i].num = this.dates[i].num + 1
    //             if (this.allschedule['sales_id'] == this.salesid) {
    //               this.dates[i].isthisappointment = true
    //             }
    //           }
    //           else if (this.dates[i].date != new Date(parseInt(this.allschedule[j].schedule_date)).getDate()) {
    //             this.dates[i].num = this.dates[i].num
    //           }
    //         }
    //       }
    //     }
    //   }
    //   // this.refresher()
    // })
}
  getworkschedule2() {
    this.http.post('https://api.nanogapp.com/getScheduleByDate', { minimum: this.startdate, maximum: this.enddate }).subscribe(res => {
      this.allschedule = res['data']
      if (this.allschedule.length < 1) {
        for (let i = 0; i < this.dates.length; i++) {
          if (this.dates[i] != '') {
            this.dates[i].num = 0
            this.dates[i].isthisappointment = false
          }
        }
      }
      else if (this.allschedule.length > 0) {
        for (let i = 0; i < this.dates.length; i++) {
          if (this.dates[i] != '') {
            this.dates[i].num = 0
            this.dates[i].isthisappointment = false
            for (let j = 0; j < this.allschedule.length; j++) {
              if (this.dates[i].date == new Date(parseInt(this.allschedule[j].schedule_date)).getDate()) {
                this.dates[i].num = this.dates[i].num + 1
                if (this.allschedule[j]['sales_id'] == this.salesid) {
                  this.dates[i].isthisappointment = true
                }
              }
            }
          }
        }
      }
    })
  }


  changeformat(x) {
    this.todayyear = x.getFullYear()
    this.todaymonth = '' + (x.getMonth() + 1)
    this.todaydate = '' + (x.getDate())

    // console.log(this.todayyear, this.todaymonth, this.todaydate)
    return [this.todayyear, this.todaymonth, this.todaydate].join('-')
  }

  createdate(x, y) {
    // console.log(x, y)
    this.dates = []
    let datelength = new Date(parseInt(y), parseInt(x), 0, 23, 59, 59).getDate()
    for (let i = 0; i < datelength; i++) {
      this.dates.push(
        {
          date: (i + 1) + '',
          num: 0,
        })
      if (this.dates[i].length < 2) {
        this.dates[i] = '0' + this.dates[i]
      }
    }
    if (x >= 1) { x = x - 1 } else { x = 12 }
    let monthfirstday = new Date(new Date(parseInt(y), parseInt(x), 1)).getDay()
    for (let i = 0; i < monthfirstday; i++) {
      this.dates.unshift('')
    }
    this.selectedmonth = this.todaymonth
    this.selectedyear = this.todayyear
    this.selecteddate ? this.selecteddate = this.selecteddate : this.selecteddate = new Date().getDate()
  }

  previousmonth() {
    // console.log('previous')
    if (this.todaymonth >= 2) {
      this.todaymonth = parseInt(this.todaymonth) - 1
    }
    else if (this.todaymonth <= 1) {
      this.todaymonth = 12
      this.todayyear = this.todayyear - 1
    }

    this.createdate(this.todaymonth, this.todayyear)
    this.startdate = new Date(parseInt(this.todayyear), parseInt(this.todaymonth) - 1, 1).getTime()
    this.enddate = new Date(parseInt(this.todayyear), parseInt(this.todaymonth), 0, 23, 59, 59).getTime()
    // console.log(this.todayyear, this.todaymonth)
    // console.log(this.startdate, this.enddate)
    this.getworkschedule()
  }

  nextmonth() {
    // console.log('next')
    if (this.todaymonth <= 11) {
      this.todaymonth = parseInt(this.todaymonth) + 1
      this.todayyear = this.todayyear
    }
    else if (this.todaymonth > 11) {
      this.todaymonth = 1
      this.todayyear = this.todayyear + 1
    }
    let monthbynewDate
    if (this.todaymonth >= 2) {
      monthbynewDate = this.todaymonth - 1
    }
    else if (this.todaymonth < 2) {
      monthbynewDate = 12
    }
    // console.log(this.todayyear, this.todaymonth, monthbynewDate)
    this.createdate(this.todaymonth, this.todayyear)
    this.startdate = new Date(parseInt(this.todayyear), parseInt(this.todaymonth) - 1, 1).getTime()
    this.enddate = new Date(parseInt(this.todayyear), parseInt(this.todaymonth), 0, 23, 59, 59).getTime()
    // console.log(this.todayyear, this.todaymonth, monthbynewDate)
    // console.log(this.startdate, this.enddate)
    this.getworkschedule()

  }

  getdate(x) {
    // console.log(x)
    this.selecteddate = x
    this.fulldate = new Date(parseInt(this.selectedyear), parseInt(this.selectedmonth) - 1, parseInt(this.selecteddate)).getTime()
    let fulltomorrow = new Date(parseInt(this.selectedyear), parseInt(this.selectedmonth) - 1, parseInt(this.selecteddate), 23, 59, 59).getTime()

    // console.log(this.fulldate, fulltomorrow)

    this.http.post('https://api.nanogapp.com/getScheduleByDate', { minimum: this.fulldate, maximum: fulltomorrow }).subscribe(res => {
      // console.log(res['data'])
      this.bookinglist = res['data']
      this.http.post('https://api.nanogapp.com/getFromDateByDate', { minimum: this.fulldate, maximum: fulltomorrow }).subscribe(s => {
        this.installlist = s['data']
        // console.log(this.installlist)

        this.alllist = this.bookinglist.concat(this.installlist)
        this.alllist.filter(a => a['created_by'] == this.userid ? a['owm'] = true : a['owm'] = false)

      })


      // console.log(this.dates)
    })
  }

  widther() {
    return this.platform.width()
  }

  back() {
    this.nav.pop()
  }


  detail() {
    this.nav.navigateForward('schedule-calander-detail?uid=' + this.userid)
  }

  platformType() {
    return this.platform.platforms()
  }
}
