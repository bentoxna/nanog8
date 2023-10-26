import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, NavParams, Platform } from '@ionic/angular';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-schedule-calander-edit',
  templateUrl: './schedule-calander-edit.page.html',
  styleUrls: ['./schedule-calander-edit.page.scss'],
})
export class ScheduleCalanderEditPage implements OnInit {

  remark = ''
  wholeremark = {} as any
  selecteddate
  data
  userid
  taskid
  salesid
  scheduleid
  leadid

  tasktime
  taskdate
  keepinview = false

  constructor(private modal: ModalController,
    private navparam: NavParams,
    private http: HttpClient,
    private platform : Platform) { }

  ngOnInit() {

    this.selecteddate = this.navparam.get('selecteddate')
    this.data = this.navparam.get('data')
    this.userid = this.navparam.get('uid')
    this.taskid = this.navparam.get('tid')
    this.salesid = this.navparam.get('sid')
    this.leadid = this.navparam.get('lid')
    this.scheduleid = this.navparam.get('scid')

    this.http.post('https://api.nanogapp.com/getSpecificSchedule', { schedule_id: this.scheduleid }).subscribe(res => {
      // console.log(res)
      this.wholeremark = res['data']
      this.remark = res['data']['remark']
      let scheduletime = res['data']['schedule_date']
      this.keepinview = res['data']['schedule_kiv']
      this.tasktime = new Date(parseInt(scheduletime))
      // console.log(scheduletime)
      let month = ('' + (new Date(parseInt(scheduletime)).getMonth() + 1)).length < 2 ? '0' + (new Date(parseInt(scheduletime)).getMonth() + 1) : '' + (new Date(parseInt(scheduletime)).getMonth() + 1)
      this.taskdate = [new Date(parseInt(scheduletime)).getFullYear(), month, new Date(parseInt(scheduletime)).getDate()].join('-')
      this.tasktime = [this.checklength('' + new Date(parseInt(scheduletime)).getHours()),  this.checklength('' + new Date(parseInt(scheduletime)).getMinutes())].join(':')
      // console.log(this.tasktime)
      // console.log(this.taskdate)
    })
  }


  changekeppinview(){
    this.keepinview = !this.keepinview
  }

  checklength(x){
    // console.log(x)
    if(x.length < 2)
    {
      let temp = '0' + x
      // console.log(temp)
      return  temp
    }
    else
    {
      return x
    }
  }

  getTime(){
    // console.log(this.tasktime)
    // console.log(this.taskdate)
    let temp = new Date(this.taskdate).getTime()
    let temp2 = new Date(temp).setHours(this.tasktime.split(':')[0], this.tasktime.split(':')[1])
    // console.log(temp, temp2)
    this.selecteddate = temp2
  }

  platformType(){
    return this.platform.platforms()
  }

  confirmremark() {
    // console.log(this.selecteddate)
    let now = new Date().getTime()
    if (this.remark == '') {
      Swal.fire({
        title: 'Please input some text',
        icon: 'warning',
        heightAuto: false,
        timer: 1500,
      })
    }
    else {
      Swal.fire({
        text: 'Are you sure to update this remark?',
        heightAuto: false,
        icon: 'info',
        showCancelButton: true,
        reverseButtons: true,
      }).then(res => {
        if (res['isConfirmed'] == true) {
          this.http.post('https://api.nanogapp.com/updateScheduleRemark2', {
            schedule_id: this.scheduleid,
            // status : true, 
            remark: this.remark,
            // team : this.wholeremark.team
            from_date : this.selecteddate,
            leadid : this.leadid,
            aid : this.taskid,
            sid : this.salesid,
            kiv : this.keepinview,
            uid : this.userid
          }).subscribe(a => {
            // console.log(a)
            if (a['success'] == true) {
              if (a['data'] == undefined) {
                Swal.fire({
                  text: 'This schedule has been approved',
                  icon: 'error',
                  heightAuto: false,
                  timer: 1500,
                }).then(a => {

                  this.modal.dismiss('success')
                })
              }
              else {
                if (a['success'] == true) {
                  this.modal.dismiss('success')
                }
              }

            }
          })
        }
      })
      // this.modal.dismiss('success')
    }
  }

  cancel() {
    this.modal.dismiss()
  }

}
