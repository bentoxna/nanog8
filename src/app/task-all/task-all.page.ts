import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { IonGrid, NavController, Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { NgxPaginationModule } from 'ngx-pagination';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-task-all',
  templateUrl: './task-all.page.html',
  styleUrls: ['./task-all.page.scss'],
})
export class TaskAllPage implements OnInit {
  p: number = 1;
  collection: any[];
  whatsapplinkheader = 'https://wa.me/'
  months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  today2 = new Date();
  currentMonth = this.today2.getMonth();
  // currentMonth2 = this.today2.getMonth();
  currentMonth2 =  new Date(new Date().getTime() - 2629800000).getMonth()
  currentMonth3 = this.today2.getMonth();
  // currentMonth2 = this.months[this.today2.getMonth()]
  currentYear = this.today2.getFullYear();
  // currentYear2 = this.today2.getFullYear();
  currentYear2 =  new Date(new Date().getTime() - 2629800000).getFullYear()
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
  dateselectedmilli
  dateselectedtomorrowmilli

  //use to show the month and year
  monthToShow
  yearToShow
  monthToShow2
  yearToShow2
  monthToShow3
  yearToShow3

  selectedDate
  selectedDate2 = new Date().getTime() - 2629800000;
  selectedDate3 = new Date().getTime();

  //use in the select date
  monthToCheck = this.months[this.currentMonth]
  yearToCheck = this.currentYear
  // monthToCheck2 = this.months[this.currentMonth2]
  // yearToCheck2 = this.currentYear2
  monthToCheck2 = this.months[new Date(new Date().getTime() - 2629800000).getMonth()]
  yearToCheck2 = new Date(new Date().getTime() - 2629800000).getFullYear()
  monthToCheck3 = this.months[this.currentMonth3]
  yearToCheck3 = this.currentYear3

  daysv1 = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  temp = [] as any
  userid
  appointment = [] as any
  appointmentAll = [] as any



  calendar = false
  calendarx = false

  appointmenwithoutpaymentdone = [] as any
  appointmentwithpaymentdone = [] as any
  // mt = (this.heighter() / 100 * 15) + 'px'
  // mt2 = ((this.heighter() / 100 * 15) + 12) + 'px'

  //height for calendar should be 45% of the device height
  ht = ((this.heighter() / 100 * 45) + 0) + 'px'
  th = (this.heighter() / 100 * 15) + 'px'
  // margintopforcontent = (this.heighter() / 100 * 17) + 'px'
  // heightforheader = (this.heighter() / 100 * 15) + 'px'
  // margintopforcontent2 = (this.heighter() / 100 * 24) + 'px'

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


  // let destination = latitude + ',' + longitude;

  // if(this.platform.is('ios')){
  // window.open('maps://?q=' + destination, '_system');
  //   } else {
  //   let label = encodeURI('My Label');
  // window.open('geo:0,0?q=' + destination + '(' + label + ')', '_system');
  // }

  constructor(private nav: NavController,
    private http: HttpClient,
    private route: ActivatedRoute,
    private datepipe: DatePipe,
    private platform: Platform) { }

  ngOnInit() {
    // console.log(this.heighter())



    this.route.queryParams.subscribe(s => {
      this.userid = s.uid
      // console.log(s)


      this.temp.now = new Date()
      // this.temp.today = this.changedateformat(this.temp.now)
      if (this.dateselectedmilli) {
        this.temp.todaymilli = this.dateselectedmilli
        this.temp.tomorrowmilli = this.temp.todaymilli + 86400000
      }
      else {
        this.temp.todaymilli = new Date(new Date().getFullYear(),new Date().getMonth(), new Date().getDate(), 0, 0, 0 ).getTime()
        this.temp.tomorrowmilli = this.temp.todaymilli + 86400000
      }

      // console.log(this.temp.todaymilli, this.temp.tomorrowmilli)

      this.http.post('https://api.nanogapp.com/getAppointmentDetailsForExec', { uid: this.userid }).subscribe((s) => {
        this.appointmentAll = s['data'].filter(a => (a['phone_row_number'] == 1 && a['address_row_number'] == 1) || a['verified'] == true || a['warranty_id'])
        // console.log(this.appointmentAll)
        this.filteredappointment = s['data']

        this.today = this.changedateformat2(this.today2)
        this.showCalendar(this.currentMonth, this.currentYear)
      })

      // console.log(this.userid, this.temp.todaymilli, this.temp.tomorrowmilli)

      this.http.post('https://api.nanogapp.com/getAppointmentForExecByDate', { execId: this.userid, startDate: this.temp.todaymilli, endDate: this.temp.tomorrowmilli }).subscribe((s) => {
        this.appointment =  s['data'].filter(a => (a['phone_row_number'] == 1 && a['address_row_number'] == 1) || a['verified'] == true || a['warranty_id'])
        // console.log(this.appointment)

        this.appointmentwithpaymentdone = this.filterappointment('done')
        // console.log(this.appointmentwithpaymentdone)
        this.appointmenwithoutpaymentdone = this.filterappointment('havent')
        // console.log(this.appointmenwithoutpaymentdone)

        // let temp = this.appointment[0].customer_phone
        // // console.log(temp.search([0]))
      })
    })

    // this.getnumber(x)
    // this.filterer('Appointment', 'status')
  }

  filterappointment(x) {
    if (x == 'done') {
      return this.appointment.filter(a => a['sales_status'] == 'Full Payment')
    }
    else if (x == 'havent') {
      return this.appointment.filter(a => a['sales_status'] != 'Full Payment')
    }
  }

  //change the format of date ex: 2022-10-05 00:00:00
  changedateformat(x) {

    // console.log(x)
    let year = x.getFullYear()
    let month = '' + (x.getMonth() + 1)
    let date = '' + x.getDate()
    let hour = '00:00:00'

    if (month.length < 2) {
      month = '0' + month
    }
    if (date.length < 2) {
      date = '0' + date
    }

    let fulldate = [year, month, date].join('-')
    let fulldatewithtime = [fulldate, hour].join(' ')

    return fulldatewithtime
  }

  //change the format of date ex: 2022-10-05 without time
  changedateformat2(x) {

    // console.log(x)
    let year = x.getFullYear()
    let month = '' + (x.getMonth() + 1)
    let date = '' + x.getDate()

    if (month.length < 2) {
      month = '0' + month
    }
    if (date.length < 2) {
      date = '0' + date
    }

    let fulldate = [year, month, date].join('-')
    return fulldate
  }

  async showCalendar(month, year) {

    this.dates = []

    let firstDay = (new Date(year, month)).getDay();
    let daysInMonth = 32 - new Date(year, month, 32).getDate();
    this.monthToShow = this.months[month]
    this.yearToShow = year

    let date: any = 1;
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          this.dates.push('')
        }
        else if (date > daysInMonth) {
          break;
        }
        else {
          this.dates.push(this.returnTwoDigits(date))
          date++;
        }
      }
    }

    // console.log(this.dates)
  }

  async showCalendar2(month, year) {

    this.dates2 = []

    let firstDay = (new Date(year, month)).getDay();
    let daysInMonth = 32 - new Date(year, month, 32).getDate();
    // console.log(this.monthToShow2, this.yearToShow2)
    this.monthToShow2 = this.months[month]
    this.yearToShow2 = year

    let date: any = 1;
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          this.dates2.push('')
        }
        else if (date > daysInMonth) {
          break;
        }
        else {
          this.dates2.push(this.returnTwoDigits2(date))
          date++;
        }
      }
    }
    // console.log(this.dates2)
  }

  async showCalendar3(month, year) {

    this.dates3 = []

    let firstDay = (new Date(year, month)).getDay();
    let daysInMonth = 32 - new Date(year, month, 32).getDate();
    this.monthToShow3 = this.months[month]
    this.yearToShow3 = year

    let date: any = 1;
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          this.dates3.push('')
        }
        else if (date > daysInMonth) {
          break;
        }
        else {
          this.dates3.push(this.returnTwoDigits3(date))
          date++;
        }
      }
    }
    // console.log(this.dates3)
  }

  returnTwoDigits(x) {

    //temp is use to receive the dates and return it as an object which contain status, date and fulldate
    let temp = {} as any
    // // console.log(temp)
    temp.date = (x.toString().length == 1 ? '' : '') + x
    // temp.date = (x.toString().length == 1 ? '0' : '') + x

    let findmonth = '' + (this.months.findIndex(a => a == this.monthToShow) + 1)
    if (findmonth.length < 2) {
      findmonth = '0' + findmonth
    }
    temp.fulldate = [this.yearToShow, findmonth, temp.date].join('-')
    temp.fulldatemilli = new Date(parseInt(this.yearToShow), parseInt(findmonth) - 1, parseInt(temp.date), 0).getTime()
    // // console.log(temp.fulldatemilli)
    temp.fulldatetomorrowmilli = temp.fulldatemilli + 86400000
    temp.todaymilli = new Date(parseInt(this.today.split('-')[0]), parseInt(this.today.split('-')[1]) - 1, parseInt(this.today.split('-')[2]), 0).getTime()
    temp.tomorrowmilli = temp.todaymilli + 86400000

    // // console.log(temp.fulldatemilli)
    // // console.log(temp.fulldatetomorrowmilli)

    // // console.log(new Date(temp.fulldate).getTime())

    // // console.log(this.appointmentAll)
    // // console.log(new Date(this.appointmentAll[0]['appointment_time']))
    // for(let i = 0; i < this.appointmentAll.length; i++)
    // {
    //   this.appointmentAll[i].milli = new Date(this.appointmentAll[i].appointment_time)
    //   // console.log(this.appointmentAll[i].milli)
    // }
    // for(let i = 0; i < this.appointmentAll.length; i++)
    // {
    //   this.appointmentAll[i].appointment_time = new Date(this.appointmentAll[i].appointment_time)
    // }
    // // console.log(this.appointmentAll)

    //temp2 use to find whether got appointment for the day selected or not, if temp2 is not empty, then temp.status = true mean got appointment
    // let temp2 = this.appointmentAll.filter(a => a['appointment_time'].includes(temp.fulldate))
    let temp2 = this.appointmentAll.filter(a => a['appointment_time'] >= temp.fulldatemilli).filter(b => b['appointment_time'] < temp.fulldatetomorrowmilli)
    // // console.log(temp2)

    // temp3 use to find whether is today or not, today will not show the red dot even though have the task for today
    // let temp3
    // temp2.length > 0 ? temp3 = temp2.filter(a => a['appointment_time'] >= temp.todaymilli).filter(b => b['appointment_time'] < temp.tomorrowmilli) : temp3 = []
    // temp2.length > 0 ? temp3.length > 0 ? temp.status = true : temp.status = true : temp.status = false
    temp2.length > 0 ? temp.status = true : temp.status = false

    //make the red dot on selected date disappear while the date has been selected (while come back from another month or year)
    // // console.log(temp['fulldate'])
    if (temp['fulldate'] == this.selectedDate) {
      // // console.log(temp['fulldate'], this.selectedDate)
      temp.status = false
    }

    return temp
  }

  returnTwoDigits2(x) {

    //temp is use to receive the dates and return it as an object which contain status, date and fulldate
    let temp = {} as any
    // console.log(temp)
    temp.date = (x.toString().length == 1 ? '0' : '') + x

    let findmonth = '' + (this.months.findIndex(a => a == this.monthToShow2) + 1)
    if (findmonth.length < 2) {
      findmonth = '0' + findmonth
    }
    temp.fulldate = [this.yearToShow2, findmonth, temp.date].join('-')
    temp.fulldatemilli = new Date(temp.fulldate).getTime()
    temp.fulldatetomorrowmilli = temp.fulldatemilli + 86400000
    temp.todaymilli = new Date(this.today).getTime()
    temp.tomorrowmilli = temp.todaymilli + 86400000

    //temp2 use to find whether got appointment for the day selected or not, if temp2 is not empty, then temp.status = true mean got appointment
    // let temp2 = this.appointmentAll.filter(a => a['appointment_time'].includes(temp.fulldate))
    let temp2 = this.appointmentAll.filter(a => a['appointment_time'] >= temp.fulldatemilli).filter(b => b['appointment_time'] < temp.fulldatetomorrowmilli)
    // console.log(temp2)

    //temp3 use to find whether is today or not, today will not show the red dot even though have the task for today
    let temp3
    temp2.length > 0 ? temp3 = temp2.filter(a => a['appointment_time'] >= temp.todaymilli).filter(b => b['appointment_time'] < temp.tomorrowmilli) : temp3 = []
    // console.log(temp3)

    temp2.length > 0 ? temp3.length > 0 ? temp.status = false : temp.status = true : temp.status = false
    // console.log(this.selectedDate2)

    //make the red dot on selected date disappear while the date has been selected (while come back from another month or year)
    // console.log(temp['fulldate'])
    if (temp['fulldate'] == this.selectedDate2) {
      // console.log(temp['fulldate'], this.selectedDate2)
      temp.status = false
    }

    return temp
  }

  returnTwoDigits3(x) {

    //temp is use to receive the dates and return it as an object which contain status, date and fulldate
    let temp = {} as any
    // console.log(temp)
    temp.date = (x.toString().length == 1 ? '0' : '') + x

    let findmonth = '' + (this.months.findIndex(a => a == this.monthToShow3) + 1)
    if (findmonth.length < 2) {
      findmonth = '0' + findmonth
    }
    temp.fulldate = [this.yearToShow3, findmonth, temp.date].join('-')
    temp.fulldatemilli = new Date(temp.fulldate).getTime()
    temp.fulldatetomorrowmilli = temp.fulldatemilli + 86400000
    temp.todaymilli = new Date(this.today).getTime()
    temp.tomorrowmilli = temp.todaymilli + 86400000


    //temp2 use to find whether got appointment for the day selected or not, if temp2 is not empty, then temp.status = true mean got appointment
    // let temp2 = this.appointmentAll.filter(a => a['appointment_time'].includes(temp.fulldate))
    let temp2 = this.appointmentAll.filter(a => a['appointment_time'] >= temp.fulldatemilli).filter(b => b['appointment_time'] < temp.fulldatetomorrowmilli)
    // console.log(temp2)

    //temp3 use to find whether is today or not, today will not show the red dot even though have the task for today
    let temp3
    temp2.length > 0 ? temp3 = temp2.filter(a => a['appointment_time'] >= temp.todaymilli).filter(b => b['appointment_time'] < temp.tomorrowmilli) : temp3 = []
    // console.log(temp3)

    temp2.length > 0 ? temp3.length > 0 ? temp.status = false : temp.status = true : temp.status = false
    // console.log(this.selectedDate3)

    //make the red dot on selected date disappear while the date has been selected (while come back from another month or year)
    // console.log(temp['fulldate'])
    if (temp['fulldate'] == this.selectedDate3) {
      // console.log(temp['fulldate'], this.selectedDate3)
      temp.status = false
    }

    return temp
  }

  next() {
    this.currentYear = (this.currentMonth === 11) ? this.currentYear + 1 : this.currentYear;
    this.currentMonth = (this.currentMonth + 1) % 12;
    this.showCalendar(this.currentMonth, this.currentYear);
  }

  next2() {
    this.currentYear2 = (this.currentMonth2 === 11) ? this.currentYear2 + 1 : this.currentYear2;
    this.currentMonth2 = (this.currentMonth2 + 1) % 12;
    this.showCalendar2(this.currentMonth2, this.currentYear2);
  }

  next3() {
    this.currentYear3 = (this.currentMonth3 === 11) ? this.currentYear3 + 1 : this.currentYear3;
    this.currentMonth3 = (this.currentMonth3 + 1) % 12;
    this.showCalendar3(this.currentMonth3, this.currentYear3);
  }

  previous() {
    this.currentYear = (this.currentMonth === 0) ? this.currentYear - 1 : this.currentYear;
    this.currentMonth = (this.currentMonth === 0) ? 11 : this.currentMonth - 1;
    this.showCalendar(this.currentMonth, this.currentYear);
  }
  previous2() {
    this.currentYear2 = (this.currentMonth2 === 0) ? this.currentYear2 - 1 : this.currentYear2;
    this.currentMonth2 = (this.currentMonth2 === 0) ? 11 : this.currentMonth2 - 1;
    this.showCalendar2(this.currentMonth2, this.currentYear2);
  }
  previous3() {
    this.currentYear3 = (this.currentMonth3 === 0) ? this.currentYear3 - 1 : this.currentYear3;
    this.currentMonth3 = (this.currentMonth3 === 0) ? 11 : this.currentMonth3 - 1;
    this.showCalendar3(this.currentMonth3, this.currentYear3);
  }

  getnumber(a) {
    // console.log(a)
    this.selectedDate = a['fulldate']
    this.showCalendar(this.currentMonth, this.currentYear)
    this.selectedDay = a.date
    this.monthToCheck = this.monthToShow
    this.yearToCheck = this.yearToShow

    // console.log(this.monthToCheck)
    let findmonth = '' + (this.months.findIndex(a => a == this.monthToCheck) + 1)
    if (findmonth.length < 2) {
      findmonth = '0' + findmonth
    }
    let hour = '00:00:00'

    let dateselected = [this.yearToCheck, findmonth, this.selectedDay].join('-')

    //make the red dot on selected date disappear while the date has been selected
    let finddate = this.dates.findIndex(a => a['fulldate'] == dateselected)
    this.dates[finddate].status = false

    // let dateselected2 = [dateselected, hour].join(' ')

    // this.dateselectedmilli = new Date(dateselected2).getTime()
    this.dateselectedmilli = new Date(this.yearToCheck, parseInt(findmonth) - 1 , this.selectedDay, 0, 0,0).getTime()
    this.dateselectedtomorrowmilli = this.dateselectedmilli + 86400000
    // let tomorrowmilli2 = new Date(dateselectedmilli + 86400000)
    // let tomorrow = this.changedateformat(tomorrowmilli)

    // console.log(this.dateselectedmilli)
    // console.log(this.dateselectedtomorrowmilli)

    this.http.post('https://api.nanogapp.com/getAppointmentForExecByDate', { execId: this.userid, startDate: this.dateselectedmilli, endDate: this.dateselectedtomorrowmilli }).subscribe((s) => {
      this.appointment =  s['data'].filter(a => (a['phone_row_number'] == 1 && a['address_row_number'] == 1) || a['verified'] == true || a['warranty_id'])
      // console.log(this.appointment)

      this.appointmentwithpaymentdone = this.filterappointment('done')
      // console.log(this.appointmentwithpaymentdone)
      this.appointmenwithoutpaymentdone = this.filterappointment('havent')
      // console.log(this.appointmenwithoutpaymentdone)
    })

    //2022-10-11 00:00:00
    // // console.log(dateselected2)
    // // console.log(tomorrow)

    this.calendar = false
  }

  getnumber2(a) {
    // console.log(a)
    this.selectedDate2 = a['fulldate']
    this.showCalendar2(this.currentMonth2, this.currentYear2)
    this.selectedDay2 = a.date
    this.monthToCheck2 = this.monthToShow2
    this.yearToCheck2 = this.yearToShow2

    this.filterer2(this.appointmentAll)
    this.datetab1 = false
  }
  getnumber3(a) {
    this.selectedDate3 = a['fulldate']
    this.showCalendar3(this.currentMonth3, this.currentYear3)
    this.selectedDay3 = a.date
    this.monthToCheck3 = this.monthToShow3
    this.yearToCheck3 = this.yearToShow3

    this.filterer2(this.appointmentAll)
    this.datetab2 = false
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


  // onScroll(event){
  //   if(event.detail.currentY > 1 )
  //   {
  //     this.calendar = false
  //   }
  // }

  changetab(x) {
    if (x == 'calendar') {
      this.tab1 = true
      this.calendar = false
      this.tab2 = false
    }
    else if (x == 'filter') {
      this.tab2 = true
      this.calendar = false
      this.tab1 = false
      // this.filterer('Appointment', 'status')
    }
  }

  filterstatus() {
    this.filterstatustab == true ? this.filterstatustab = false : this.filterstatustab = true
    this.datetab1 = false
    this.datetab2 = false
  }

  // filterkeyword
  // status
  // datepipe

  filterer2(x) {
    // console.log(x)
    return (x || []).filter(a =>
      a['customer_name'].toLowerCase().includes(this.filterkeyword.toLowerCase())
      && (!this.status ? (a['sales_status'] || a['sales_status'] == null) : (this.status == 'Appointment' ? !a['sales_status'] : a['sales_status'] == this.status))
      && this.datepipe.transform(this.selectedDate2, 'YYYYMMdd') <= this.datepipe.transform(a['appointment_time'], 'YYYYMMdd')
      && this.datepipe.transform(this.selectedDate3, 'YYYYMMdd') >= this.datepipe.transform(a['appointment_time'], 'YYYYMMdd')
    )
  }

  // filterer(x, y) {
  //   this.filteredappointment = this.appointmentAll
  //   this.fromdate = new Date([this.selectedDate2, '00:00:00'].join(' ')).getTime()
  //   this.todate = new Date([this.selectedDate3, '23:59:59'].join(' ')).getTime()

  //   if (y == 'status') {
  //     this.status = x
  //     this.filteredappointment = this.filteredappointment.filter(a =>
  //       this.selectedDate2 && this.selectedDate3 &&
  //         this.filterkeyword ? this.status == 'Appointment' ? a['appointment_time'] >= this.fromdate &&
  //           a['appointment_time'] <= this.todate && a['customer_name'].toLowerCase().includes(this.filterkeyword.toLowerCase()) && a['sales_status']
  //         : a['appointment_time'] >= this.fromdate && a['appointment_time'] <= this.todate && a['customer_name'].toLowerCase().includes(this.filterkeyword.toLowerCase())
  //         && a['sales_status'] == this.status : this.selectedDate2 != undefined && this.selectedDate3 != undefined && !this.filterkeyword ? this.status == 'Appointment' ?
  //           a['appointment_time'] >= this.fromdate && a['appointment_time'] <= this.todate
  //           && a['sales_status'] == null : a['appointment_time'] >= this.fromdate && a['appointment_time'] <= this.todate
  //           && a['sales_status'] == this.status : this.selectedDate2 == undefined && this.selectedDate3 == undefined && this.filterkeyword ? this.status == 'Appointment' ?
  //             a['customer_name'].toLowerCase().includes(this.filterkeyword.toLowerCase())
  //             && a['sales_status'] == null : a['customer_name'].toLowerCase().includes(this.filterkeyword.toLowerCase())
  //             && a['sales_status'] == this.status :
  //         this.status == 'Appointment' ? a['sales_status'] == null : a['sales_status'] == this.status)

  //   }
  //   else if (y == 'date') {
  //     this.filteredappointment = this.filteredappointment.filter(a =>
  //       this.status != undefined && this.filterkeyword != undefined ? this.status == 'Appointment' ?
  //         a['sales_status'] == null && a['customer_name'].toLowerCase().includes(this.filterkeyword.toLowerCase()) && a['appointment_time'] >= this.fromdate && a['appointment_time'] <= this.todate :
  //         a['sales_status'] == this.status && a['customer_name'].toLowerCase().includes(this.filterkeyword.toLowerCase()) && a['appointment_time'] >= this.fromdate && a['appointment_time'] <= this.todate :
  //         this.status != undefined && this.filterkeyword == undefined ? this.status == 'Appointment' ? a['sales_status'] == null && a['appointment_time'] >= this.fromdate && a['appointment_time'] <= this.todate :
  //           a['sales_status'] == this.status && a['appointment_time'] >= this.fromdate && a['appointment_time'] <= this.todate : this.status == undefined && this.filterkeyword != undefined ?
  //           a['customer_name'].toLowerCase().includes(this.filterkeyword.toLowerCase()) && a['appointment_time'] >= this.fromdate && a['appointment_time'] <= this.todate :
  //           a['appointment_time'] >= this.fromdate && a['appointment_time'] <= this.todate)
  //   } else if (y == 'search') {
  //     this.filteredappointment = this.filteredappointment.filter(a =>
  //       this.status != undefined && this.selectedDate2 != undefined && this.selectedDate3 != undefined ? this.status == 'Appointment' ?
  //         a['appointment_time'] >= this.fromdate && a['appointment_time'] <= this.todate && a['sales_status'] == null && a['customer_name'].toLowerCase().includes(this.filterkeyword.toLowerCase()) :
  //         a['appointment_time'] >= this.fromdate && a['appointment_time'] <= this.todate && a['sales_status'] == this.status && a['customer_name'].toLowerCase().includes(this.filterkeyword.toLowerCase()) :
  //         this.status != undefined && this.selectedDate2 == undefined && this.selectedDate3 == undefined ? this.status == 'Appointment' ?
  //           a['sales_status'] == null && a['customer_name'].toLowerCase().includes(this.filterkeyword.toLowerCase()) :
  //           a['sales_status'] == this.status && a['customer_name'].toLowerCase().includes(this.filterkeyword.toLowerCase()) :
  //           this.status == undefined && this.selectedDate2 != undefined && this.selectedDate3 != undefined ?
  //             a['appointment_time'] >= this.fromdate && a['appointment_time'] <= this.todate && a['customer_name'].toLowerCase().includes(this.filterkeyword.toLowerCase()) :
  //             a['customer_name'].toLowerCase().includes(this.filterkeyword.toLowerCase())
  //     )
  //   }

  //   this.filterstatustab = false

  // }

  filterdatestatus(x) {
    // this.filterstatustab = false
    if (x == 'from') {
      // console.log('run here1')
      this.datetab1 == true ? this.datetab1 = false : this.datetab1 = true
      this.datetab2 = false
      this.filterstatustab = false
      // console.log(this.currentMonth2, this.currentYear2)
      this.showCalendar2(this.currentMonth2, this.currentYear2)
    }
    else {
      // console.log('run here2')
      this.datetab1 = false
      this.datetab2 == true ? this.datetab2 = false : this.datetab2 = true
      this.filterstatustab = false
      // console.log(this.currentMonth3, this.currentYear3)
      this.showCalendar3(this.currentMonth3, this.currentYear3)
    }
  }

  refresher() {
    this.status = undefined
    this.selectedDate2 = new Date().getTime() - 2629800000;
    this.selectedDate3 = new Date().getTime();

    this.temp.now = new Date()
    this.temp.today = this.changedateformat(this.temp.now)
    this.temp.todaymilli = new Date(this.temp.today).getTime()

    this.temp.tomorrowmilli = this.temp.todaymilli + 86400000
    // this.temp.tomorrowmilli2 = new Date(this.temp.todaymilli + 86400000)
    // this.temp.tomorrow = this.changedateformat(this.temp.tomorrowmilli2)

    this.route.queryParams.subscribe(s => {
      this.userid = s.uid
      // console.log(s)
    })

    this.http.post('https://api.nanogapp.com/getAppointmentDetailsForExec', { uid: this.userid }).subscribe((s) => {
      this.appointmentAll = s['data']
      // console.log(this.appointmentAll)
      this.filteredappointment = s['data']
      // this.filterer('Appointment' , 'status')

      this.today = this.changedateformat2(this.today2)
      this.showCalendar(this.currentMonth, this.currentYear)
    })

    this.http.post('https://api.nanogapp.com/getAppointmentForExecByDate', { execId: this.userid, startDate: this.temp.todaymilli, endDate: this.temp.tomorrowmilli }).subscribe((s) => {
      this.appointment = s['data']
      // console.log(this.appointment)

      this.appointmentwithpaymentdone = this.filterappointment('done')
      // console.log(this.appointmentwithpaymentdone)
      this.appointmenwithoutpaymentdone = this.filterappointment('havent')
      // console.log(this.appointmenwithoutpaymentdone)
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

  platformType(){
    return this.platform.platforms()
  }

}
