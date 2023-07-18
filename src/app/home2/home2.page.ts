import { Component } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { ModalController, NavController, NavParams, Platform, ToastController } from '@ionic/angular';
import firebase from 'firebase';
import 'firebase/database';
import Swal from 'sweetalert2';
import { HomeSettingPage } from '../home-setting/home-setting.page';
import { HttpClient } from '@angular/common/http';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';

@Component({
  selector: 'app-home2',
  templateUrl: 'home2.page.html',
  styleUrls: ['home2.page.scss'],
})
export class Home2Page {

  uid = localStorage.getItem('nanogapp_uid') || ''

  whatsapplinkheader = 'https://wa.me/'
  user = {} as any
  today = true
  todayforclass = true
  tomorrow = true
  tomorrowforclass = true
  tab2 = 't1'
  tab = false
  temp = [] as any

  meetingtaskcount
  notificationcount
  remindercount1
  remindercount3
  remindercount7

  customer = [] as any

  todaystart = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0,0,0).getTime()
  todayend = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23,59,59).getTime()
  sevendaysafterstart = this.todaystart + (86400000 * 7)
  sevendaysafterend = this.todayend + (86400000 * 7)
  threedaysafterstart = this.todaystart + (86400000 * 3)
  threedaysafterend = this.todayend + (86400000 * 3)
  onedaysafterstart = this.todaystart + (86400000 * 1)
  onedaysafterend = this.todayend + (86400000 * 1)

  constructor(private route : ActivatedRoute, 
    private nav : NavController, 
    private modal : ModalController, 
    private http : HttpClient,
    private platform : Platform,
    private toastController : ToastController, ) {}

  ngOnInit(){


    this.route.queryParams.subscribe(a => {
      console.log(a)
      this.http.post('https://api.nanogapp.com/getSalesExec', {uid:a.uid}).subscribe((s) => {
        console.log(s['data'].user_name)
        this.user = s['data']
        console.log(this.user)
        localStorage.setItem('nanogapp_uid', this.user.uid)
        // this.temp.now = new Date()
        // this.temp.today = this.changedateformat(this.temp.now)
        // this.temp.todaymilli = new Date(this.temp.today).getTime()

        // this.temp.tomorrowmilli = this.temp.todaymilli + 86400000
        // this.temp.thedateaftertomorrowmilli = this.temp.todaymilli + (86400000 * 2)

        this.http.post('https://api.nanogapp.com/getEventstartfromtoday', {uid : this.uid}).subscribe((s) => {
          this.meetingtaskcount = s['data']['count']
          console.log(this.meetingtaskcount)
        })

        this.http.post('https://api.nanogapp.com/getNotificationHistoryunread', {uid : this.uid}).subscribe((s) => {
          this.notificationcount = s['data']['count']
          console.log(this.notificationcount)
        })

        this.http.post('https://api.nanogapp.com/getAppointmentForReminderCount', { execId: this.uid, startDate: this.sevendaysafterstart, endDate: this.sevendaysafterend }).subscribe((s) => {
          this.remindercount7 = s['data']
          console.log(this.remindercount7)
        })
        this.http.post('https://api.nanogapp.com/getAppointmentForReminderCount', { execId: this.uid, startDate: this.threedaysafterstart, endDate: this.threedaysafterend }).subscribe((s) => {
          this.remindercount3 = s['data']
          console.log(this.remindercount3)
        })
        this.http.post('https://api.nanogapp.com/getAppointmentForReminderCount', { execId: this.uid, startDate: this.onedaysafterstart, endDate: this.onedaysafterend }).subscribe((s) => {
   
          this.remindercount1 = s['data']
          console.log(this.remindercount1)
        })
    

        // this.http.post('https://api.nanogapp.com/getAppointmentForExecByDate', {execId:a.uid, startDate: this.temp.tomorrowmilli, endDate: this.temp.thedateaftertomorrowmilli}).subscribe((s) => {
          
        //   console.log(s)
        //   this.tomorrowtask = s['data']
        //   console.log(this.tomorrowtask)
        // })

      })
    }) 

  }

  changedateformat(x){
    console.log(x)
    let year = x.getFullYear()
    let month = '' + (x.getMonth() + 1)
    let date = '' + x.getDate()
    let hour = '00:00:00'

    if(month.length<2)
    {
      month = '0' + month
    }
    if(date.length < 2)
    {
      date = '0' + date
    }

    let fulldate = [year, month, date].join('-')
    let fulldatewithtime = [fulldate, hour].join(' ')

    console.log(fulldatewithtime)
    return fulldatewithtime
  }

  filtert1(){

      let filtertodaytask = []
      filtertodaytask = this.customer.filter(a => new Date(a['date']).getTime() >= this.temp.todaymilli).filter(b => new Date(b['date']).getTime() < this.temp.tomorrowmilli)
      return filtertodaytask
  }

  filtert2(){
    let filtertomorrowtask = []
    filtertomorrowtask = this.customer.filter(a => new Date(a['date']).getTime() >= this.temp.tomorrowmilli).filter(b => new Date(b['date']).getTime() < this.temp.thedateaftertomorrow)
    return filtertomorrowtask
  }

  async callsetting(){
    const modal = await this.modal.create({
      cssClass: 'modal',
      component: HomeSettingPage,
    })

    await modal.present()
  }

  godetail(x){
    console.log(x)
    this.nav.navigateForward('task-detail?uid=' + this.user.uid + '&tid=' + x)
  }

  viewall(){
    this.nav.navigateForward('task-all?uid=' + this.user.uid)
  }

  goprofile(){
    this.nav.navigateForward('profile-edit?uid=' + this.user.uid)
  }

  signout(){
    console.log('run here')
    firebase.auth().signOut()
  }

  closetab(x){
  
    if(x == 'today' && this.today == false)
    {
      this.today = true
    }
    else if(x == 'today' && this.today == true)
    {
      this.today = false
    }
    else if(x == 'tomorrow' && this.tomorrow == false)
    {
      this.tomorrow = true
    }
    else if(x == 'tomorrow' && this.tomorrow == true)
    {
      this.tomorrow = false
    }
  }


  mapnavigate(latitude, longitude, address) {
    console.log(latitude, longitude, address)
    if (latitude != null && longitude != null) {
      let destination = latitude + ',' + longitude;

      if (this.platform.is('ios')) {
        window.open('maps://?q=' + destination, '_system');
      } else {
        window.open('geo:0,0?q=' + destination, '_system');
      }
    }
    else
    {
      let destination = address;
      if (this.platform.is('ios')) {
        window.open('maps://?q=' + destination, '_system');
      } else {
        window.open('geo:?q=' + destination, '_system');
      }
    }
  }

  homecalendar(){
    this.nav.navigateForward('home-calendar?uid=' + this.user.uid)
  }

  addLead(){
    this.nav.navigateForward('lead-task?uid=' + this.user.uid)
  }

  platformType(){
    return this.platform.platforms()
  }

  goupcomingtask(){
    this.nav.navigateForward('tab1-upcoming-task')
  }

  gopending(){
    this.nav.navigateForward('tab2-pending-approval')
  }

  gotaskall(){
    this.nav.navigateForward('tab3-task-all')
  }

  goNotificationHistory(){
    this.nav.navigateForward('tab0-notification-history')
  }

  getreminder(){
    this.nav.navigateForward('reminder')
  }

  gomeeting(){
    this.nav.navigateForward('event')
  }

}
