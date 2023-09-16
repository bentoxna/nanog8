import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-reminder',
  templateUrl: './reminder.page.html',
  styleUrls: ['./reminder.page.scss'],
})
export class ReminderPage implements OnInit {
  p: number = 1;
  whatsapplinkheader = 'https://wa.me/'
  tab = 1
  userid = localStorage.getItem('nanogapp_uid') || ''
  today = new Date()
  todaystart = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0,0,0).getTime()
  todayend = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23,59,59).getTime()
  sevendaysafterstart = this.todaystart + (86400000 * 7)
  sevendaysafterend = this.todayend + (86400000 * 7)
  threedaysafterstart = this.todaystart + (86400000 * 3)
  threedaysafterend = this.todayend + (86400000 * 3)
  onedaysafterstart = this.todaystart + (86400000 * 1)
  onedaysafterend = this.todayend + (86400000 * 1)

  appointmentsevendaysbefore
  appointmentthreedaysbefore
  appointmentonedaysbefore

  constructor(private nav : NavController,
    private http : HttpClient,
    private platform : Platform) { }

  ngOnInit() {
    this.http.post('https://api.nanogapp.com/getAppointmentForReminder2', { execId: this.userid, startDate: this.sevendaysafterstart, endDate: this.sevendaysafterend }).subscribe((s) => {
      console.log(s)
      this.appointmentsevendaysbefore = s['data']
    })
    this.http.post('https://api.nanogapp.com/getAppointmentForReminder2', { execId: this.userid, startDate: this.threedaysafterstart, endDate: this.threedaysafterend }).subscribe((s) => {
      console.log(s)
      this.appointmentthreedaysbefore = s['data']
    })
    this.http.post('https://api.nanogapp.com/getAppointmentForReminder2', { execId: this.userid, startDate: this.onedaysafterstart, endDate: this.onedaysafterend }).subscribe((s) => {
      console.log(s)
      this.appointmentonedaysbefore = s['data']
    })

  }

  changetab(x){
    this.tab = x
  }

  back(){
    this.nav.pop()
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
    else {
      let destination = address;

      if (this.platform.is('ios')) {
        window.open('maps://?q=' + destination, '_system');
      } else {
        window.open('geo:?q=' + destination, '_system');
      }
    }
  }

  godetail(x) {
    this.nav.navigateForward('task-detail?uid=' + this.userid + '&tid=' + x)
  }

  sendWhatsAppMessage(x) {
    const phoneNumber = x.customer_phone
    const installationDate = new Date(new Date().getTime() + (86400000 * this.tab))
    const message = "Hi, " + x.customer_name + ". We are pleased to inform you that our installation team will be visiting your house on " + "*" + installationDate.toDateString() + "*" + " for the installation. If you have any questions or need to reschedule, please let us know. Thank you!";
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappURL, "_blank");
  }

}
