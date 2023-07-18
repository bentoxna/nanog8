import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, NavParams, Platform } from '@ionic/angular';
import Swal from 'sweetalert2';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-schedule-calander-insert',
  templateUrl: './schedule-calander-insert.page.html',
  styleUrls: ['./schedule-calander-insert.page.scss'],
})
export class ScheduleCalanderInsertPage implements OnInit {

  remark = ''
  selecteddate
  data
  userid
  taskid
  salesid
  leadid

  tasktime = '10:00'

  constructor(private modal: ModalController,
    private navparam: NavParams,
    private http: HttpClient,
    private socket : Socket,
    private platform : Platform) { }

  ngOnInit() {

    // this.socket.connect();

    this.selecteddate = this.navparam.get('selecteddate')
    this.userid = this.navparam.get('uid')
    this.taskid = this.navparam.get('tid')
    this.salesid = this.navparam.get('sid')
    this.leadid = this.navparam.get('lid')

    console.log(this.selecteddate, this.userid, this.taskid, this.salesid)

    
  }

  platformType(){
    return this.platform.platforms()
  }

  confirmremark() {
    let now = new Date().getTime()
    if (!this.remark) {
      Swal.fire({
        text: 'Empty Text',
        icon: 'error',
        heightAuto: false,
        timer: 1500,
      })
    }
    else {
      Swal.fire({
        text: 'Are you sure to insert this remark?',
        heightAuto: false,
        icon: 'info',
        showCancelButton: true,
        reverseButtons: true,
      }).then(res => {
        if (res['isConfirmed'] == true) {
          this.http.post('https://api.nanogapp.com/createSchedule2', {
            sales_id: this.salesid,
            schedule_date: this.selecteddate,
            created_date: now,
            remark: this.remark,
            uid: this.userid,
            leadid : this.leadid,
            kiv : this.keepinview,
            aid : this.taskid,
          }).subscribe(a => {
            if (a['success'] == true) {
              this.socket.emit('callSchedule', 'fromClient');
              // this.socket.disconnect()
              this.modal.dismiss('success')
            }
          })
          // this.modal.dismiss('success')
        }
      })
    }
  }

  getTime(){
    console.log(this.tasktime)
    let temp = new Date(this.selecteddate).setHours(parseInt(this.tasktime.split(':')[0]), parseInt(this.tasktime.split(':')[1]))
    console.log(temp)
    this.selecteddate = temp
  }

  keepinview = false
  changekeppinview(){
    this.keepinview = !this.keepinview
  }

  cancel() 
  {
    this.modal.dismiss()
  }

  selectTime(){
    console.log('sdasd')
    document.getElementById('timeslot').click()
  }

}
