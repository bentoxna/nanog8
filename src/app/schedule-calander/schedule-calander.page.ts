import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import Swal from 'sweetalert2';
import { ScheduleCalanderEditPage } from '../schedule-calander-edit/schedule-calander-edit.page';
import { ScheduleCalanderInsertPage } from '../schedule-calander-insert/schedule-calander-insert.page';

@Component({
  selector: 'app-schedule-calander',
  templateUrl: './schedule-calander.page.html',
  styleUrls: ['./schedule-calander.page.scss'],
})
export class ScheduleCalanderPage implements OnInit {

  // const [message, setMessage]

  userid
  taskid
  salesid
  leadid
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

  heighfordate = (((this.widther() / 100 * 90) / 100 * 95) /7) + 'px'

  constructor(private http: HttpClient,
    private route: ActivatedRoute,
    private modal: ModalController,
    private platform: Platform,
    private nav: NavController,
    private datepipe : DatePipe,
    private socket : Socket) { }

  ngOnInit() {
    // this.selectedyear = new Date().getFullYear()
    // this.selectedmonth = new Date().getMonth()
    // this.selecteddate = new Date().getDate()
    // console.log(this.today)
    // console.log(this.todaydate)
    this.socket.connect();
    this.socket.fromEvent('a').subscribe(message => {
      // console.log(message)
      this.refresher()
    }); 
    // console.log(new Date().getMonth() + 1)
    // console.log(new Date().getFullYear())

    this.createdate((new Date().getMonth() + 1), new Date().getFullYear())

    this.route.queryParams.subscribe(a => {
      
      this.userid = a['uid']
      this.taskid = a['tid']
      this.salesid = a['sid']
      this.leadid = a['lid']

      // console.log(this.userid, this.taskid, this.salesid)

      // console.log(this.selectedyear, this.selectedmonth)
      this.startdate = new Date(parseInt(this.selectedyear), parseInt(this.selectedmonth) -1 , 1).getTime()
      // console.log(this.startdate)

      this.enddate = new Date(parseInt(this.selectedyear), parseInt(this.selectedmonth), 0, 23,59,59).getTime()
      // console.log(this.enddate)
      this.getworkschedule()
    })

    // console.log(this.userid, this.taskid, this.salesid)
    // console.log(this.dates)
    // this.http.post('https://api.nanogapp.com/getUserDetail', { uid: this.userid }).subscribe(res => {
    //   this.user = res['data']
    //   console.log(this.user)
    // })


    // this.http.post('https://api.nanogapp.com/getAppointmentDetails', { id: this.taskid }).subscribe(res => {
    //   this.appointment = res['data']
    //   console.log(this.appointment)
    //   this.salesid = res['data']['sales_id']
    // })
  }

  // refresher(){
  //   setTimeout(() => {
  //     this.getworkschedule()
  //   }, 4000);
  // }

  refresher(){
    console.log('here')
    this.createdate((new Date().getMonth() + 1), new Date().getFullYear())

    this.route.queryParams.subscribe(a => {
      
      this.userid = a['uid']
      this.taskid = a['tid']
      this.salesid = a['sid']

      console.log(this.userid, this.taskid, this.salesid)

      console.log(this.selectedyear, this.selectedmonth)
      this.startdate = new Date(parseInt(this.selectedyear), parseInt(this.selectedmonth) -1 , 1).getTime()
      console.log(this.startdate)

      this.enddate = new Date(parseInt(this.selectedyear), parseInt(this.selectedmonth), 0, 23,59,59).getTime()
      console.log(this.enddate)
      this.getworkschedule()
    })
  }

  // clearnum(){
  //   return new Promise((resolve, reject) => {
  //     this.dates.filter(a => a == '' ? null : a['num'] = 0)
  //     resolve('done')
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
      console.log(this.startdate, this.enddate)
      this.http.post('https://api.nanogapp.com/getScheduleByDateForList', { minimum: this.startdate, maximum: this.enddate}).subscribe(res => {
  

        this.allschedule = res['data']
        console.log(this.allschedule)
        this.http.post('https://api.nanogapp.com/getFromDateByDateForList', { minimum: this.startdate, maximum: this.enddate }).subscribe(s => {
          console.log(s)
          this.allfromdate = s['data']
          this.alldate = this.allschedule.concat(this.allfromdate)
          console.log(this.alldate)
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
                  // console.log(new Date(parseInt(this.alldate[j].schedule_date)).getDate())
                  if(this.alldate[j].schedule_date)
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
                  else if(!this.alldate[j].schedule_date && this.alldate[j].schedule_date2)
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
      //   console.log(res)
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

  getworkschedule2(){
    this.http.post('https://api.nanogapp.com/getScheduleByDate', { minimum: this.startdate, maximum: this.enddate}).subscribe(res => {
      this.allschedule = res['data']
      if (this.allschedule.length < 1) {
        for (let i = 0; i < this.dates.length; i++) {
          if (this.dates[i] != '') {
            this.dates[i].num = 0
            this.dates[i].isthisappointment = false
          }
        }
      }
      else if(this.allschedule.length > 0) {
        for (let i = 0; i < this.dates.length; i++) {
          if (this.dates[i] != '') {
            this.dates[i].num = 0
            this.dates[i].isthisappointment = false
            for (let j = 0; j < this.allschedule.length; j++) {
              if (this.dates[i].date == new Date(parseInt(this.allschedule[j].schedule_date)).getDate()) {
                this.dates[i].num = this.dates[i].num + 1
               if(this.allschedule[j]['sales_id'] == this.salesid)
                {
                  this.dates[i].isthisappointment = true
                }
              }
            }
          }
        }
      }
    })
  }

  // makemonthfirst(x) {
  //   let todayyear = x.getFullYear()
  //   let todaymonth = '' + (x.getMonth() + 1)
  //   let todaydate = 1

  //   return new Date([todayyear, todaymonth, todaydate].join('-')).getTime()
  // }

  // makemonthlast(x) {
  //   let todayyear = x.getFullYear()
  //   let todaymonth = '' + (x.getMonth() + 2)
  //   let todaydate = 1

  //   return new Date([todayyear, todaymonth, todaydate].join('-')).getTime()
  // }

  changeformat(x) {
    this.todayyear = x.getFullYear()
    this.todaymonth = '' + (x.getMonth() + 1)
    this.todaydate = '' + (x.getDate())

    // if(this.todaymonth.length < 2)
    // {
    //   this.todaymonth = '0' + this.todaymonth
    // }

    // if(this.todaydate.length < 2)
    // {
    //   this.todaydate = '0' + this.todaydate
    // }

    console.log(this.todayyear, this.todaymonth, this.todaydate)
    return [this.todayyear, this.todaymonth, this.todaydate].join('-')
  }

  // changeformat2(x, y, z) {
  //   this.todayyear = y
  //   this.todaymonth = x
  //   this.todaydate = z

  //   console.log(this.todayyear, this.todaymonth, this.todaydate)
  //   return [this.todayyear, this.todaymonth, this.todaydate].join('-')
  // }

  createdate(x, y) {
    console.log(x, y)
    this.dates = []
    let datelength = new Date(parseInt(y), parseInt(x), 0, 23, 59, 59).getDate()
    for (let i = 0; i < datelength; i++) {
      let num = i
      this.dates.push(
        {
          date: (num + 1) + '',
          num: 0,
        })
      // if (this.dates[i].length < 2) {
      //   this.dates[i] = '0' + this.dates[i]
      // }
    }
    if (x >= 1) {
      x = x - 1
    }else {
      x = 12
    }
    let monthfirstday = new Date(new Date(parseInt(y), parseInt(x), 1)).getDay()
    for (let i = 0; i < monthfirstday; i++) {
      this.dates.unshift('')
    }
    this.selectedmonth = this.todaymonth
    this.selectedyear = this.todayyear
    this.selecteddate ? this.selecteddate = this.selecteddate : this.selecteddate = new Date().getDate()
  }

  previousmonth() {
    console.log('previous')
    if (this.todaymonth >= 2) {
      this.todaymonth = parseInt(this.todaymonth) - 1
    }
    else if (this.todaymonth <= 1) {
      this.todaymonth = 12
      this.todayyear = this.todayyear - 1
    }

    // let monthbynewDate
    // if (this.todaymonth >= 2) {
    //   monthbynewDate = this.todaymonth - 1
    // }
    // else if (this.todaymonth < 2) {
    //   monthbynewDate = 12
    // }

    this.createdate(this.todaymonth, this.todayyear)
    this.startdate = new Date(parseInt(this.todayyear), parseInt(this.todaymonth) - 1, 1).getTime()
    this.enddate = new Date(parseInt(this.todayyear) , parseInt(this.todaymonth), 0, 23, 59, 59).getTime()
    console.log(this.todayyear, this.todaymonth)
    console.log(this.startdate, this.enddate)
    this.getworkschedule()
  }

  nextmonth() {
    console.log('next')
    if (this.todaymonth <= 11) {
      this.todaymonth = parseInt(this.todaymonth) + 1
      this.todayyear = this.todayyear
    }
    else if(this.todaymonth > 11) {
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
    console.log(this.todayyear, this.todaymonth, monthbynewDate)
    this.createdate(this.todaymonth, this.todayyear)
    this.startdate = new Date(parseInt(this.todayyear), parseInt(this.todaymonth) - 1, 1).getTime()
    this.enddate = new Date(parseInt(this.todayyear), parseInt(this.todaymonth), 0, 23, 59, 59).getTime()
    console.log(this.todayyear, this.todaymonth, monthbynewDate)
    console.log(this.startdate, this.enddate)
    this.getworkschedule()

  }

  getdate(x) {
    console.log(x)
    this.selecteddate = x
    this.fulldate = new Date(parseInt(this.selectedyear), parseInt(this.selectedmonth) - 1, parseInt(this.selecteddate)).getTime()
    let fulltomorrow = new Date(parseInt(this.selectedyear), parseInt(this.selectedmonth) - 1, parseInt(this.selecteddate), 23, 59, 59).getTime()

    console.log(this.fulldate, fulltomorrow)

    this.http.post('https://api.nanogapp.com/getScheduleByDate', { minimum: this.fulldate, maximum: fulltomorrow }).subscribe(res => {
      console.log(res['data'])
      this.bookinglist = res['data']


      this.http.post('https://api.nanogapp.com/getFromDateByDate', { minimum: this.fulldate, maximum: fulltomorrow }).subscribe(s => {
        this.installlist = s['data']
        console.log(this.installlist)

        this.alllist = this.bookinglist.concat(this.installlist)
        this.alllist.filter(a => a['created_by'] == this.userid ? a['owm'] = true : a['owm'] = false)

      })
      // let temp = res['data']
      // this.selecteddate.list = res['data']
      // for (let i = 0; i < this.dates.length; i++) {
      //   if (this.dates[i].date == this.selecteddate.date) {
      //     for (let j = 0; j < this.dates[i].list.length; j++) {
      //       this.dates[i].list[j].data = ''
      //       for (let k = 0; k < temp.length; k++) {
      //         if ((temp[k].team - 1) == j) {
      //           this.dates[i].list[j].data = temp[k]
      //           if (temp[k].created_by == this.userid && temp[k].sales_id == this.salesid) {
      //             this.dates[i].list[j].data.yes = true
      //           }
      //         }
      //       }
      //     }
      //   }
      // }
      console.log(this.dates)
    })
  }


  // getdate2(x) {
  //   console.log(x)
  //   this.selecteddate = x
  //   console.log(this.selectedmonth, this.selectedyear, this.selecteddate.date)
  //   this.fulldate = new Date([this.selectedyear, this.selectedmonth, this.selecteddate.date].join('-')).getTime()
  //   console.log(this.fulldate)
  //   let fulltomorrow = this.fulldate + 86400000

  //   this.http.post('https://api.nanogapp.com/getScheduleByDate', { minimum: this.fulldate, maximum: fulltomorrow }).subscribe(res => {
  //     let temp = res['data']
  //     console.log(temp)
  //     console.log(this.dates)
  //     for (let i = 0; i < this.dates.length; i++) {
  //       if (this.dates[i].date == this.selecteddate.date) {
  //         for (let j = 0; j < this.dates[i].list.length; j++) {
  //           for (let k = 0; k < temp.length; k++) {
  //             if ((temp[k].team - 1) == j)
  //               this.dates[i].list[j].data = temp[k]
  //           }
  //         }
  //       }
  //     }

  //     console.log(this.dates)
  //   })
  // }

  // test(x, i){
  //   console.log(x)
  //   console.log(i)
  //   console.log(this.selecteddate)
  // }

  async insertschedule(x, i, scid) {
    console.log(x)
    let index = 0
    if (x.data == '') {
      this.http.post('https://api.nanogapp.com/getAllScheduleBySales', { sales_id: this.salesid }).subscribe(res => {
        console.log(res)
        this.schedulework = res['data']
        this.scheduleworkapprove = this.schedulework.filter(a => a['approve_status'] != false)
        console.log(this.scheduleworkapprove)
        if(this.scheduleworkapprove.length > 0)
        {
          Swal.fire({
            title: 'Already have existing schedule',
            // text: 'Are you sure want to add one more schedule?',
            icon: 'info',
            heightAuto: false,
            // showCancelButton: true,
            // reverseButtons: true,
          }).then(a => {
            if(a['isConfirmed'] == false)
            {
              this.insert(x, i, scid)
            }
          })
        }
        else if(this.scheduleworkapprove.length < 1)
        {
          this.insert(x, i, scid)
        }
      })


    }
    else if (x.data != '') {
      const modal = await this.modal.create({
        cssClass: 'schedulemodal',
        component: ScheduleCalanderEditPage,
        componentProps: { selecteddate: this.fulldate, data: i, uid: this.userid, lid: this.leadid, tid: this.taskid, sid: this.salesid, scid: scid }
      })

      modal.onDidDismiss().then(a => {
        console.log(a)
        if (a['data'] == 'success') {
          this.getdate(this.selecteddate)
          for (let i = 0; i < this.dates.length; i++) {
            if (this.dates[i] != '') {
              this.dates[i].num = 0
            }
          }
          this.getworkschedule()
        }
      })
      await modal.present()
    }
    console.log(x, i, scid)
  }

  async insert(x, i , scid){
      const modal = await this.modal.create({
        cssClass: 'schedulemodal',
        component: ScheduleCalanderInsertPage,
        componentProps: { selecteddate: this.fulldate, data: i, uid: this.userid, tid: this.taskid, sid: this.salesid }
      })

      modal.onDidDismiss().then(a => {
        console.log(a)
        if (a['data'] == 'success') {
          this.getdate(this.selecteddate)
          for (let i = 0; i < this.dates.length; i++) {
            if (this.dates[i] != '') {
              this.dates[i].num = 0
            }
          }
          this.http.post('https://api.nanogapp.com/getScheduleByDate', { minimum: this.startdate, maximum: this.enddate}).subscribe(res => {
            console.log(res)
            this.allschedule = res['data']
            this.http.post('https://api.nanogapp.com/getFromDateByDate', { minimum: this.startdate, maximum: this.enddate }).subscribe(s => {
              console.log(s)
              this.allfromdate = s['data']
              this.alldate = this.allschedule.concat(this.allfromdate)
              console.log(this.alldate)
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
                      // console.log(new Date(parseInt(this.alldate[j].schedule_date)).getDate())
                      if (this.dates[i].date == new Date(parseInt(this.alldate[j].schedule_date)).getDate()) {
                        this.dates[i].num = this.dates[i].num + 1
                        if (this.alldate[j]['sales_id'] == this.salesid) {
                          this.dates[i].isthisappointment = true
                        }
                      }
                    }
                  }
                }
              }
            })
            console.log(this.dates)
          })
        }
      })

      await modal.present()
  }

  widther() {
    return this.platform.width()
  }

  deleteschedule(scid) {
    // let temp = this.bookinglist.filter(a => a['id'] == scid)
    // if(temp[0].approve_status == true)
    // {
      
    // }
    Swal.fire({
      text: 'Are you sure to delete this schedule?',
      icon: 'info',
      heightAuto: false,
      showCancelButton: true,
      reverseButtons: true
    }).then(a => {
      if (a['isConfirmed'] == true) {
        this.http.post('https://api.nanogapp.com/removeSchedule', {
          schedule_id: scid,
          status: false,
        }).subscribe(a => {
          console.log(a)
          if (a['success'] == true) {
            if (a['data'] == undefined) {
              Swal.fire({
                text: 'This schedule has been approved',
                icon: 'warning',
                heightAuto: false,
                timer: 1500,
              })
              // .then(a => {
              //     this.modal.dismiss('success')
              // })
            }
            else {
              Swal.fire({
                title: 'Remove successfully',
                icon: 'success',
                heightAuto: false,
                timer: 1500,
              }).then(() => {


                this.getdate(this.selecteddate)
                for (let i = 0; i < this.dates.length; i++) {
                  if (this.dates[i] != '') {
                    this.dates[i].num = 0
                  }
                }
                this.getworkschedule()

              })
            }
          }
        })
      }
    })

  }

  back() {
    this.nav.pop()
  }

  detail() {
    this.nav.navigateForward('schedule-calander-detail?uid=' + this.userid)
  }

  keyword
  searchmode = false



  select() {
    // this.nav.navigateForward('schedule-calander-detail?uid=' + this.userid)
    this.searchmode = !this.searchmode
    // this.http.
  }

  scheduletasklist

  search(){
    let temp1
    let temp2
    console.log(this.keyword)
    this.http.post('https://api.nanogapp.com/getFromDateBySearch', {
      keyword : this.keyword.toLowerCase()
        }).subscribe(a => {
          console.log(a)
          temp1 = a['data']
          this.http.post('https://api.nanogapp.com/getScheduleBySearch', {
            keyword : this.keyword.toLowerCase()
          }).subscribe(b => {
            console.log(b)
            temp2 = b['data']
            this.scheduletasklist = temp1.concat(temp2)
            console.log(this.scheduletasklist)
          })
        })
  }

  addtask(){
    let finddate = this.dates.findIndex(a => a['date'] == this.selecteddate)
    if(this.dates[finddate].num > 4){
      Swal.fire({
        text: 'There already have 5 task in the selected day, Are you sure to continue',
        icon : 'info',
        heightAuto: false,
        showCancelButton: true,
        reverseButtons: true,
      }).then(a => {
        if(a['isConfirmed'] == true)
        {
          this.addtasktodatabase()
        }
      })
    }
    else{
      this.addtasktodatabase()
    }

  }

  async addtasktodatabase(){
    let selecteddate = new Date(parseInt(this.selectedyear), parseInt(this.selectedmonth) - 1, parseInt(this.selecteddate), 0).getTime()
    const modal = await this.modal.create({
      cssClass: 'schedulemodal',
      component: ScheduleCalanderInsertPage,
      componentProps: { selecteddate: selecteddate, uid: this.userid, lid: this.leadid, tid: this.taskid, sid: this.salesid}
    })

    modal.onDidDismiss().then(a => {
      if (a['data'] == 'success') {
        this.getdate(this.selecteddate)
        for (let i = 0; i < this.dates.length; i++) {
          if (this.dates[i] != '') {
            this.dates[i].num = 0
          }
        }
        this.getworkschedule()
      }
    })
    await modal.present()
  }

  platformType(){
    return this.platform.platforms()
  }
}
