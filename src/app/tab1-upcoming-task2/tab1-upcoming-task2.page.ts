import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { IonGrid, NavController, Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { NgxPaginationModule } from 'ngx-pagination';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-tab1-upcoming-task2',
  templateUrl: './tab1-upcoming-task2.page.html',
  styleUrls: ['./tab1-upcoming-task2.page.scss'],
})
export class Tab1UpcomingTask2Page implements OnInit {

  userid = localStorage.getItem('nanogapp_uid') || ''

  p: number = 1;
  collection: any[];
  whatsapplinkheader = 'https://wa.me/'
  months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  today2 = new Date();
  currentMonth = this.today2.getMonth();
  // currentMonth2 = this.today2.getMonth();
  currentMonth2 = new Date(new Date().getTime() - 2629800000).getMonth()
  currentMonth3 = this.today2.getMonth();
  // currentMonth2 = this.months[this.today2.getMonth()]
  currentYear = this.today2.getFullYear();
  // currentYear2 = this.today2.getFullYear();
  currentYear2 = new Date(new Date().getTime() - 2629800000).getFullYear()
  currentYear3 = this.today2.getFullYear();
  currentDay = this.today2.getDate();
  currentDay2 = this.today2.getDate();
  currentDay3 = this.today2.getDate();
  today
  selectedDay = this.today2.getDate();
  selectedDay2 = this.today2.getDate();
  selectedDay3 = this.today2.getDate();
  dates = [] as any
  dates2 = [] as any
  dates3 = [] as any
  todaydate = new Date()
  gettodaydate = [this.todaydate.getFullYear(), this.todaydate.getMonth() < 12 ? this.todaydate.getMonth() + 1 : 1, this.todaydate.getDate()].join('-')

  daysv1 = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  appointment = [] as any
  appointNow = [] as any
  appointPast = [] as any
  appointmentAll = [] as any

  calendar = false
  calendarx = false

  ht = ((this.heighter() / 100 * 45) + 0) + 'px'
  th = (this.heighter() / 100 * 15) + 'px'

  tab1 = true
  tab2 = false
  filterstatustab = false
  filterlist = ['Appointment', 'Quotation', 'Deposit', 'Full Payment']
  filteredappointment = [] as any
  datetab1 = false
  datetab2 = false
  todate
  fromdate
  status
  filterkeyword = ''
  type = 'present'

  constructor(private nav: NavController,
    private http: HttpClient,
    private route: ActivatedRoute,
    private datepipe: DatePipe,
    private platform: Platform) { }

  ngOnInit() {
    // console.log(this.heighter())
    // const Toast = Swal.mixin({
    //   toast: true,
    //   position: 'top',
    //   showConfirmButton: false,
    //   timer: 10000,
    //   timerProgressBar: true,
    //   didOpen: (toast) => {
    //     Swal.showLoading()
    //   }
    // })

    // Toast.fire({
    //   icon: 'info',
    //   title: 'Loading Data....'
    // })


    // this.http.post('https://api.nanogapp.com/getAppointmentDetailsForExec3', { uid: this.userid, month: new Date().getMonth(), year: new Date().getFullYear() }).subscribe((s) => {
    //   this.appointmentAll = s['data'].filter(a => ((a['phone_row_number'] == 1) || a['verified'] == true || a['warranty_id']))
    //   // console.log(this.appointmentAll)
    //   this.filteredappointment = s['data']

    //   this.today = this.changedateformat2(this.today2)
    //   this.showCalendar(this.currentMonth, this.currentYear)
    //   // Swal.close()

    // })

    // this.http.post('https://api.nanogapp.com/getexistsdate', { uid: this.userid, month: new Date().getMonth(), year: new Date().getFullYear() }).subscribe((s) => {
    //   // console.log(s)
    // })

    // console.log(this.userid, this.temp.todaymilli, this.temp.tomorrowmilli)

    const todayStart = new Date().setHours(0, 0, 0, 1); // Midnight of current day

    this.http.post('https://api.nanogapp.com/getAppointmentForExecByDatev2forlist', { execId: this.userid, startDate: 1269473310000, endDate: 2531777310000 }).subscribe((s) => {
      this.appointment = s['data'].filter(a => ((a['phone_row_number'] == 1) || a['verified'] == true || a['warranty_id']))

      this.appointNow = this.appointment.filter(a => a.appointment_time >= todayStart)
      this.appointPast = this.appointment.filter(a => a.appointment_time < todayStart)

      console.log(this.appointNow)
      console.log(this.appointPast)

    })
  }

  refresher() {
    this.status = undefined

    this.route.queryParams.subscribe(s => {
      this.userid = s.uid
      // console.log(s)
    })

    // this.http.post('https://api.nanogapp.com/getAppointmentDetailsForExec3', { uid: this.userid, month: new Date().getMonth(), year: new Date().getFullYear() }).subscribe((s) => {
    //   this.appointmentAll = s['data']
    //   // console.log(this.appointmentAll)
    //   this.filteredappointment = s['data']
    //   // this.filterer('Appointment' , 'status')

    //   this.today = this.changedateformat2(this.today2)
    //   this.showCalendar(this.currentMonth, this.currentYear)
    // })

    this.http.post('https://api.nanogapp.com/getAppointmentForExecByDatev2forlist', { execId: this.userid, startDate: 1269473310000, endDate: 2531777310000 }).subscribe((s) => {
      this.appointment = s['data'].filter(a => ((a['phone_row_number'] == 1) || a['verified'] == true || a['warranty_id']))
      console.log(this.appointment)

    })


  }

  mapnavigate(latitude, longitude, address) {
    // console.log(latitude, longitude, address)
    if (latitude != null && longitude != null) {
      let destination = latitude + ',' + longitude;

      if (this.platform.is('ios')) {
        window.open('maps://?q=' + destination, '_system');
      } else {
        // let label = encodeURI('My Destination');
        window.open('geo:0,0?q=' + destination, '_system');
        // window.open('https://www.google.com/maps/search/' + destination, '_system')
      }
    }
    else {
      let destination = address;

      if (this.platform.is('ios')) {
        window.open('maps://?q=' + destination, '_system');
      } else {
        window.open('geo:?q=' + destination, '_system');
      }
    }
  }

  platformType() {
    return this.platform.platforms()
  }

  magnify(x) {
    Swal.fire({
      imageUrl: x,
      heightAuto: false,
      confirmButtonText: 'Close',
      text: x
    })
  }

  openvideo(x) {
    this.nav.navigateForward('video-viewer?link=' + x)
  }

  video = '' as any
  async videocontroller(x, y) {
    // this.nav.navigateForward('video-viewer?link=' + x)
    // console.log(x)
    const videostart = document.getElementById('videoPlayer') as HTMLVideoElement
    if (y == 'open') {
      this.video = x
      // videostart.play()
    }
    else if (y == 'close') {
      videostart.pause()
      this.video = ''
    }

  }

  back() {
    this.nav.pop()
  }

  godetail(x) {
    // console.log(x)
    this.nav.navigateForward('task-detail?uid=' + this.userid + '&tid=' + x)
  }

  showcalendar(x) {
    if (x == 'on') {
      this.calendar = true
    }
    else if (x == 'off') {
      this.calendar = false
    }
  }

  heighter() {
    return this.platform.height()
  }

}