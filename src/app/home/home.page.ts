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
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  whatsapplinkheader = 'https://wa.me/'
  user = {} as any
  today = true
  todayforclass = true
  tomorrow = true
  tomorrowforclass = true
  tab2 = 't1'
  tab = false
  temp = [] as any

  todaytask = [] as any
  tomorrowtask = [] as any

  customer = [] as any

  constructor(private route : ActivatedRoute, 
    private nav : NavController, 
    private modal : ModalController, 
    private http : HttpClient,
    private platform : Platform,
    private toastController : ToastController, ) {}

  ngOnInit(){

    // this.route.queryParams.subscribe(a => {
    //   firebase.database().ref('users/' + a.uid).on('value', a =>{
    //     this.user = a.val()
    //     console.log(this.user)
    //   })
    // })

    // this.http.post('https://api.nanogapp.com/getAppointmentForExecByDate', {execId:"LbdDaz3w3yPFVjTEQVr6PbGP3PC3", startDate: '2022-10-05 00:00:00', endDate: '2022-10-04 00:00:00'}).subscribe((s) => {
          
    //   console.log(s)
    //   this.todaytask = s['appointment']
    //   console.log(this.todaytask)
    // })
    

    this.route.queryParams.subscribe(a => {
      console.log(a)
      this.http.post('https://api.nanogapp.com/getSalesExec', {uid:a.uid}).subscribe((s) => {
        console.log(s['data'].user_name)
        this.user = s['data']
        console.log(this.user)
        localStorage.setItem('nanogapp_uid', this.user.uid)
        this.temp.now = new Date()
        this.temp.today = this.changedateformat(this.temp.now)
        this.temp.todaymilli = new Date(this.temp.today).getTime()

        this.temp.tomorrowmilli = this.temp.todaymilli + 86400000
        console.log(this.temp.tomorrowmilli)
        // this.temp.tomorrowmilli2 = new Date(this.temp.todaymilli + 86400000)
        // this.temp.tomorrow = this.changedateformat(this.temp.tomorrowmilli2)
        
        this.temp.thedateaftertomorrowmilli = this.temp.todaymilli + (86400000 * 2)
        console.log(this.temp.todaymilli + (86400000 * 2))
        // this.temp.thedateaftertomorrowmilli2 = new Date(this.temp.todaymilli + (86400000 * 2))
        // this.temp.thedateaftertomorrow = this.changedateformat(this.temp.thedateaftertomorrowmilli2)

        console.log(this.customer)

        this.http.post('https://api.nanogapp.com/getAppointmentForExecByDate', {execId:a.uid, startDate: this.temp.todaymilli, endDate: this.temp.tomorrowmilli}).subscribe((s) => {
          console.log(s)
          this.todaytask = s['data']
          for(let i = 0 ; i < this.todaytask.length; i ++)
          {
            this.todaytask[i].appointment_time2 = this.todaytask[i].appointment_time.split('T')
          }
          console.log(this.todaytask)
        })

        this.http.post('https://api.nanogapp.com/getAppointmentForExecByDate', {execId:a.uid, startDate: this.temp.tomorrowmilli, endDate: this.temp.thedateaftertomorrowmilli}).subscribe((s) => {
          
          console.log(s)
          this.tomorrowtask = s['data']
          console.log(this.tomorrowtask)
        })

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

  // changetab(){
  //   this.tab = !this.tab
  // }

  // changetab2(x){
  //   this.tab2 = x
  // }

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
    // x == 'today' ? this.todayforclass = !this.todayforclass : this.todayforclass = this.todayforclass

    // x == 'tomorrow' ? this.tomorrowforclass = !this.tomorrowforclass : this.tomorrowforclass = this.tomorrowforclass
    
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
        // let label = encodeURI('My Destination');
        window.open('geo:0,0?q=' + destination, '_system');
        // window.open('https://www.google.com/maps/search/' + destination, '_system')
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

  // fcmNotification() {

  //   FCM.onNotification().subscribe(async data => {
  //     if (data.wasTapped) {
  //       setTimeout(() => {
  //         this.nav.navigateForward(data.path);
  //       }, 2000);
  //     }
  //     else {
  //       this.presentToastWithOptions(data.title, data.message, data.id, data.path)
  //     }
  //   })


  // }

  // async presentToastWithOptions(header, msg, id, path) {

  //   const toast = await this.toastController.create({
  //     header: header,
  //     message: msg,
  //     position: 'top',
  //     duration: 3000,
  //     buttons: [
  //       {
  //         text: 'Go',
  //         handler: () => {
  //           this.nav.navigateForward(path);
  //         }
  //       }
  //     ]
  //   });
  //   toast.present();
  // }

}
