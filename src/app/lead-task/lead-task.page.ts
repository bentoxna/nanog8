import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { getData } from 'exif-js';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lead-task',
  templateUrl: './lead-task.page.html',
  styleUrls: ['./lead-task.page.scss'],
})
export class LeadTaskPage implements OnInit {

  p: number = 1;
  q: number = 1;
  o: number = 1;
  collection: any[];

  userid
  user = {} as any
  leadlist = [] as any
  leadlistmonth = [] as any
  leadListbackup = [] as any
  leadlistfilter = [] as any

  filterword
  searchmode = false

  calendar = false

  now = new Date()
  syear
  smonth
  sdate
  days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  dates = [] 
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']


  startdatemonth
  enddatemonth

  startdate
  enddate

  outsideyear
  outsidemnth
  outsidedate

  constructor(
    private route : ActivatedRoute,
    private modal : ModalController,
    private nav: NavController,
    private http: HttpClient,
    private platform : Platform) { }

  ngOnInit() {
    this.syear = new Date().getFullYear()
    this.smonth = new Date().getMonth()
    this.sdate = new Date().getDate()

    this.startdatemonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime()
    this.enddatemonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23,59,59).getTime()
    this.startdate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0,0,0).getTime()
    this.enddate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate(), 23,59,59).getTime()

    this.outsideyear = new Date(this.startdate).getFullYear()
    this.outsidemnth = new Date(this.startdate).getMonth()
    this.outsidedate = new Date(this.startdate).getDate()

    this.route.queryParams.subscribe(a => {
      this.userid = a['uid']

      this.filterword = ''

      console.log(this.startdate, this.enddate)
      this.http.post('https://api.nanogapp.com/getLeadListForApp', {
        uid : this.userid,
        fromdate : this.startdatemonth,
        todate : this.enddatemonth
      }).subscribe((s) => {
        console.log(s['data']);
        this.leadlistmonth = s['data']
         this.getcalendar().then(a => {
          this.dates.filter(a => a['date'] == this.sdate ? a['selected'] = true : a['selected'] = false)
         })
      })

      this.http.post('https://api.nanogapp.com/getLeadListForApp', {
        uid : this.userid,
        fromdate : this.startdate,
        todate : this.enddate
      }).subscribe((s) => {
        console.log(s['data']);
        // this.leadlist = s['data']
        // console.log(this.leadlist)
        
        // this.leadListbackup = s['data'].filter(a => a.sales_exec == this.userid).sort((a, b) => b.lead_id - a.lead_id)
        // this.leadlist = s['data'].filter(a => a.sales_exec == this.userid).sort((a, b) => b.lead_id - a.lead_id)

        this.leadlist = s['data']
        this.leadListbackup = s['data']
        // this.pendingAppointment = s['data'].filter(a => a.sales_exec == this.user.uid).filter(a => a.label_s == 'Pending Appointment Date').sort((a, b) => b.lead_id - a.lead_id)
  
        console.log(this.leadlist)
        // if (this.user.user_role == 'Super Admin' || this.user.user_role == 'System Admin') {
        //   this.leads = s['data'].sort((a, b) => b.lead_id - a.lead_id)
        //   this.pendingAppointment = s['data'].sort((a, b) => b.lead_id - a.lead_id).filter(a => a.label_s == 'Pending Appointment Date')
        // } else if (this.user.user_role == 'Sales Coordinator') {
        //   this.leads = s['data'].filter(a => a.sales_coord_uid == this.user.uid).sort((a, b) => b.lead_id - a.lead_id)
        //   this.pendingAppointment = s['data'].filter(a => a.sales_coord_uid == this.user.uid).filter(a => a.label_s == 'Pending Appointment Date').sort((a, b) => b.lead_id - a.lead_id)
        // } else if (this.user.user_role == 'Sales Executive') {
        //   this.leads = s['data'].filter(a => a.sales_exec == this.user.uid).sort((a, b) => b.lead_id - a.lead_id)
        //   this.pendingAppointment = s['data'].filter(a => a.sales_exec == this.user.uid).filter(a => a.label_s == 'Pending Appointment Date').sort((a, b) => b.lead_id - a.lead_id)
        // } else {
        //   this.leads = s['data'].sort((a, b) => b.lead_id - a.lead_id)
        //   this.pendingAppointment = s['data'].sort((a, b) => b.lead_id - a.lead_id).filter(a => a.label_s == 'Pending Appointment Date')
        // }
  
        // this.storeAllLeadsOriginData = this.leads
        // this.storePendingAppOriginData = this.pendingAppointment
  
        // console.log(this.storePendingAppOriginData);
  
        // console.log('lead', this.leads);
        // console.log('appointment', this.pendingAppointment);
  
        // if ((this.user.user_role == 'Super Admin' || this.user.user_role == 'System Admin') && this.pendingAppointment.length == 0) {
        //   this.tab = 'all'
        // } else if (this.user.user_role == 'Sales Coordinator') {
        //   if (this.pendingAppointment.length > 0) {
        //     this.tab = 'pending'
        //   } else if (this.scpaymentlog.length > 0) {
        //     this.tab = 'paymentSC'
        //   } else {
        //     this.tab = 'all'
        //   }
        // } else if (this.user.user_role == 'Account') {
        //   if (this.acpaymentlog.length > 0) {
        //     this.tab = 'paymentAcc'
        //   } else {
        //     this.tab = 'all'
        //   }
        // }
  
        // this.storeAllLeadsOriginData = this.leads
        // this.storePendingAppOriginData = this.pendingAppointment
  
        // let tempLabelFilter = this.leads.filter((index, subLabel) => subLabel === this.leads.findIndex(search => index['label_s'] === search['label_s'] && index['label_s_colour'] === search['label_s_colour']))
  
        // this.filteredLabel = tempLabelFilter.map(a => ({ label_s: a['label_s'], label_s_colour: a['label_s_colour'], status: false }))
        // // this.filteredLabel.filter(a => a['status'] = false)
        // console.log(this.filteredLabel);
      })
    })
  }

  refresher(){
    this.route.queryParams.subscribe(a => {
      this.userid = a['uid']

      this.filterword = ''

      console.log(this.startdate, this.enddate)
      this.http.post('https://api.nanogapp.com/getLeadListForApp', {
        uid : this.userid,
        fromdate : this.startdatemonth,
        todate : this.enddatemonth
      }).subscribe((s) => {
        console.log(s['data']);
        this.leadlistmonth = s['data']
        this.getcalendar()
      })

      this.http.post('https://api.nanogapp.com/getLeadListForApp', {
        uid : this.userid,
        fromdate : this.startdate,
        todate : this.enddate
      }).subscribe((s) => {
        console.log(s['data']);
        this.leadlist = s['data']
        this.leadListbackup = s['data']
        console.log(this.leadlist)

      })
    })
  }

  getdate(x,no){
    console.log(x,no)
    this.dates.filter((a,i) => i == no ? a['selected'] = true : a['selected'] = false )
    console.log(this.dates)
    this.startdate = new Date(this.syear , this.smonth, this.dates[no]['date'], 0,0,0).getTime()
    this.enddate = new Date(this.syear , this.smonth, this.dates[no]['date'], 23,59,59).getTime()
    console.log(this.startdate)
    console.log(this.enddate)
    this.outsideyear = new Date(this.startdate).getFullYear()
    this.outsidemnth = new Date(this.startdate).getMonth()
    this.outsidedate = new Date(this.startdate).getDate()
  
    this.http.post('https://api.nanogapp.com/getLeadListForApp', {
      uid : this.userid,
      fromdate : this.startdate,
      todate : this.enddate
    }).subscribe((s) => {
      this.leadlist = s['data']
      console.log(this.leadlist)
      this.leadListbackup = s['data']
      this.calendar = false
    })
  }

  async getcalendar(){
    this.dates = []
    let temp = new Date(this.syear, this.smonth + 1 , 0).getDate()
    for(let i = 0 ; i < temp; i++)
    {
      let starttime = new Date(this.syear, this.smonth, i + 1, 0,0,0).getTime()
      let endtime = new Date(this.syear, this.smonth, i + 1, 23,59,59).getTime()
      let tempchecker = this.leadlistmonth.filter(a => a['created_date'] >= starttime && a['created_date'] <= endtime )
      this.dates.push(
        {
          date : i + 1,
          data : tempchecker.length,
          marker : tempchecker.length > 0 ? true : false
        }
      )
    }
    this.concatcalendar()

  }

  next(){
    let next = new Date(this.syear, this.smonth + 1, 1)
    this.smonth = new Date(next).getMonth()
    this.syear = new Date(next).getFullYear()

    this.startdatemonth = new Date(new Date(next).getFullYear(), new Date(next).getMonth(), 1).getTime()
    this.enddatemonth = new Date(new Date(next).getFullYear(), new Date(next).getMonth() + 1, 0, 23,59,59).getTime()
    // this.startdate = new Date(new Date(next).getFullYear(), new Date(next).getMonth(), new Date(next).getDate(), 0,0,0).getTime()
    // this.enddate = new Date(new Date(next).getFullYear(), new Date(next).getMonth() + 1, new Date(next).getDate(), 23,59,59).getTime()
    this.refresher()
  }

  previous(){
    let previous = new Date(this.syear, this.smonth -1, 1)
    this.smonth = new Date(previous).getMonth()
    this.syear = new Date(previous).getFullYear()
    this.startdatemonth = new Date(new Date(previous).getFullYear(), new Date(previous).getMonth(), 1).getTime()
    this.enddatemonth = new Date(new Date(previous).getFullYear(), new Date(previous).getMonth() + 1, 0, 23,59,59).getTime()
    // this.startdate = new Date(new Date(previous).getFullYear(), new Date(previous).getMonth(), new Date(previous).getDate(), 0,0,0).getTime()
    // this.enddate = new Date(new Date(previous).getFullYear(), new Date(previous).getMonth() + 1, new Date(previous).getDate(), 23,59,59).getTime()
    this.refresher()
  }

  concatcalendar(){
    let daycheck = new Date(this.syear, this.smonth , 1).getDay()
    console.log(daycheck)
    let tempdates = [] as any
    for(let i = 0; i < daycheck ; i++)
    {
      tempdates.push(
        {
          date : ''
        }
      )
    }

    this.dates = tempdates.concat(this.dates)

    console.log(this.dates)
  }

  back(){
    this.nav.pop()
  }

  toLeadAdd(){
    this.nav.navigateForward('lead-add?uid=' + this.userid)
  }

  godetail(x){
    this.nav.navigateForward('lead-appointment?uid=' + this.userid + '&lid=' + x.lead_id )
  }

  // filtererLead(){

  //   this.leadlist = this.leadListbackup
  //   this.leadlist = this.leadListbackup.filter(a => ((a['customer_name'] || '') + (a['customer_phone'] || '') + (a['customer_email'] || '')).toLowerCase().includes(this.filterword.toLowerCase()))
  //   console.log(this.leadlist)
  //   console.log(this.leadListbackup)
  // }

  searchfromdatabase(){
    this.p = 1
    this.searchmode = true
    Swal.fire({
      text : 'Processing...',
      icon : 'info',
      heightAuto : false,
      showConfirmButton : false
    })
    this.http.post('https://api.nanogapp.com/getLeadListForAppByname', {
      uid : this.userid,
      keyword : this.filterword.toLowerCase()
    }).subscribe((s) => {
      console.log(s['data']);
      this.leadlistfilter = s['data']
      setTimeout(() => {
        if(this.leadlistfilter.length > 0)
        {
          Swal.close()
        }
        else if(this.leadlistfilter.length < 1)
        {
          Swal.fire({
            text : 'No data get from the database, kindly try with other word / number',
            icon : 'info',
            heightAuto : false
          })
        }

      }, 700);
    })
  }

  offsearchmode(){
    this.p = 1
    this.searchmode = false
    this.filterword = ''
  }

  platformType(){
    return this.platform.platforms()
  }

  showcalendar(x)
  {
    x == 'on' ? this.calendar = true : this.calendar = false
  }

}
