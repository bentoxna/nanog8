import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { timer } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-task-equipment',
  templateUrl: './task-equipment.page.html',
  styleUrls: ['./task-equipment.page.scss'],
})
export class TaskEquipmentPage implements OnInit {


  scaffheight
  scafffee
  scaffname

  skyliftheight
  skyliftfee
  skyliftname

  transportation_fee
  transportation_name

  sales = [] as any
  salesid
  leadid
  userid = localStorage.getItem('nanogapp_uid') || ''
  username

  equipScaffolding = [] as any
  equipSkylift = [] as any
  equipTransport = [] as any

  showSelect = false
  constructor(private route: ActivatedRoute,
    private nav: NavController,
    private http: HttpClient) { }

  ngOnInit() {
    this.route.queryParams.subscribe(a => {
      // console.log(a)
      this.salesid = a['salesid']
      this.leadid = a['leadid']

      this.refresher()

    })
  }

  refresher() {

    this.http.post('https://api.nanogapp.com/getSalesExec', { uid: this.userid }).subscribe((s) => {
      // console.log(s['data'].user_name)
      this.username = s['data'].user_name
    })

    this.http.get('https://api.nanogapp.com/getEquipmentAll').subscribe((s) => {
      this.equipScaffolding = s['data'].filter(a => a.type == 'Scaffolding')
      this.equipSkylift = s['data'].filter(a => a.type == 'Skylift')
      this.equipTransport = s['data'].filter(a => a.type == 'Transportation Fee')
      console.log(s['data']);

      this.http.post('https://api.nanogapp.com/getScaffAndSkylift', { salesid: this.salesid }).subscribe(a => {

        this.sales = a['data'][0]

        this.scaffheight = this.sales['scaff_height']
        this.scafffee = this.sales['scaff_fee']
        this.scaffname = this.scafffee ? this.equipScaffolding.filter(a => a.price == this.scafffee)[0].name : null

        this.skyliftheight = this.sales['skylift_height']
        this.skyliftfee = this.sales['skylift_fee']
        this.skyliftname = this.skyliftfee ? this.equipSkylift.filter(a => a.price == this.skyliftfee)[0].name : null

        this.transportation_fee = this.sales['transportation_fee']
        this.transportation_name = this.transportation_fee ? this.equipTransport.filter(a => a.price == this.transportation_fee)[0].name : null

        console.log(this.sales)
      })

    })

  }

  equipName(x) {

    if (x == 'scaff') {
      this.scaffname = this.equipScaffolding.filter(a => a.price == this.scafffee)[0].name
    } else if (x == 'skylift') {
      this.skyliftname = this.equipSkylift.filter(a => a.price == this.skyliftfee)[0].name
    } else if (x == 'transport') {
      this.transportation_name = this.equipTransport.filter(a => a.price == this.transportation_fee)[0].name
    }

  }

  remove(x) {
    Swal.fire({
      text: 'Are you sure to remove this equipment?',
      icon: 'info',
      heightAuto: false,
      showCancelButton: true,
      reverseButtons: true
    }).then(a => {

      if (a['isConfirmed']) {

        if (x == 'scaff') {
          this.scaffheight = null
          this.scafffee = null
          this.scaffname = null
        } else if (x == 'skylift') {
          this.skyliftheight = null
          this.skyliftfee = null
          this.skyliftname = null
        } else if (x == 'transport') {
          this.transportation_fee = null
          this.transportation_name = null
        }

      }

    })

  }

  save() {
    // this.scaffheight = (this.scaffheight * 100 / 100).toFixed(2)
    // this.scafffee = (this.scafffee * 100 / 100).toFixed(2)
    // this.skyliftheight = (this.skyliftheight * 100 / 100).toFixed(2)
    // this.skyliftfee = (this.skyliftfee * 100 / 100).toFixed(2)
    // this.transportation_fee = (this.transportation_fee * 100 / 100).toFixed(2)
    console.log(this.scaffheight, this.scafffee, this.skyliftheight, this.skyliftfee, this.transportation_fee)
    Swal.fire({
      text: 'Are you sure to update the equipment information?',
      icon: 'info',
      heightAuto: false,
      showCancelButton: true,
      reverseButtons: true
    }).then(a => {
      if (a['isConfirmed']) {
        this.http.post('https://api.nanogapp.com/insertScaffAndSkylift', {
          scaffheight: Number(this.scaffheight) || 0,
          scafffee: this.scafffee || 0,
          skyliftheight: Number(this.skyliftheight) || 0,
          skyliftfee: Number(this.skyliftfee) || 0,
          salesid: this.salesid,
          leadid: this.leadid,
          userid: this.userid,
          by: this.username,
          transportation_fee: Number(this.transportation_fee) || 0
        }).subscribe(a => {
          // console.log(a)
          // this.nav.pop()
          Swal.fire({
            title: 'Update Successfully',
            icon: 'success',
            // showConfirmButton : false,
            heightAuto: false,
            timer: 1500
          })
          this.nav.pop()
        })
      }
    })

  }

  back() {
    this.nav.pop()
  }

}
