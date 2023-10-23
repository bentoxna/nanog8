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
  skyliftheight
  skyliftfee
  transportation_fee
  salesid
  leadid
  userid = localStorage.getItem('nanogapp_uid') || ''
  username

  constructor(private route : ActivatedRoute,
    private nav: NavController,
    private http : HttpClient) { }

  ngOnInit() {
    this.route.queryParams.subscribe(a => {
      console.log(a)
      this.salesid = a['salesid']
      this.leadid = a['leadid']

      this.refresher()

    })
  }

  refresher(){
    this.http.post('https://api.nanogapp.com/getScaffAndSkylift', {
      salesid : this.salesid
    }).subscribe(a => {
      console.log(a)
      this.scaffheight = a['data'][0]['scaff_height']
      this.scafffee = a['data'][0]['scaff_fee']
      this.skyliftheight = a['data'][0]['skylift_height']
      this.skyliftfee = a['data'][0]['skylift_fee']
      this.transportation_fee = a['data'][0]['transportation_fee']
    })

    this.http.post('https://api.nanogapp.com/getSalesExec', {uid:this.userid}).subscribe((s) => {
      console.log(s['data'].user_name)
      this.username = s['data'].user_name
    })
  }


  back(){
    this.nav.pop()
  }

  save(){
    this.scaffheight = (this.scaffheight * 100 / 100).toFixed(2)
    this.scafffee = (this.scafffee * 100 / 100).toFixed(2)
    this.skyliftheight = (this.skyliftheight * 100 / 100).toFixed(2)
    this.skyliftfee = (this.skyliftfee * 100 / 100).toFixed(2)
    this.transportation_fee = (this.transportation_fee * 100 / 100).toFixed(2)
    console.log(this.scaffheight, this.scafffee, this.skyliftheight, this.skyliftfee)
    Swal.fire({
      text : 'Are you sure to update the scaffolding and skylift information?',
      icon : 'info',
      heightAuto : false,
      showCancelButton :true,
      reverseButtons : true
    }).then(a => {
      if(a['isConfirmed'])
      {
        this.http.post('https://api.nanogapp.com/insertScaffAndSkylift', {
          scaffheight : this.scaffheight || 0,
          scafffee : this.scafffee || 0,
          skyliftheight : this.skyliftheight || 0,
          skyliftfee : this.skyliftfee || 0,
          salesid : this.salesid,
          leadid : this.leadid,
          userid : this.userid,
          by : this.username,
          transportation_fee : this.transportation_fee || 0
        }).subscribe(a => {
          console.log(a)
          // this.nav.pop()
          Swal.fire({
            title : 'Update Successfully',
            icon : 'success',
            // showConfirmButton : false,
            heightAuto : false,
            timer : 1000
          })
          this.refresher()
        })
      }
    })

  }

}
