import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage implements OnInit {

  userid = localStorage.getItem('nanogapp_uid') || ''

  meetings
  startdate
  enddate
  minstartdate
  maxstartdate
  minenddate
  maxenddate

  buttonstatus = false

  constructor(private nav : NavController,
    private http : HttpClient) { }

  ngOnInit() {
    this.refresher()
  }
  buttons(){
    this.buttonstatus = !this.buttonstatus
  }


  refresher(){
    let starttemp = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0,0,0).getTime()
    let endtemp = (new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23,59,59).getTime()) + (86400000 * 30) 

    this.startdate = [new Date(starttemp).getFullYear(), this.changeformat(new Date(starttemp).getMonth() + 1), this.changeformat(new Date(starttemp).getDate())].join('-')
    this.enddate = [new Date(endtemp).getFullYear(), this.changeformat(new Date(endtemp).getMonth() + 1), this.changeformat(new Date(endtemp).getDate())].join('-')

    this.minenddate = [new Date(starttemp).getFullYear(), this.changeformat(new Date(starttemp).getMonth() + 1), this.changeformat(new Date(starttemp).getDate())].join('-')
    this.maxenddate = [new Date(endtemp).getFullYear(), this.changeformat(new Date(endtemp).getMonth() + 1), this.changeformat(new Date(endtemp).getDate())].join('-')

    console.log(this.startdate)
    console.log(this.enddate)

    this.http.post('https://api.nanogapp.com/getEventByUidDate', { uid: this.userid, startdate : starttemp, enddate : endtemp }).subscribe((s) => {
      console.log(s)
       this.meetings = s['data']
       console.log(this.meetings)
    })
  }

  changeformat(x){
    let temp = x + ''
    temp && temp.length < 2 ? temp = '0' + temp : temp
    return temp
  }

  back(){
    this.nav.pop()
  }

  search(){
    if(!this.startdate){
      Swal.fire({
        text : 'Please choose the start date',
        icon : 'info',
        heightAuto : false,
      })
    }
    else if(!this.enddate){
      Swal.fire({
        text : 'Please choose the end date',
        icon : 'info',
        heightAuto : false,
      })
    }
    else if(this.startdate > this.enddate)
    {
      Swal.fire({
        text : 'The start date cannot higher than end date',
        icon : 'info',
        heightAuto : false,
      })
    }
    else
    {
      this.http.post('https://api.nanogapp.com/getEventByUidDate', { 
        uid: this.userid,
        startdate : new Date(new Date(this.startdate).getFullYear(), new Date(this.startdate).getMonth(), new Date(this.startdate).getDate(), 0,0,0).getTime(),
        enddate : new Date(new Date(this.enddate).getFullYear(), new Date(this.enddate).getMonth(), new Date(this.enddate).getDate(), 23,59,59).getTime(),
      }).subscribe((s) => {
        Swal.fire({
          title: 'Complete',
          icon : 'success',
          heightAuto: false,
          showConfirmButton: false,
          timer: 1000,
        })
         this.meetings = s['data']
         console.log(this.meetings)
      })
    }
  }

  control(){
      this.enddate = undefined
      console.log(this.enddate)
      let temp = (new Date(new Date(this.startdate).getFullYear(), new Date(this.startdate).getMonth(), new Date(this.startdate).getDate(), 23,59,59).getTime()) + (86400000 * 30)
      this.minenddate = [new Date(this.startdate).getFullYear(), this.changeformat(new Date(this.startdate).getMonth() + 1), this.changeformat(new Date(this.startdate).getDate())].join('-')
      this.maxenddate = [new Date(temp).getFullYear(), this.changeformat(new Date(temp).getMonth() + 1), this.changeformat(new Date(temp).getDate())].join('-')
      console.log(this.enddate)
  }
}
