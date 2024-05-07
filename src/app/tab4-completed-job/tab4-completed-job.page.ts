import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { IonGrid, NavController, Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { NgxPaginationModule } from 'ngx-pagination';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-tab4-completed-job',
  templateUrl: './tab4-completed-job.page.html',
  styleUrls: ['./tab4-completed-job.page.scss'],
})
export class Tab4CompletedJobPage implements OnInit {

  constructor(
    private nav: NavController,
    private http: HttpClient,
    private route: ActivatedRoute,
    private datepipe: DatePipe,
    private platform: Platform
  ) { }

  userid = localStorage.getItem('nanogapp_uid') || ''
  whatsapplinkheader = 'https://wa.me/'

  p: number = 1;
  months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  today = new Date();

  daysv1 = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  video = '' as any
  temp = false

  lead_list = [] as any
  lead_list_origin = [] as any

  keyword

  ngOnInit() {
    this.http.post('https://api.nanogapp.com/getCompletedJob', { execId: this.userid }).subscribe((s) => {
      console.log(s['data']);

      this.lead_list = s['data']
      this.lead_list_origin = s['data']

    })
  }

  magnify(x) {
    Swal.fire({
      imageUrl: x,
      heightAuto: false,
      confirmButtonText: 'Close',
      // text: x
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

  filterer() {
    this.lead_list = this.lead_list_origin.filter(a => ((a.customer_name || '') + (a.customer_phone || '') + (a.customer_city || '') + (a.customer_state || '')).toLowerCase().includes(this.keyword.toLowerCase()))
  }

  openvideo(x) {
    this.nav.navigateForward('video-viewer?link=' + x)
  }

  async videocontroller(x, y) {

    const videostart = document.getElementById('videoPlayer') as HTMLVideoElement
    if (y == 'open') {
      this.video = x
    }
    else if (y == 'close') {
      videostart.pause()
      this.video = ''
    }

  }

  todetail(x,y) {
    this.nav.navigateForward('completed-job-detail?no=' + x + '&&id=' + y + '&&from=2')
  }

  back() {
    this.nav.pop()
  }

}

