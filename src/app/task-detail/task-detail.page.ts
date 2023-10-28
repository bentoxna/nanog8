import { Component, OnInit, Directive, Input, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, ModalController, NavController, Platform } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ServicesAddPage } from '../services-add/services-add.page';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';
import Swal from 'sweetalert2';
import { ServicesEditPage } from '../services-edit/services-edit.page';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
// import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
import * as EXIF from 'exif-js';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
// import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { fakeAsync } from '@angular/core/testing';
import { TaskDiscountPage } from '../task-discount/task-discount.page';
import { Icon } from 'ionicons/dist/types/components/icon/icon';
import { AnonymousSubject } from 'rxjs/internal/Subject';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
declare let cordova: any;

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.page.html',
  styleUrls: ['./task-detail.page.scss'],
})
export class TaskDetailPage implements OnInit {

  userid = localStorage.getItem('nanogapp_uid') || ''

  customer = [] as any
  user = {} as any

  taskid
  salesid

  appointment = {} as any
  sales_packages = [] as any
  sales_packages_main = [] as any
  sales_packages_addon = [] as any

  subtask = [] as any

  filtercustomer = {} as any
  permission = 1
  open

  payment_date

  today = this.changeformat(new Date())

  quotations = {} as any
  service

  minheightforfooter = (this.heighter() / 100 * 7) + 'px'
  marginbottomforcontent = (this.heighter() / 100 * 8) + 'px'

  packages = [] as any


  rate
  total
  subtotal
  subtotalstring

  deductprice
  discount2photo = false

  sales_status
  status

  discountselected = [] as any
  discounts
  totaldiscount = 0
  totaldiscountdisplay
  discountselected2 = [] as any
  totaldiscountphoto = [] as any
  discountimageurl = [] as any
  localstoragediscount = [] as any
  discountstatus

  heightforphoto = (this.widther() / 100 * 90) / 3 + 'px'

  promocode
  promocodedetail = {} as any
  promocodeverifystatus
  promocodeexpire
  promocodeinput = true
  promocodechecking = false
  promocodeapplied = false
  promocodereset = false

  pdffileurl = [] as any
  pdffilename = [] as any

  dpercentage: number = 0
  dnumber: number = 0

  discountPhoto
  discountPhotoStatus = false

  dropdownPreviousServicesStatus = false

  approvedPayment = 0
  pendingPayment = 0
  scafffee
  skyliftfee
  scaffnSkylift
 
  buttonstatus = false

  constructor(private route: ActivatedRoute,
    private nav: NavController,
    private http: HttpClient,
    private modal: ModalController,
    private platform: Platform,
    private geolocation: Geolocation,
    private diagnostic: Diagnostic,
    private actionSheetController: ActionSheetController,
    private camera: Camera,
    private actRoute : ActivatedRoute,
    // private photoViewer: PhotoViewer,
    // private fileOpener: FileOpener,
    private file: File) { }

  public customOptions: any = {
    header: "Select discount",
  };

  ngOnInit() {
    // this.actRoute.queryParams.subscribe((c) => {
      this.refresher()
    // })
  }

  refresher() {
    // console.log(this.platformType())s
    this.platformType()
    this.route.queryParams.subscribe(a => {
      this.filtercustomer = this.customer ? this.customer.filter(x => (x['tid'].toLowerCase()).includes(a['tid'].toLowerCase())) : []
      this.taskid = a.tid

      // console.log(this.taskid)
      this.http.post('https://api.nanogapp.com/getUserDetail', { uid: this.userid }).subscribe(res => {
        this.user = res['data']
      })

      this.http.get('https://api.nanogapp.com/getActiveDiscount').subscribe(a => {
        this.discounts = a['data']

        this.http.post('https://api.nanogapp.com/getAppointmentDetails', { id: this.taskid }).subscribe((s) => {
          console.log(s['data'])
          this.appointment = s['data']
          this.salesid = s['data']['sales_id']
          this.sales_status = s['data']['sales_status']
          this.promocodedetail.name = s['data']['promo_name']
          this.promocodedetail.id = s['data']['promo_id']
          this.promocodedetail.percentage = s['data']['promo_percent']
          this.scafffee = s['data']['scaff_fee'] || 0
          this.skyliftfee = s['data']['skylift_fee'] || 0
          this.scaffnSkylift = this.scafffee + this.skyliftfee
          this.pdffileurl = s['data']['gen_quotation']
          this.sales_packages = s['data']['sales_packages']
          this.sales_packages_main = s['data']['sales_packages'] ? s['data']['sales_packages'].filter(a => !a['addon_id']) : []
          this.sales_packages_addon = s['data']['sales_packages'] ? s['data']['sales_packages'].filter(a => a['addon_id']) : []
          for(let i = 0; i < this.sales_packages_main.length ; i++)
          {
            let temp = this.sales_packages_main[i].sap_id
            let temparr = [] as any
            this.sales_packages_main[i].sum_total = this.sales_packages.filter(a => a['addon_id'] == temp || a['sap_id'] == temp).map(b => b['total']).reduce((c, d) => c + d, 0)
            this.sales_packages_main[i].sum_total_after = this.sales_packages.filter(a => a['addon_id'] == temp || a['sap_id'] == temp).map(b => b['total_after'] ? b['total_after'] : b['total']).reduce((c,d) => c + d, 0)
            temparr.push(this.sales_packages_addon.filter(a => a['addon_id'] == temp))
            this.sales_packages_main[i].addon_packages = temparr[0]
          }
          // console.log(this.sales_packages_main)
          
          // this.service = s['data']['sales_packages']

          // if (!this.appointment.checkin_latt || !this.appointment.checkin_long|| !this.appointment.checkin_time || !this.appointment.checkin_img) {
          //   this.appointment.checkin_status = 'havent'
          // }
          // else {
          //   this.appointment.checkin_status = 'checked'
          // }

          this.http.post('https://api.nanogapp.com/getAllMainAndAddOnPackagesJoinDiscount', { sales_id: this.salesid }).subscribe((s) => {

          // console.log(s)
          })

          // getAllMainAndAddOnPackagesJoinDiscount

          this.http.post('https://api.nanogapp.com/checkPaymentLog', { sales_id: this.appointment.sales_id }).subscribe(res => {
            this.approvedPayment = 0
            this.pendingPayment = 0
            // console.log(res)s
            let temp = 0
            res['data'].filter(a => (a['ac_approval'] == 'Approved' && a['sc_approval'] == 'Approved') ?  this.approvedPayment += a['total'] : this.approvedPayment = this.approvedPayment)
            // temp = res['data'].map(a => a['total']).reduce((a,b) => a+b, 0)
            res['data'].filter(a => (a['ac_approval'] == 'Rejected' || a['sc_approval'] == 'Rejected') ? temp = temp : temp += a['total'] )
            this.pendingPayment = temp - this.approvedPayment
            // console.log(this.approvedPayment, this.pendingPayment, temp)

            if (this.promocodedetail.id) {
              this.promocodeinput = false
              this.promocode = this.promocodedetail.name
              this.promocodeapplied = true
              this.promocodechecking = false
              this.promocodeinput = false
              this.dpercentage = this.promocodedetail.percentage
              this.gettotal2()
            }
            else {
              this.http.post('https://api.nanogapp.com/getAllSalesDiscount', { sales_id: this.salesid }).subscribe(a => {
                // console.log(a)
                this.discountPhoto = a['data'].filter(b => b['type'] == true && b['need_photo'] == true && b['photo'].length < 1)
                this.discountPhoto.length > 0 ? this.discountPhotoStatus = true : this.discountPhotoStatus = false
                this.dpercentage = 0
                this.dnumber = 0
                a['data'].filter(b => b['type'] == true ? ((b['status'] == true || b['status'] == null) ? this.dpercentage += b['percentage'] : this.dpercentage = this.dpercentage) : this.dnumber += b['percentage'])
                this.gettotal()
              })
            }
          })
        })
      })
      this.gpsopen()
      this.gpsPermission()
      this.gpsstatuschecker()
    })
  }


  gettotal() {
    // console.log(this.scaffnSkylift)
    this.total = 0
    this.subtotal = 0
    this.deductprice = 0
    if (this.sales_packages_main) {
      this.sales_packages_main.forEach(a => {
        this.subtotal += a['sum_total_after']
        this.deductprice = this.subtotal * this.dpercentage / 100
      });

      // this.deductprice = this.subtotal * this.dpercentage / 100
    }

    if (this.appointment.sales_packages && this.appointment.sales_packages.length > 0 && this.dpercentage == 0 && this.dnumber == 0) {

      this.total = this.subtotal - this.approvedPayment - this.pendingPayment  + this.scaffnSkylift
    }
    else if (this.appointment.sales_packages && this.appointment.sales_packages.length > 0 && ((this.dpercentage != 0 || this.dnumber != 0) || (this.dpercentage != 0 && this.dnumber != 0))) {
      this.total = this.subtotal - this.deductprice - this.dnumber - this.approvedPayment - this.pendingPayment  + this.scaffnSkylift
    }

    this.deductprice = (this.deductprice / 100 * 100).toFixed(2)
    this.total = (this.total / 100 * 100).toFixed(2)
    this.subtotalstring = (this.subtotal / 100 * 100).toFixed(2)
    this.totaldiscountdisplay = (this.dpercentage / 100 * 100).toFixed(2)
  }

  gettotal2() {
    // console.log(this.scaffnSkylift)
    this.total = 0
    this.subtotal = 0
    this.deductprice = 0
    this.appointment.sales_packages.forEach(a => {
      this.subtotal += (a['total_after'] ? a['total_after'] : a['total'])
      this.deductprice = this.subtotal * this.dpercentage / 100
    });
    // this.deductprice = this.appointment.sub_total * this.dpercentage / 100

    this.total = this.subtotal - this.deductprice - this.approvedPayment - this.pendingPayment + this.scaffnSkylift
    this.deductprice = (this.deductprice / 100 * 100).toFixed(2)
    this.total = (this.total / 100 * 100).toFixed(2)
    this.subtotalstring = (this.subtotal / 100 * 100).toFixed(2)
  }


  gpsstatuschecker() {
    this.platform.ready().then(() => {
      this.diagnostic.registerLocationStateChangeHandler((a) => {
        if (a != 'location_off') {
          this.open = 0
        } else {
          Swal.fire({
            text: 'Please switch on GPS',
            heightAuto: false,
          })
          this.open = 1
          this.gpsstatuschecker()
        }
      })
    })
  }

  gpsPermission() {
    this.platform.ready().then(() => {
      this.diagnostic.requestLocationAuthorization().then((res) => {
        if (res == 'authorized_when_in_use') {
          this.permission = 0
        }
        else if (res == 'DENIED_ONCE') {
          this.permission = 1
        }
        else if (res == 'DENIED_ALWAYS') {
          this.permission = 2
        }
      })
    })
  }

  gpsopen() {
    this.platform.ready().then(() => {
      this.diagnostic.isLocationEnabled().then((res) => {
        if (res == true) {
          this.open = 0
        }
        else if (res == false) {
          this.open = 1
        }
      })
    })
  }

  back() {
    localStorage.removeItem('discount?uid=' + this.userid + '&tid=' + this.taskid);
    this.nav.pop()
  }

  // checkin(x){
  //   this.nav.navigateForward('check-in?uid=' + this.userid + '&tid=' + this.taskid + '&lid=' + this.appointment.lead_id + '&checkin_status=' + x + '&time=' + this.appointment.appointment_time)
  // }
  checkin(x) {
    if (this.permission == 0) {
      // console.log(this.open)
      if (this.open == 0) {
        // console.log(this.permission, this.open)
        this.nav.navigateForward('check-in?uid=' + this.userid + '&tid=' + this.taskid + '&lid=' + this.appointment.lead_id + '&checkin_status=' + x + '&time=' + this.appointment.appointment_time)
      }
      else if (this.open == 1) {
        Swal.fire({
          text: 'Please switch on your gps',
          heightAuto: false,
          timer: 2000
        }
        )
        this.gpsopen()
      }
    }
    else if (this.permission == 1) {
      this.gpsPermission()
    }
    else if (this.permission == 2) {
      Swal.fire({
        title: 'Lost Permission',
        text: 'Please go to setting and allow location permission',
        heightAuto: false,
        timer: 2000
      })
    }
  }

  // checkin(){
  //   this.nav.navigateForward('check-in?uid=' + this.userid + '&tid=' + this.taskid + '&lid=' + this.appointment.lead_id)
  // }

  async addtask() {
    // if (this.sales_status != 'Quotation' && this.sales_status != null) {

    // }
    // (!appointment.checkin_latt || !appointment.checkin_long|| !appointment.checkin_time || !appointment.checkin_img) && !appointment.check_detail
    // else 
    
    if ((!this.appointment.checkin_latt || !this.appointment.checkin_long|| !this.appointment.checkin_time || !this.appointment.checkin_img) 
    && !this.appointment.check_detail && !this.appointment.bypass) {
      Swal.fire({
        icon: 'info',
        title: 'Please check in first',
        heightAuto: false,
        timer: 2000
      })
    }
    else {
      // console.log('add')
      this.nav.navigateForward('services-add?uid=' + this.userid + '&tid=' + this.taskid + '&sid=' + this.salesid + '&lid=' + this.appointment.lead_id )

      // const modal = await this.modal.create({
      //   component: ServicesAddPage,
      //   componentProps: { tid: this.taskid, uid: this.userid, sid: this.salesid }
      // })

      // await modal.present()

      // modal.onDidDismiss().then(a => {
      //   if (a['data'] == 'success') {
      //     this.refresher()
      //   }
      // })
    }
  }

  viewcheckinhistory() {
    this.nav.navigateForward('check-in-history?uid=' + this.userid + '&tid=' + this.taskid)
  }

  heighter() {
    return this.platform.height()
  }

  async editService(service) {
    if (this.sales_status != 'Quotation' && this.sales_status != null) {

    }
    else {
      this.nav.navigateForward('services-edit?uid=' + this.userid + '&tid=' + this.taskid + '&sid=' + this.salesid + '&sap=' + service['sap_id'] + '&lid=' + this.appointment.lead_id + '&servicetype=' + 'normal')
      // const modal = await this.modal.create({
      //   cssClass: 'servicemodal',
      //   component: ServicesEditPage,
      //   componentProps: { tid: this.taskid, uid: this.userid, sid: this.salesid, sap: service['sap_id'] }
      // })

      // await modal.present()


      // modal.onDidDismiss().then(a => {
      //   if (a['data'] == 'success') {
      //     this.refresher()
      //   }
      // })
    }
  }

  goServiceList(service){
    // if (this.sales_status != 'Quotation' && this.sales_status != null) {

    // }
    // else {
    this.nav.navigateForward('service-addon-list?tid=' + this.taskid + '&sid=' + this.salesid + '&sap=' + service['sap_id'] + '&lid=' + this.appointment.lead_id + '&servicetype=' + 'normal')
    // }
  }

  async showdiscount2() {
    if (this.sales_status != 'Quotation' && this.sales_status != null) {

    }
    else {

      if (this.promocodeapplied == true) {
        Swal.fire({
          title: 'Only can exist one promotion',
          text: 'Please remove promo code to continue',
          icon: 'info',
          heightAuto: false,
          timer: 2000
        })
      }
      else {
        this.promocodereset = false
        // console.log(this.discountstatus)
        if (this.discountstatus == 'fromdatabase') {
          localStorage.setItem('discount?tid=' + this.taskid, JSON.stringify(this.discountselected))
          const modal = await this.modal.create({
            cssClass: 'discountpage',
            component: TaskDiscountPage,
            componentProps: { uid: this.userid, tid: this.taskid }
          })
          modal.onDidDismiss().then(a => {
            // console.log(a)
            if (a['data'] == 'confirm') {
              this.getDiscount('fromlocal').then(res => {
                // console.log(res)
                this.gettotal()
              })
            }
            else if (a['data'] == undefined && this.discountstatus == 'fromlocal') {
              this.getDiscount('fromlocal').then(res => {
                // console.log(res)
                this.gettotal()
              })
            }
            else if (a['data'] == undefined && this.discountstatus == 'fromdatabase') {
              this.getDiscount('fromdatabase').then(res => {
                // console.log(res)
                this.gettotal()
              })
            }
          })
          await modal.present()
        }
        else if (this.discountstatus == 'fromlocal') {
          const modal = await this.modal.create({
            cssClass: 'discountpage',
            component: TaskDiscountPage,
            componentProps: { uid: this.userid, tid: this.taskid }
          })

          modal.onDidDismiss().then(a => {
            if (a['data'] == 'confirm') {
              this.getDiscount('fromlocal').then(res => {
                // console.log(res)
                this.gettotal()
              })
            }
            else if (a['data'] == undefined && this.discountstatus == 'fromlocal') {
              this.getDiscount('fromlocal').then(res => {
                // console.log(res)
                this.gettotal()
              })
            }
            else if (a['data'] == undefined && this.discountstatus == 'fromdatabase') {
              this.getDiscount('fromdatabase').then(res => {
                // console.log(res)
                this.gettotal()
              })
            }
          })

          await modal.present()
        }
      }

    }
  }

  async showdiscount3() {
    if (this.sales_status != 'Quotation' && this.sales_status != null) {

    }
    else {

      if (this.promocodeapplied == true) {
        Swal.fire({
          title: 'Only can exist one promotion',
          text: 'Please remove promo code to continue',
          icon: 'info',
          heightAuto: false,
          timer: 2000
        })
      }
      else {
        this.promocodereset = false
        this.nav.navigateForward('task-discount2?uid=' + this.userid + '&tid=' + this.taskid + '&sid=' + this.salesid)
      }
    }
  }

  async showdiscount4() {
    if (this.sales_status != 'Quotation' && this.sales_status != null) {

    }
    else {

      if (this.promocodeapplied == true) {
        Swal.fire({
          title: 'Only can exist one promotion',
          text: 'Please remove promo code to continue',
          icon: 'info',
          heightAuto: false,
          timer: 2000
        })
      }
      else {
        this.promocodereset = false
        this.nav.navigateForward('task-discount-list?tid=' + this.taskid + '&sid=' + this.salesid)
      }
    }
  }

  async getDiscount(x) {
    this.discountstatus = x
    this.totaldiscount = 0
    this.totaldiscountphoto = []
    this.discountselected = []
    this.discountselected2 = []

    // console.log(this.appointment.discount_applied)
    return new Promise((resolve, reject) => {
      this.localstoragediscount = JSON.parse(localStorage.getItem('discount?tid=' + this.taskid))

      if (x == 'fromdatabase' || x == 'fromlocal') {
        this.filterdiscount(x).then(a => {
          this.filterdiscountphoto()
        })

      }
      resolve('done')
    })


  }

  async filterdiscount(x) {
    return new Promise((resolve, reject) => {
      if (x == 'fromlocal') {
        this.discountselected = this.discountselected = JSON.parse(localStorage.getItem('discount?tid=' + this.taskid))
        // console.log(this.discountselected)
      }
      else if (x == 'fromdatabase') {
        if (this.appointment.discount_applied != null && this.appointment.discount_applied != undefined && this.discounts) {
          for (let i = 0; i < this.appointment.discount_applied.length; i++) {
            let finddiscount = this.discounts.findIndex(a => a['id'] == this.appointment.discount_applied[i])
            if (finddiscount != -1) {
              this.discountselected.push(this.discounts[finddiscount])
            }
          }
        }
        // console.log(this.discountselected)
        // console.log('run here for fromdatabase')
      }
      resolve('done')
    })
  }

  async filterdiscountphoto() {
    return new Promise((resolve, reject) => {
      let findIndex = [] as any
      if (this.discountselected) {
        for (let i = 0; i < this.discountselected.length; i++) {
          let index = this.discounts.findIndex(a => a['id'] == this.discountselected[i]['id'])
          if (index != -1) {
            findIndex.push(index)
          }
          // console.log(findIndex)
        }

        if (findIndex) {
          for (let i = 0; i < findIndex.length; i++) {
            this.totaldiscount = this.totaldiscount + this.discounts[findIndex[i]].percentage
            this.discountselected2.push(this.discounts[findIndex[i]])
            if (this.discounts[findIndex[i]].need_photo == true) {
              this.totaldiscountphoto.push(this.discounts[findIndex[i]])
            }
          }
        }
      }
      resolve('done')
    })
  }

  deleteservice(x) {
    if (this.sales_status != 'Quotation' && this.sales_status != null) {

    }
    else {
      // console.log(x)
      let sap_id = x.sap_id
      Swal.fire(
        {
          title: 'Are you sure want to delete this service?',
          heightAuto: false,
          showCancelButton: true,
          reverseButtons: true,
        }
      ).then(a => {
        if (a['isConfirmed'] == true) {
          Swal.fire(
            {
              icon: 'info',
              title: 'Deleting',
              showConfirmButton: false,
              heightAuto: false,
            }
          )

          // this.appointment.sales_packages.splice(i, 1)
          // if (this.appointment.sales_packages.length < 1) {
          //   this.appointment.sales_packages = null
          // }
          this.http.post('https://api.nanogapp.com/deleteSalesPackage', { 
            sap_id: sap_id,
            leadid : this.appointment.lead_id,
            aid : this.taskid,
            uid : this.userid,
            servicetype : 'normal' 
          }).subscribe(res => {
            // console.log(res)
            // this.appointment.sales_packages.forEach(a => {
            //     this.subtotal += a['total']
            //     this.deductprice = this.subtotal * this.dpercentage / 100
            //   });
            // this.gettotal()
            this.refresher()
            setTimeout(() => {
              Swal.fire(
                {
                  icon: 'success',
                  title: 'Deleted successfully',
                  heightAuto: false,
                  timer: 1500
                }
              )
            }, 500);
          })
        }
      })
    }
  }

  changeformat(dates) {
    let year = dates.getFullYear()
    let month = '' + (dates.getMonth() + 1)
    let date = '' + dates.getDate()

    if (month.length < 2) {
      month = '0' + month
    }
    if (date.length < 2) {
      date = '0' + date
    }

    let newdate = [year, month, date].join('-')
    // console.log(newdate)
    return newdate
  }

  tableBody(data, columns) {
    var body = [] as any;

    body.push(columns);

    for (let i = 0; i < data.length; i++) {
      var dataRow = [] as any;

      // console.log(data);

      for (let j = 0; j < columns.length; j++) {
        // console.log(data[i][columns[j]]);
        // console.log(columns[j]);
        // console.log(columns[j]["text"]);
        // console.log(data[i][columns[j]["text"]]);

        if (columns[j]["text"] == "place") {
          dataRow.push({ text: data[i][columns[j]["text"]].toString(), style: "tableData" });
        } else if (columns[j]["text"] == "name") {
          dataRow.push({ text: data[i][columns[j]["text"]].toString(), style: "tableData" });
        }
        else if (columns[j]["text"] == "service") {
          dataRow.push({ text: data[i][columns[j]["text"]].toString(), style: "tableData" });
        }
        else if (columns[j]["text"] == "width") {
          dataRow.push({ text: (Math.round(data[i][columns[j]["text"]] * 100) / 100).toFixed(2).toString() + ' (ft)', style: "tableData" });
        }
        else if (columns[j]["text"] == "height") {
          dataRow.push({ text: (Math.round(data[i][columns[j]["text"]] * 100) / 100).toFixed(2).toString() + ' (ft)', style: "tableData" });
        }
        else if (columns[j]["text"] == "amount") {
          dataRow.push({ text: "RM " + (Math.round(data[i][columns[j]["text"]] * 100) / 100).toFixed(2).toString(), style: "tableData" });
        }
        else {
          // console.log(data[i][columns[j]["text"]]);
          dataRow.push({ text: data[i][columns[j]["text"]].toString(), style: "tableData" });
        }

      }

      // console.log(dataRow);

      body.push(dataRow);
      // console.log(body)
    }
    //Change Table's header
    columns[0].text = "Place"
    columns[1].text = "Package"
    columns[2].text = "Service"
    columns[3].text = "Width"
    columns[4].text = "Height"
    columns[5].text = "Price"

    // console.log(body)
    return body
  }

  table(data, columns) {
    return {
      table: {
        layout: 'lightHorizontalLines', // optional
        headerRows: 1,
        widths: ['17%', '22%', '18%', '14%', '14%', '15%'],
        body: this.tableBody(data, columns)
      }
    };
  }

  getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");

      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL("image/png");

        resolve(dataURL);
      };

      img.onerror = error => {
        reject(error);
      };

      img.src = url;
    });
  }

  async openpdf() {
    var docDefinition = {
      content: [
        {
          columns: [
            { alignment: 'right', text: 'Quotation', fontSize: 20, margin: [0, 0, 0, 10] }
          ]
        },
        {
          columns: [
            [
              { text: 'Address : ', fontSize: 11, width: '45%', margin: [0, 0, 0, 2], bold: true, color: '#000000', alignment: 'left' },
              { text: 'D-1-11, Block D, Oasis Square Jalan PJU 1A/7, Oasis Damansara, Ara Damansara, 47301 Petaling Jaya, Selangor', fontSize: 10, width: '45%', color: '#444444', alignment: 'left' },
              {
                columns: [
                  { text: 'Tel : ', fontSize: 11, width: 'auto', margin: [0, 8, 2, 2], bold: true, color: '#000000', alignment: 'left' },
                  { text: '1-800-18-6266', fontSize: 11, width: '45%', margin: [0, 8, 0, 1], color: '#444444', alignment: 'left' }
                ]
              }
            ],
            [
              { text: '', width: '10%' }
            ],
            [
              {
                image: await this.getBase64ImageFromURL(
                  "assets/icon/nano-g-nb.png"
                ),
                // image: "../..////assets/icon/nano-g-nb.png",
                width: 150,
                alignment: 'right',
              },
            ]
          ],
          width: '100%',
        },
        {
          columns: [
            [
              { text: 'From : ', fontSize: 11, width: '45%', bold: true, margin: [0, 0, 0, 2], alignment: 'left', },
              { text: this.user.user_name + '(' + this.user.user_role + ')', fontSize: 10, width: '45%', color: '#444444', alignment: 'left', margin: [1, 0.5, 1, 0.5] },
              { text: this.user.user_phone_no, fontSize: 10, width: '45%', color: '#444444', alignment: 'left', margin: [1, 0.5, 1, 0.5] },
              { text: this.user.user_email, fontSize: 10, width: '45%', color: '#444444', alignment: 'left', margin: [1, 0.5, 1, 0.5] },
              { text: 'To : ', fontSize: 11, width: '45%', bold: true, margin: [0, 12, 0, 2], alignment: 'left', },
              { text: this.appointment.customer_name, fontSize: 10, width: '45%', color: '#444444', alignment: 'left', margin: [1, 0.5, 1, 0.5] },
              { text: this.appointment.customer_phone, fontSize: 10, width: '45%', color: '#444444', alignment: 'left', margin: [1, 0.5, 1, 0.5] },
              { text: this.appointment.address, fontSize: 10, width: '45%', color: '#444444', alignment: 'left', margin: [1, 0.5, 1, 0.5] },
              { text: this.appointment.customer_email, fontSize: 10, width: '45%', color: '#444444', alignment: 'left', margin: [1, 0.5, 1, 0.5] },
            ],
            [
              {

              }
            ],
            [
              {
                columns: [
                  { text: 'Date :', bold: true, fontSize: 10, width: '50%', color: '#000000', alignment: 'right', },
                  { text: this.today, bold: true, fontSize: 10, width: '50%', color: '#444444', alignment: 'right', },
                ],
              },
              {
                columns: [
                  { text: 'QUOTE NO :', fontSize: 10, width: '50%', color: '#000000', alignment: 'right', margin: [0, 2, 0, 0] },
                  { text: this.quotations.id, fontSize: 10, width: '50%', color: '#444444', alignment: 'right', margin: [0, 2, 0, 0] }
                ],
                width: '25%',
                alignment: 'right'
              },
            ]
          ],
          width: '100%',
          margin: [0, 40, 0, 50],
        },
        this.table(this.service, [{ text: 'place', style: "tableHeader" }, { text: 'name', style: "tableHeader" }, { text: 'service', style: "tableHeader" },
        { text: 'width', style: "tableHeader" }, { text: 'height', style: "tableHeader" }, { text: 'amount', style: "tableHeader" }]),
        {
          columns: [
            { text: '' },
            { text: 'Subtotal : ', alignment: 'left', width: '14%', margin: [1, 20, 0, 0], fontSize: 9, color: '#444444' },
            { text: 'RM ' + this.subtotalstring, alignment: 'right', width: '15%', margin: [0, 20, 1, 0], fontSize: 9, color: '#444444' },
          ]
        },
        {
          columns: [
            {},
            { text: 'Discount : ', alignment: 'left', width: '14%', margin: [1, 5, 0, 0], fontSize: 9, color: '#444444' },
            { text: '- RM ' + this.deductprice, alignment: 'right', width: '15%', margin: [0, 5, 1, 0], fontSize: 9, color: '#444444' },
          ]
        },
        {
          columns: [
            {},
            { text: 'Total : ', alignment: 'left', width: '14%', margin: [1, 8, 0, 0], fontSize: 11 },
            { text: 'RM ' + this.total, alignment: 'right', width: '15%', margin: [0, 8, 1, 0], fontSize: 11 },
          ],
        },
        {
          columns: [
            { text: 'Signature by : ', width: 'auto', alignment: 'left', margin: [2, 2, 2, 2], fontSize: 11 },
          ],
          margin: [0, 60, 0, 0]
        },
        {
          columns: [
            { text: 'Date : ', alignment: 'left', width: 'auto', margin: [2, 2, 2, 2], fontSize: 11 },
            { text: this.today, alignment: 'left', margin: [2, 2, 2, 2], color: '#444444', fontSize: 11 },
          ],
          width: '100%'
        }
      ],
      styles: {
        tableData: {
          alignment: "center",
          fontSize: 9,
          margin: [2, 2, 2, 2],
          color: '#5c5b5b'
        },
        tableHeader: {
          fontSize: 11,
          alignment: "center",
        }
      }
    };

    this.uploadpdf(docDefinition).then(() => {
      let globalVariable = this

      pdfMake.createPdf(docDefinition).getBuffer((buffer) => {
        var utf8 = new Uint8Array(buffer); // Convert to UTF-8...
        let binaryArray = utf8.buffer; // Convert to Binary...

        let fileName = 'sadasd' + ' - Payslip.pdf';
        let saveDir = cordova.file.dataDirectory;

        this.file.createFile(saveDir, fileName, true).then((fileEntry) => {
          fileEntry.createWriter((fileWriter) => {
            fileWriter.onwriteend = async () => {

              Swal.fire({
                title: 'Generating PDF',
                text: "Please Wait! Generating the PDF...",
                icon: 'info',
                timer: 2000,
                heightAuto: false,
                showCancelButton: false,
                showConfirmButton: false
              }).then(function (result) {

                // console.log(result.dismiss);

                if (result.dismiss === Swal.DismissReason.timer) {
                  // globalVariable.fileOpener.open(
                  //   saveDir + fileName,
                  //   'application/pdf');
                }

              });
            };
            fileWriter.onerror = (e) => {
              // console.log('file writer - error event fired: ' + e.toString());
            };
            fileWriter.write(binaryArray);
            // console.log(binaryArray)
          });
        });
      });
    })




  }

  uploadpdf(x) {
    return new Promise((resolve, reject) => {
      pdfMake.createPdf(x).getDataUrl((dataUrl) => {
        // console.log(dataUrl);
        this.http.post('https://api.nanogapp.com/uploadFilePDF', { base64: dataUrl }).subscribe((link) => {
          Swal.close()
          // console.log(link['imageURL'].split('/'))
          this.pdffileurl.push(link['imageURL'])
          this.pdffilename.push(link['imageURL'].split('/')[4])
          // console.log(link['imageURL']);
          // console.log(this.pdffilename)
          // console.log(this.pdffileurl)
          this.http.post('https://api.nanogapp.com/uploadGenQuotation', {
            sales_id: this.salesid,
            quotation: JSON.stringify(this.pdffileurl) || [],
          }).subscribe((res) => {
            if (res['success'] == true) {
              resolve('done')
            }
          })

        }, awe => {
          // console.log(awe);
          resolve('done')
        })
      });
    })

  }

  // quoteorpdf() {
  //   if(this.sales_status == 'quotation' || this.sales_status == '' || this.sales_status == null)
  //   {
  //     this.quotation()
  //   }
  //   else{
  //     this.openpdf()
  //   }
  // }

  // discount_1
  // discount_2

  quotation2() {
    this.nav.navigateForward('pdf-quotation?uid=' + this.userid + '&tid=' + this.taskid + '&sid=' + this.salesid)
  }


  quotation() {
    // console.log(this.appointment.sales_packages)
    // if (this.discountselected2 == undefined) {
    //   Swal.fire(
    //     {
    //       icon: 'info',
    //       title: 'Please wait a second, processing discount....',
    //       heightAuto: false,
    //       timer: 1500,
    //     }
    //   )
    // }
    // else 
    if (this.appointment.sales_packages == null) {
      Swal.fire(
        {
          icon: 'info',
          title: 'Please check in first',
          heightAuto: false,
          timer: 1500,
        }
      )
    }
    else if (this.appointment.sales_packages.length < 1) {
      Swal.fire(
        {
          icon: 'warning',
          title: 'No service be added',
          text: 'Please add at least one service',
          heightAuto: false,
          timer: 1560
        }
      )
    }
    else if (this.appointment.sales_packages.length > 0) {
      Swal.fire(
        {
          text: 'Are you sure to create quotation for this appointment?',
          heightAuto: false,
          showCancelButton: true,
          reverseButtons: true,
          icon: 'info',
        }
      ).then(a => {
        if (a['isConfirmed'] == true) {
          Swal.fire(
            {
              icon: 'info',
              title: 'Processing...',
              heightAuto: false,
              showConfirmButton: false,
            }
          )
          // console.log(
          //   {
          //     sales_id: this.appointment.sales_id,
          //     sales_status: 'quotation',
          //     payment_status: 'Incomplete',
          //     payment_date: '',
          //     total: this.total
          //   }
          // )
          let status

          if (this.sales_status == 'Quotation' || this.sales_status == '' || this.sales_status == null) {
            status = 'Quotation'
          }
          else {
            status = this.sales_status
          }

          let tempimage = []
          for (let i = 0; i < this.totaldiscountphoto.length; i++) {
            tempimage.push(this.discountimageurl[i])
          }

          // console.log(this.discountselected2)

          this.http.post('https://api.nanogapp.com/updateSalesQuotation', {
            sales_id: this.appointment.sales_id,
            sales_status: status,
            total: this.total,
            // promo_code : this.promocodedetail != null ? this.promocodedetail.id : null,
            // discount_applied: this.discountselected2.length > 0 ? JSON.stringify(this.discountselected2.map(a => a['id'])) : JSON.stringify([]),
            // discount_image: JSON.stringify(tempimage) || []
          }).subscribe(res => {
            if (res['success'] == true) {
              // Swal.fire(
              //   {
              //     icon: 'success',
              //     title: 'Save sucessfully',
              //     heightAuto: false,
              //     timer: 1500
              //   }
              // )
              // .then(() => {
              //this.nav.navigateForward('quotation-pdf?uid=' + this.userid + '&tid=' + this.taskid)
              //direct create pdf to view and download
              Swal.close()
              this.nav.navigateForward('pdf-quotation?uid=' + this.userid + '&tid=' + this.taskid + '&sid=' + this.salesid)
              // this.openpdf()
              // }
              // )

            }
          })
        }
      })
    }

  }

  uploadserve(image) {
    return new Promise((resolve, reject) => {
      Swal.fire({
        title: 'processing...',
        icon: 'info',
        heightAuto: false,
        allowOutsideClick: false,
        showConfirmButton: false,
      })
      if (image) {
        let imgggg = image.replace(';base64,', "thisisathingtoreplace;")
        let imgarr = imgggg.split("thisisathingtoreplace;")
        let base64 = imgarr[1]


        const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
        let body = new URLSearchParams()
        body.set('image', base64)

        // this.http.post('https://api.imgbb.com/1/upload?expiration=0&key=c0f647e7fcbb11760226c50f87b58303', body.toString(), { headers, observe: 'response' }).subscribe(res => {
        //   this.discountimageurl.push(res['body']['data'].url)
        //   resolve((res['body'])['data'].url)
        // }, awe => {
        //   reject(awe)
        // })

        this.http.post('https://api.nanogapp.com/upload', { image: base64, folder: 'nanog', userid: 'nanog' }).subscribe((res) => {
          this.discountimageurl.push(res['imageURL'])
          resolve(res['imageURL'])
        }, awe => {
          reject(awe)
        })

      }
      else {
        resolve('empty')
      }
    })
  }

  takePhoto() {
    const options: CameraOptions = {
      quality : 25,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      saveToPhotoAlbum: true
    }
    this.camera.getPicture(options).then((imageData) => {
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.uploadserve(base64Image).then(res => {
        Swal.close()
        // console.log(res)
      })
    },
      (err) => {
        alert(err)
      });
  }

  imagectype;
  imagec;
  base64img;

  fileChange2(event, maxsize) {
    return new Promise((resolve, reject) => {
      const files = event.target.files;

      for(let i = 0; i< files.length ; i++)
      {
        Swal.fire({
          title: 'processing...',
          text: 'Larger size of image may result in a longer upload time.',
          icon: 'info',
          heightAuto: false,
          allowOutsideClick: false,
          showConfirmButton: false,
        })
      if (event.target.files && event.target.files[i]) {
        this.imagectype = event.target.files[i].type;
        // EXIF.getData(event.target.files[0], () => {
        //   console.log(event.target.files[0]);
        //   console.log(event.target.files[0].exifdata.Orientation);
        //   const orientation = EXIF.getTag(this, 'Orientation');
          const can = document.createElement('canvas');
          const ctx = can.getContext('2d');
          const thisImage = new Image;
          const maxW = maxsize;
          const maxH = maxsize;
          thisImage.onload = (a) => {

            // console.log(a);
            const iw = thisImage.width;
            const ih = thisImage.height;
            const scale = Math.min((maxW / iw), (maxH / ih));
            const iwScaled = iw * scale;
            const ihScaled = ih * scale;
            can.width = iwScaled;
            can.height = ihScaled;
            ctx.save();
            // const width = can.width; const styleWidth = can.style.width;
            // const height = can.height; const styleHeight = can.style.height;
            // console.log(event.target.files[0]);
            // if (event.target.files[0] && event.target.files[0].exifdata.Orientation) {
            //   console.log(event.target.files[0].exifdata.Orientation);
            //   if (event.target.files[0].exifdata.Orientation > 4) {
            //     can.width = height; can.style.width = styleHeight;
            //     can.height = width; can.style.height = styleWidth;
            //   }
            //   switch (event.target.files[0].exifdata.Orientation) {
            //     case 2: ctx.translate(width, 0); ctx.scale(-1, 1); break;
            //     case 3: ctx.translate(width, height); ctx.rotate(Math.PI); break;
            //     case 4: ctx.translate(0, height); ctx.scale(1, -1); break;
            //     case 5: ctx.rotate(0.5 * Math.PI); ctx.scale(1, -1); break;
            //     case 6: ctx.rotate(0.5 * Math.PI); ctx.translate(0, -height); break;
            //     case 7: ctx.rotate(0.5 * Math.PI); ctx.translate(width, -height); ctx.scale(-1, 1); break;
            //     case 8: ctx.rotate(-0.5 * Math.PI); ctx.translate(-width, 0); break;
            //   }
            // }

            ctx.drawImage(thisImage, 0, 0, iwScaled, ihScaled);
            ctx.restore();

            this.imagec = can.toDataURL();

            const imgggg = this.imagec.replace(';base64,', 'thisisathingtoreplace;');
            const imgarr = imgggg.split('thisisathingtoreplace;');
            let base64 = imgarr[1];
            this.base64img = imgarr[1];
            event.target.value = '';

            const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
            let body = new URLSearchParams()
            body.set('image', this.base64img)


            // this.http.post('https://api.imgbb.com/1/upload?expiration=0&key=c0f647e7fcbb11760226c50f87b58303', body.toString(), { headers, observe: 'response' }).subscribe(res => {
            //   this.discountimageurl.push((res['body']['data'].url))
            //   resolve((res['body'])['data'].url)
            // }, err => {
            //   alert(err)
            //   reject(err)
            // })
            this.http.post('https://api.nanogapp.com/upload', { image: this.imagec, folder: 'nanog', userid: 'nanog' }).subscribe((res) => {
              this.discountimageurl.push((res['imageURL']))
              Swal.close()
              resolve(res['imageURL'])
            }, awe => {
              reject(awe)
            })
          };
          thisImage.src = URL.createObjectURL(event.target.files[i]);
        // });
      }
    }

    })
  }

  async selectMedia() {
    if (this.sales_status != 'Quotation' && this.sales_status != null) {

    }
    else if (this.discountimageurl.length >= this.totaldiscountphoto.length) {
      // console.log(this.discountimageurl)
      Swal.fire({
        text: 'Please remove at least one photo before upload new photo',
        icon: 'warning',
        timer: 1500,
        heightAuto: false,
      })
    }
    else {
      const actionsheet = await this.actionSheetController.create({
        header: 'What would you like to add?',
        cssClass: 'custom-css',
        buttons: [
          {
            cssClass: 'actionsheet-selection',
            text: 'Upload from gallery',
            handler: () => {
              document.getElementById('uploadimage').click()
            }
          },
          {
            cssClass: 'actionsheet-selection',
            text: 'Camera',
            handler: () => {
              this.takePhoto()
            }
          },
          {
            cssClass: 'actionsheet-cancel',
            text: 'Cancel',
            role: 'cancel'
          }
        ]
      });

      await actionsheet.present()
    }
  }

  // viewPhoto(i) {
  //   this.photoViewer.show(this.discountimageurl[i])
  // }

  viewPhoto(i) {
    this.nav.navigateForward('image-viewer?imageurl=' +  this.discountimageurl[i])
  }


  viewPhoto2(x)
  {
    // this.nav.navigateForward('image-viewer?imageurl=' +  x)
    Swal.fire({
      heightAuto: false,
      imageUrl: x,
      showCloseButton: true,
      // closeButtonHtml : '<button type="button" class="my-custom-close-button">&times;</button>',
      // imageHeight: 1500,
      showConfirmButton: false,
      // customClass : 'swalimage',
      // footer : false,
      background : 'rgba(0,0,0,0)',
      // imageHeight : '100%',
    })

  }

  removePhoto(i) {
    if (this.sales_status != 'Quotation' && this.sales_status != null) {

    }
    else {
      // console.log(i)
      this.discountimageurl.splice(i, 1)
    }
  }


  salesorder() {
    // Swal.fire({
    //   text : 'Developing In Progress....',
    //   title : 'Waiting For SOF Format',
    //   icon : 'warning',
    //   heightAuto : false,
    // })
    this.nav.navigateForward('pdf-sales-order-form?uid=' + this.userid + '&tid=' + this.taskid + '&sid=' + this.salesid + '&tab=' + 2)
    // this.nav.navigateForward('pdf-sof-fill?tid=' + this.taskid + '&sid=' + this.salesid + '&leadid=' + this.appointment.lead_id)
  }


  payby(x) {
    console.log(this.total)
    // console.log(this.appointment.sales_packages)
    // if (this.discountselected2 == undefined) {
    //   Swal.fire(
    //     {
    //       icon: 'info',
    //       title: 'Please wait a second, processing discount....',
    //       heightAuto: false,
    //       timer: 1500,
    //     }
    //   )
    // }
    // else 
    if (!this.appointment.sales_packages) {
      Swal.fire(
        {
          icon: 'info',
          title: 'Please check in or add the service first',
          heightAuto: false,
          timer: 1500,
        }
      )
    }
    else if (this.appointment.sales_packages.length < 1) {
      Swal.fire(
        {
          icon: 'warning',
          title: 'No service be added',
          text: 'Please add at least one service',
          heightAuto: false,
          timer: 1560
        }
      )
    }
    else if (this.appointment.sales_packages.length > 0) {
      Swal.fire(
        {
          text: 'Are you sure to check out?',
          heightAuto: false,
          showCancelButton: true,
          reverseButtons: true,
          icon: 'info',
        }
      ).then(a => {
        if (a['isConfirmed'] == true) {
          Swal.fire(
            {
              icon: 'info',
              title: 'Processing...',
              heightAuto: false,
              showConfirmButton: false,
            }
          )
          let tempimage = []
          for (let i = 0; i < this.totaldiscountphoto.length; i++) {
            tempimage.push(this.discountimageurl[i])
          }
          // console.log(this.total)
          // console.log(this.discountselected2)

          this.http.post('https://api.nanogapp.com/updateSalesPayment', {
            sales_id: this.appointment.sales_id,
            // sales_status: x,
            // payment_status: 'In Progress',
            // payment_date: this.payment_date,
            total: this.total,
            sub_total: this.subtotal,
            // promo_code : this.promocodedetail ? this.promocodedetail.id : null,
            discount_applied: this.discountselected2.length > 0 ? JSON.stringify(this.discountselected2.map(a => a['id'])) : JSON.stringify([]),
            discount_image: JSON.stringify(tempimage) || []
          }).subscribe(res => {
            if (res['success'] == true) {
              setTimeout(() => {
                Swal.close()
                // localStorage.removeItem('discount?tid=' + this.taskid);

                // this.nav.navigateForward('task-payment?uid=' + this.userid + '&tid=' + this.taskid + '&type=' + x + '&sid=' + this.salesid)

                this.nav.navigateForward('pdf-sof-fill?tid=' + this.taskid + '&sid=' + this.salesid + '&leadid=' + this.appointment.lead_id + '&type=' + x)
              }, 800);
              // Swal.fire(
              //   {
              //     icon: 'success',
              //     title: 'Save sucessfully',
              //     heightAuto: false,
              //     timer: 1500,
              //   }
              // ).then(() => {
              //   this.nav.navigateForward('task-payment?uid=' + this.userid + '&tid=' + this.taskid + '&type=' + x)
              // }
              // )
              // this.nav.navigateForward('task-payment?uid=' + this.userid + '&tid=' + this.taskid + '&type=' + x)
            }
          })
        }
      })
    }
  }

  async gopay() {
    if (this.appointment.checkin_status == 'havent') {
      Swal.fire({
        icon: 'info',
        title: 'Please Check in first',
        heightAuto: false,
        timer: 2000,
      })
    }
    else {
      const actionsheet = await this.actionSheetController.create({
        header: 'Deposit or Full Payment?',
        cssClass: 'custom-css',
        buttons: [
          {
            cssClass: 'actionsheet-selection',
            text: 'Deposit',
            handler: () => {
              this.payby('Deposit')
            }
          },
          {
            cssClass: 'actionsheet-selection',
            text: 'Full Payment',
            handler: () => {
              this.payby('Full Payment')
            }
          },
          {
            cssClass: 'actionsheet-cancel',
            text: 'Cancel',
            role: 'cancel'
          }
        ]
      })

      await actionsheet.present()
    }
  }

  schedule() {
    // if(!this.appointment.sales_status || this.appointment.sales_status == 'Quotation')
    // {
    //   Swal.fire({
    //     text: 'Please make payment first',
    //     icon: 'info',
    //     heightAuto: false,
    //     timer: 1500
    //   })
    // }else
    // {
    //   this.nav.navigateForward('schedule-calander?uid=' + this.userid + '&tid=' + this.taskid + '&sid=' + this.salesid)
    // }
    this.nav.navigateForward('schedule-calander?uid=' + this.userid + '&lid=' + this.appointment.lead_id + '&tid=' + this.taskid + '&sid=' + this.salesid)
    // console.log(this.userid, this.taskid, this.salesid)

  }

  widther() {
    return this.platform.width()
  }

  checkpromocode(x) {
    this.promocodechecking = true
    if (x == 'verify') {
      this.http.post('https://api.nanogapp.com/CheckPromoCode', { name: this.promocode }).subscribe(res => {
        // console.log(res)
        this.promocodedetail = res['data']
        if (!this.promocodedetail) {
          this.promocodeverifystatus = false
          this.promocodeexpire = false
          this.promocodeinput = true
          this.promocodechecking = false
          Swal.fire({
            title: 'Sorry, cannot found the promocode.',
            icon: 'error',
            heightAuto: false,
            timer: 1500,
          })
        }
        else if (this.promocodedetail && this.promocodedetail['status'] == false) {
          this.promocodeverifystatus = false
          this.promocodeexpire = true
          this.promocodeinput = true
          this.promocodechecking = false
          Swal.fire({
            title: 'Sorry, this promocode has already expired.',
            icon: 'error',
            heightAuto: false,
            timer: 1500,
          })
        }
        else if (this.promocodedetail && this.promocodedetail['status'] == true) {
          //disabled the input field
          this.promocodeinput = false

          //to check whether the promocode exist or not, if have this promocode, then true, else false
          this.promocodeverifystatus = true

          //for checking whether the promocode is active or not, if the status is false , then = true
          this.promocodeexpire = false

          //if this status == false, then the user cannot click the button for 'verify' or 'reset'
          this.promocodechecking = true

          this.promocodeapplied = true
          Swal.fire({
            title: 'Apply successfully.',
            icon: 'success',
            heightAuto: false,
            timer: 1500,
          })
          setTimeout(() => {
            this.checkpromocode('verifydone')
            // console.log('delete the text')
          }, 2000)
        }
      })
    }
    else if (x == 'verifydone') {
      Swal.fire({
        text: 'Processing...',
        icon: 'info',
        heightAuto: false,
        showConfirmButton: false,
      })
      // console.log(this.salesid)
      // console.log(this.promocodedetail.id)
      this.http.post('https://api.nanogapp.com/updatePromoCodeInSales', { sales_id: this.salesid, promo_code: this.promocodedetail.id }).subscribe(a => {
        // console.log(a)
        setTimeout(() => {
          Swal.close()
        }, 700)

        this.promocodeverifystatus = undefined
        this.promocodeexpire = undefined
        this.promocodeinput = false
        this.promocodechecking = false

        // localStorage.removeItem('discount?tid=' + this.taskid);
        this.discountselected2 = [] as any
        this.totaldiscountphoto = [] as any
        this.discountimageurl = [] as any

        this.dpercentage = 0
        this.dnumber = 0

        this.promocodeapplied = true
        this.dpercentage = this.promocodedetail.percentage
        this.refresher()
      })


    }
    else if (x == 'reset') {
      Swal.fire({
        text: 'Are your sure to remove the promocode?',
        icon: 'info',
        heightAuto: false,
        showCancelButton: true,
        reverseButtons: true,
      }).then(a => {
        if (a['isConfirmed']) {
          // console.log(this.salesid)
          this.http.post('https://api.nanogapp.com/updatePromoCodeInSales', { sales_id: this.salesid, promo_code: null }).subscribe(a => {
            // console.log(a)
            // this.promocodedetail = null
            this.promocode = undefined
            this.promocodeinput = true
            this.promocodeverifystatus = undefined
            this.promocodeexpire = undefined
            this.promocodechecking = false
            this.promocodeapplied = false
            this.promocodereset = true
            // this.discountstatus = 'fromlocal'
            this.dpercentage = 0
            this.refresher()
          })

        }
      })

    }

  }

  checkpromocodestatus() {
    this.promocodeverifystatus = undefined
    this.promocodeexpire = undefined
  }

  signature() {
    this.nav.navigateForward('signature?uid=' + this.userid + '&tid=' + this.taskid)
  }

  goreceipt() {
    this.nav.navigateForward('pdf-receipt-invoice?uid=' + this.userid + '&tid=' + this.taskid + '&sid=' + this.salesid)
  }

  // lengthof(x){
  //   return Object.keys(x).length
  // }

  gouploaddiscountpage() {
    this.nav.navigateForward('task-discount-photo?uid=' + this.userid + '&tid=' + this.taskid + '&sid=' + this.salesid)
  }

  goLabelPage() {
    this.nav.navigateForward('task-label?uid=' + this.userid + '&tid=' + this.taskid + '&sid=' + this.salesid + '&lid=' + this.appointment.lead_id + '&labelm=' + this.appointment.label_m + '&labels=' + this.appointment.label_s)
  }

  platformType() {
    return this.platform.platforms()
  }

  viewService(service) {
    if (this.sales_status != 'Quotation' && this.sales_status != null) {

    }
    else {
      this.nav.navigateForward('services-view?uid=' + this.userid + '&tid=' + this.taskid + '&sid=' + this.salesid + '&sap=' + service['sap_id'])
    }
  }


  dropdownPreviousServices(){
    this.dropdownPreviousServicesStatus ? this.dropdownPreviousServicesStatus = false : this.dropdownPreviousServicesStatus = true
  }

  addWarrantyTask(){
    if (this.sales_status != 'Quotation' && this.sales_status != null) {

    }
    else if ((!this.appointment.checkin_latt || !this.appointment.checkin_long|| !this.appointment.checkin_time || !this.appointment.checkin_img) 
    && !this.appointment.check_detail && !this.appointment.bypass) {
      Swal.fire({
        icon: 'info',
        title: 'Please check in first',
        heightAuto: false,
        timer: 2000
      })
    }
    else {
      this.nav.navigateForward('services-warranty-add?uid=' + this.userid + '&tid=' + this.taskid + '&sid=' + this.salesid)
    }
  }

  addWarrantyTask2(x)
  {
    // console.log(x)
    this.nav.navigateForward('service-warranty2?uid=' + this.userid + '&tid=' + this.taskid + '&salesid=' + this.salesid  + '&linked_sapid=' + x.sap_id)
  }

  editWarrantyService(x){
    if (this.sales_status != 'Quotation' && this.sales_status != null) {

    }
    else {
      this.nav.navigateForward('services-warranty-edit?uid=' + this.userid + '&tid=' + this.taskid + '&sid=' + this.salesid + '&sap=' + x['sap_id'])
    }
  }

  hold(x){
    this.nav.navigateForward('task-label-cancel-reschedule?uid=' + this.userid + '&tid=' + this.taskid + '&sid=' + this.salesid + '&lid=' + this.appointment.lead_id + '&labelm=' + this.appointment.label_m + '&labels=' + this.appointment.label_s + '&tab=' + x)

    // this.userid + '&tid=' + this.taskid + '&sid=' + this.salesid + '&lid=' + this.appointment.lead_id + '&labelm=' + this.appointment.label_m + '&labels=' + this.appointment.label_s
    // if (this.permission == 0) {
    //   console.log(this.open)
    //   if (this.open == 0) {
    //     console.log(this.permission, this.open)
    //     this.nav.navigateForward('check-out?uid=' + this.userid + '&tid=' + this.taskid + '&lid=' + this.appointment.lead_id)
    //   }
    //   else if (this.open == 1) {
    //     Swal.fire({
    //       text: 'Please switch on your gps',
    //       heightAuto: false,
    //       timer: 2000
    //     }
    //     )
    //     this.gpsopen()
    //   }
    // }
    // else if (this.permission == 1) {
    //   this.gpsPermission()
    // }
    // else if (this.permission == 2) {
    //   Swal.fire({
    //     title: 'Lost Permission',
    //     text: 'Please go to setting and allow location permission',
    //     heightAuto: false,
    //     timer: 2000
    //   })
    // }
  }

  buttons(){
    this.buttonstatus = !this.buttonstatus
  }

  holdBtn(){
    if(!this.appointment.check_detail &&
      (!this.appointment.checkin_latt || !this.appointment.checkin_long|| !this.appointment.checkin_time || !this.appointment.checkin_img))
    {
      Swal.fire({
        text: "You're havent Check In!",
        heightAuto: false,
        icon : 'info',
        timer : 1500,
      })
    }
    else
    {
      Swal.fire({
        html: 'Are you sure want to hold this appointment?<br> <b>Insert “Yes” to continue.</b>',
        icon : 'info',
        heightAuto : false,
        showCancelButton: true,
        reverseButtons: true,
        input: 'text',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showLoaderOnConfirm: true,
      }).then(a => {
        if(a['isConfirmed'] && a['value'].toLowerCase() == 'yes')
        {
          // console.log(a)
          Swal.fire({
            text: 'Processing...',
            icon: 'info',
            heightAuto: false,
            showConfirmButton: false,
          })
          this.http.post('https://api.nanogapp.com/insertCheckOut2', {
            // label_m : this.label.mainlabel.id,
            // label_s : this.label.sublabel.id,
            lead_id : this.appointment.lead_id,
            uid : this.userid,
            by : this.user.user_name,
            // image : JSON.stringify(this.imageurl) || JSON.stringify([]),
            // label_video : JSON.stringify(this.videourl) || JSON.stringify([]),
            // remark : this.label.remark,
  
            // latt: this.location.latitude,
            // long: this.location.longitude,
            // image: JSON.stringify(this.imageurl),
            aid: this.taskid,
            // checkin_address: this.addressstring,
            check_status : 'hold', 
            // event_time : this.eventtime ? new Date(this.eventtime).getTime() : new Date().getTime() 
          }).subscribe(a => {
            console.log(a)
            setTimeout(() => {
              Swal.close()
              Swal.fire({
                title: 'Success',
                icon: 'success',
                text: 'Update Successfully',
                heightAuto: false,
                timer: 3000,
              })
             this.refresher()
            }, 700);
          })
  
        }
        else if(a['isConfirmed'] && a['value'].toLowerCase() != 'yes')
        {
          Swal.fire({
            text: 'Kindly insert the word "Yes" to hold this appointment.',
            icon : 'error',
            heightAuto : false,
          }).then(a => {
            this.holdBtn()
          })
        }
      })
    }

  }

  magnify(x){
    Swal.fire({
      imageUrl : x,
      heightAuto : false,
      confirmButtonText: 'Close',
      text: x,
    })
  }

  openvideo(x){
    this.nav.navigateForward('video-viewer?link=' + x)
  }

  addequipment(){
    // console.log('equipment')
    if (this.sales_status != 'Quotation' && this.sales_status != null) {

    }
    else if ((!this.appointment.checkin_latt || !this.appointment.checkin_long|| !this.appointment.checkin_time || !this.appointment.checkin_img) 
    && !this.appointment.check_detail && !this.appointment.bypass) {
      Swal.fire({
        icon: 'info',
        title: 'Please check in first',
        heightAuto: false,
        timer: 2000
      })
    }
    else {
    this.nav.navigateForward('task-equipment?salesid=' + this.salesid + '&leadid=' + this.appointment.lead_id)
    }
  }

  inspect(){
    this.nav.navigateForward('inspect?aid=' + this.appointment.appointment_id + '&salesid=' + this.salesid + '&leadid=' + this.appointment.lead_id)
  }


  openSignature() {
    Swal.fire({
      title: 'Signature Type',
      icon: 'info',
      showDenyButton: true,
      showCancelButton: false,
      html: '<b>Sof/Payment Signature</b><br/>https://admin-nanog.web.app/form-page?no=' + this.appointment.lead_id + '&form=4&type=1&t=' + new Date().getTime() + '<br/><br/><b>Installation Signature</b><br/>https://admin-nanog.web.app/form-page?no=' + this.appointment.lead_id + '&form=4&type=2&t=' + new Date().getTime(),
      confirmButtonText: 'Copy SOF/Payment Signature',
      denyButtonText: `Copy Installation Signature`,
      heightAuto: false,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.copyLinkToClipboard('https://admin-nanog.web.app/form-page?no=' + this.appointment.lead_id + '&form=4&type=1&t=' + new Date().getTime())
        // window.open('https://admin-nanog.web.app/form-page?no=' + this.lead.lead_id + '&form=4&type=1&t=' + new Date().getTime(), '_blank');
      } else if (result.isDenied) {
        this.copyLinkToClipboard('https://admin-nanog.web.app/form-page?no=' + this.appointment.lead_id + '&form=4&type=2&t=' + new Date().getTime())
        // window.open('https://admin-nanog.web.app/form-page?no=' + this.lead.lead_id + '&form=4&type=2&t=' + new Date().getTime(), '_blank');
      }
    })
  }

  copyLinkToClipboard(x) {
    const link = x;

    // Create a temporary input element
    const input = document.createElement('input');
    input.value = link;
    document.body.appendChild(input);

    // Select the input element's content
    input.select();

    // Copy the selected content to clipboard
    document.execCommand('copy');

    // Remove the temporary input element
    document.body.removeChild(input);
    const Toast = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        Swal.showLoading()
      }
    })

    Toast.fire({
      icon: 'info',
      title: 'Link Copied to ClipBoard'
    })

    // Optionally, you can show a notification to indicate that the link has been copied.
    // You can use a library like ngx-toastr or create your own notification component.
    // For example, if you're using ngx-toastr:
    // this.toastr.success('Link copied to clipboard!', 'Success');
  }
}
