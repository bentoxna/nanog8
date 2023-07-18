import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController, NavParams, Platform } from '@ionic/angular';
import Swal from 'sweetalert2';
import { TaskDiscountCustomPage } from '../task-discount-custom/task-discount-custom.page';

@Component({
  selector: 'app-task-discount2',
  templateUrl: './task-discount2.page.html',
  styleUrls: ['./task-discount2.page.scss'],
})
export class TaskDiscount2Page implements OnInit {

  userid = localStorage.getItem('nanogapp_uid') || ''

  discounts = [] as any
  discountselect = [] as any
  sales_packages = [] as any
  sales_packages_main = [] as any
  sales_packages_addon = [] as any

  taskid
  salesid
  sapid

  custom = [] as any
  noncustom = [] as any

  dcustompercentage = 0
  tab = 1
  
  wholeService
  mainService
  addonService
  thisService
  totalPrice = 0
  constructor(private http: HttpClient,
    private modal : ModalController,
    private route : ActivatedRoute,
    private nav : NavController,
    private platform: Platform,) { }

  ngOnInit() {
    this.refresher()
  }


  platformType(){
    return this.platform.platforms()
  }

  refresher(){
    this.route.queryParams.subscribe(a => {
      this.taskid = a['tid']
      this.salesid = a['sid']
      this.sapid = a['sapid']

      console.log(this.sapid)
      this.sapid ? this.tab = 2 : this.tab = 1

      // getSalesPackageDetails
      this.http.post('https://api.nanogapp.com/getSalesPackageBySapid', {sap_id: this.sapid}).subscribe(a => {
        // this.wholeService = a['data']
        this.mainService = a['data'].filter(a => a['sap_id'] == this.sapid)
        // this.addonService = a['data'].filter(a => a['addon_id'])
        
        // this.totalPrice = this.wholeService.filter(a => a).map(b => b['total']).reduce((c,d) => c + d, 0)

        console.log(this.wholeService, this.mainService, this.addonService)
      })

      this.http.post('https://api.nanogapp.com/getAllSalesDiscount', {sales_id: this.salesid}).subscribe(a => {
        this.dcustompercentage = 0
          this.custom = a['data'].filter(a => a['discount_id'] == null)
          this.noncustom = a['data'].filter(a => a['discount_id'] != null)
          this.custom.filter(b => b['type'] == true ? ((b['status'] == true || b['status'] == null) ? this.dcustompercentage += b['percentage'] : this.dcustompercentage = this.dcustompercentage ) : this.dcustompercentage = this.dcustompercentage)
          // this.dpercentage = a['data'].reduce((a,b) => a['type'] == true? ((b['status'] == true || b['status'] == null) ? a + b : a = b) : a = b, 0)
          console.log(this.dcustompercentage)
          console.log(this.custom)
          console.log(this.noncustom)

          this.http.get('https://api.nanogapp.com/getActiveDiscount').subscribe(a => {
            this.discounts = a['data']
            this.discounts.filter(a => this.noncustom.filter(b => a['id'] == b['discount_id'] ? ( b['status'] == true ? a['selected'] = true : a['selected'] = false) : (a['selected'] == null ? a['selected'] = false : a['selected'] = a['selected'])))
            console.log(this.discounts)
          })
       })
    })
  }

  getclick(i){
    console.log(this.discounts[i])
    this.discounts[i].selected == true ? this.discounts[i].selected = false : this.discounts[i].selected = true
  }

    // confirmdiscount(){
    //   localStorage.setItem('discount?tid=' + this.taskid , JSON.stringify(this.discountselect))
    //   this.modal.dismiss('confirm')
    // }

    // canceldiscount(){
    //   this.modal.dismiss()
    // }
  
  back(){
    this.nav.pop()
  }

 async addcustomdiscount(){
    const modal = await this.modal.create({
      cssClass: 'customdiscountpage',
      component: TaskDiscountCustomPage,
      componentProps: { tid: this.taskid, sid : this.salesid, sapid : this.sapid }
    })

    modal.onDidDismiss().then(a => {
      if(a['data'] == 'done')
      {
        this.refresher()
      }
    })

    modal.present()
  }

  confirm(){
    let discounttickpercentage = 0
    this.discounts.filter(a => a['selected'] == true ? discounttickpercentage += a['percentage'] : discounttickpercentage = discounttickpercentage)
    if((discounttickpercentage + this.dcustompercentage) > 100)
    {
      Swal.fire({
        text: 'Total Discount cannot higher than 100%, current percentage: ' + (discounttickpercentage + this.dcustompercentage) + '%',
        icon: 'error',
        heightAuto: false,
        timer: 1500,
      })
    }
    else
    {
      Swal.fire({
        text: 'Are you sure to add this/these discount/s?',
        icon: 'info',
        heightAuto: false,
        showCancelButton: true,
        reverseButtons: true,
      }).then(a => {
        if(a['isConfirmed'] == true)
        {
          Swal.fire({
            title: 'Processing...',
            icon: 'info',
            heightAuto: false,
            showConfirmButton: false,
          })
          console.log(this.discounts)
          let discountticked = this.discounts.filter(a => a['selected'] == true).map(b =>({name: b['name'], remark: null,  percentage: b['percentage'], need_photo : b['need_photo'], photo : JSON.stringify([]), sales_id : parseInt(this.salesid), discount_id : b['id'], type: true, status : true}))
          let discountuntick = this.discounts.filter(a => a['selected'] == false).map(b =>({name: b['name'], remark: null,  percentage: b['percentage'], need_photo : b['need_photo'], photo : JSON.stringify([]), sales_id : parseInt(this.salesid), discount_id : b['id'], type: true, status : false}))
          console.log(discountticked, discountuntick)
          let body = {discount: discountticked}
           
          this.http.post('https://api.nanogapp.com/addTickSalesDiscount', {
            body , false: JSON.stringify(discountuntick)    
          }).subscribe(a => {
            console.log(a)
            Swal.close()
            this.nav.pop()
           })
        }
      })
    }

  }

  delete(x){
    console.log(x)
    Swal.fire({
      text: 'Are you sure to delete this custom discount?',
      icon: 'info',
      heightAuto: false,
      showCancelButton: true,
      reverseButtons: true,
    }).then(a => {
      if(a['isConfirmed'] == true)
      {
        this.http.post('https://api.nanogapp.com/deleteSalesDiscount', {id : x.id}).subscribe(a => {
          console.log(a)
          this.refresher()
        })
      }
    })

  }
}
