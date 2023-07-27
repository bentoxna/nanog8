import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController, NavParams, Platform } from '@ionic/angular';
import Swal from 'sweetalert2';
import { TaskDiscountCustomPage } from '../task-discount-custom/task-discount-custom.page';

@Component({
  selector: 'app-task-discount3',
  templateUrl: './task-discount3.page.html',
  styleUrls: ['./task-discount3.page.scss'],
})
export class TaskDiscount3Page implements OnInit {

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

  allPackage
  sumTotalPrice = 0

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
      this.sapid = a['sapid'] ? a['sapid'] : null

      console.log(this.sapid)
      this.sapid ? this.tab = 2 : this.tab = 1
      console.log(this.tab)
      if(this.sapid)
      {
        this.http.post('https://api.nanogapp.com/getMainAndAddOnPackagesJoinDiscount', { sap_id: this.sapid }).subscribe(a => {
          console.log(a)
          this.wholeService = a['data']
          this.mainService = a['data'].filter(a => !a['addon_id'])
          this.addonService = a['data'].filter(a => a['addon_id'])
  
          this.mainServiceCalculator()
          this.addonServiceCalculator()
          this.totalPriceCaculator()
          
          // this.totalPrice = this.wholeService.filter(a => a).map(b => b['total']).reduce((c,d) => c + d, 0)
        })
      }


      this.http.post('https://api.nanogapp.com/getSalesPackageDetails', { sales_id: this.salesid }).subscribe(s => {
        console.log(s)
        this.allPackage = s['data']
        this.sumTotalPrice = this.allPackage.filter(a => !a['total_after']).map(b => b['total']).reduce((c,d) => c + d , 0)
        this.sumTotalPrice = this.allPackage.filter(a => a['total_after']).map(b => b['total_after']).reduce((c,d) => c + d , this.sumTotalPrice)
        console.log(this.sumTotalPrice)
      })

      this.http.post('https://api.nanogapp.com/getAllSalesDiscount', {sales_id: this.salesid}).subscribe(a => {
        this.dcustompercentage = 0
        console.log(a)
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

  refresher2(i){
    this.route.queryParams.subscribe(a => {
      this.taskid = a['tid']
      this.salesid = a['sid']
      this.sapid = a['sapid']

      console.log(this.sapid)
      this.sapid ? this.tab = 2 : this.tab = 1

      this.http.post('https://api.nanogapp.com/getMainAndAddOnPackagesJoinDiscount', { sap_id: this.sapid }).subscribe(a => {
        console.log(a)
        this.wholeService = a['data']
        this.mainService = a['data'].filter(a => !a['addon_id'])
        this.addonService = a['data'].filter(a => a['addon_id'])

        this.mainServiceCalculator()
        this.addonServiceCalculator()
        this.totalPriceCaculator()

        console.log(this.addonService[i].aftertotal)
        console.log(this.addonService[i].sap_id)
        this.http.post('https://api.nanogapp.com/updateSalesPackageAfterTotal', { sapid: this.addonService[i].sap_id, total_after : this.addonService[i].aftertotal }).subscribe(a => {
            console.log(a)
        })
        
        // this.totalPrice = this.wholeService.filter(a => a).map(b => b['total']).reduce((c,d) => c + d, 0)
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


  refresher3(j){
    this.route.queryParams.subscribe(a => {
      this.taskid = a['tid']
      this.salesid = a['sid']
      this.sapid = a['sapid']

      console.log(this.sapid)
      this.sapid ? this.tab = 2 : this.tab = 1

      this.http.post('https://api.nanogapp.com/getMainAndAddOnPackagesJoinDiscount', { sap_id: this.sapid }).subscribe(a => {
        console.log(a)
        this.wholeService = a['data']
        this.mainService = a['data'].filter(a => !a['addon_id'])
        this.addonService = a['data'].filter(a => a['addon_id'])

        this.mainServiceCalculator()
        this.addonServiceCalculator()
        this.totalPriceCaculator()

        console.log(this.mainService[0].aftertotal)
        console.log(this.mainService[0].sap_id)
        this.http.post('https://api.nanogapp.com/updateSalesPackageAfterTotal', { sapid: this.mainService[0].sap_id, total_after : this.mainService[0].aftertotal }).subscribe(a => {
            console.log(a)
        })
        
        // this.totalPrice = this.wholeService.filter(a => a).map(b => b['total']).reduce((c,d) => c + d, 0)
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

  mainServiceCalculator(){
    let temp = this.mainService[0].dis_items
    this.mainService[0].aftertotal = this.mainService[0].total
    console.log(temp, this.mainService[0].aftertotal)
    if(this.mainService[0].dis_items)
    {
      for(let i = 0; i < temp.length; i++)
      {
        if(temp[i].dis_type)
        {
          this.mainService[0].aftertotal = Number((this.mainService[0].aftertotal * (100 - temp[i].dis_percentage) / 100).toFixed(2))
          console.log(this.mainService[0].aftertotal)
        }
      }
      for(let i = 0; i < temp.length; i++)
      {
        if(!temp[i].dis_type)
        {
          this.mainService[0].aftertotal = Number((this.mainService[0].aftertotal - temp[i].dis_percentage).toFixed(2))
          console.log(this.mainService[0].aftertotal)
        }
      }
    }

  }


  addonServiceCalculator(){
    for(let i = 0; i < this.addonService.length; i++)
    {
      this.addonService[i].aftertotal = this.addonService[i].total
      console.log(this.addonService[i].dis_items)
      if(this.addonService[i].dis_items)
      {
        for(let j = 0 ; j < this.addonService[i].dis_items.length; j++)
        {
          if(this.addonService[i].dis_items[j].dis_type)
          {
            this.addonService[i].aftertotal = Number((this.addonService[i].aftertotal * (100 - this.addonService[i].dis_items[j].dis_percentage) / 100).toFixed(2))
            console.log(this.addonService[i].aftertotal)
          }
        }
  
        for(let j = 0 ; j < this.addonService[i].dis_items.length; j++)
        {
          if(!this.addonService[i].dis_items[j].dis_type)
          {
            this.addonService[i].aftertotal = Number((this.addonService[i].aftertotal - this.addonService[i].dis_items[j].dis_percentage).toFixed(2))
            console.log(this.addonService[i].aftertotal)
          }
        }
      }

    }
  }

  totalPriceCaculator(){
    console.log(this.mainService[0].aftertotal)
    console.log(this.addonService.filter(a => a).map(a => a['aftertotal']).reduce((a,b) => a+b, 0))
    this.totalPrice = (this.mainService[0].aftertotal) + (this.addonService.filter(a => a).map(a => a['aftertotal']).reduce((a,b) => a+b, 0))
    console.log(this.totalPrice)
    let temp = (this.totalPrice / 100 * 100).toFixed(2)
    console.log(temp)
    this.totalPrice = Number(temp)
    console.log(this.totalPrice)
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

  adddiscount(i, x){
    // if(x == 'main')
    // {
    //   console.log(this.mainService[i])
    // }
    // else
    // {
    //   console.log(this.addonService[i])
    // }
    let tempid
    x == 'main' ? tempid = this.mainService[i].sap_id : tempid = this.addonService[i].sap_id
    this.addcustomdiscount2(tempid)
  }

  async addcustomdiscount2(tempid){
    const modal = await this.modal.create({
      cssClass: 'customdiscountpage',
      component: TaskDiscountCustomPage,
      componentProps: { tid: this.taskid, sid : this.salesid, sapid : tempid }
    })

    modal.onDidDismiss().then(a => {
      if(a['data'] == 'done')
      {
        this.refresher()
      }
    })

    modal.present()
  }

  deleteDiscount(j){
    console.log(this.mainService[0].dis_items[j])
    Swal.fire({
      text :  this.mainService[0].dis_items[j].dis_type ? ( 'Are you sure want to delete discount' + this.mainService[0].dis_items[j].dis_name + ' with ' + this.mainService[0].dis_items[j].dis_percentage + '% discount') : ('Are you sure want to delete discount ' +  this.mainService[0].dis_items[j].dis_name + ' with RM ' + this.mainService[0].dis_items[j].dis_percentage + ' discount') ,
      icon : 'info',
      heightAuto : false,
      showCancelButton : true,
      reverseButtons : true,
    }).then(a => {
      if(a['isConfirmed'])
      {
        this.http.post('https://api.nanogapp.com/deleteSalesPackageDiscount', {dis_id :  this.mainService[0].dis_items[j].dis_id}).subscribe(a => {
          console.log(a)
          this.refresher3(j)
        })
      }
    })
  }

  deleteDiscountaddon(i, j){
    console.log(this.addonService[i].dis_items[j])
    Swal.fire({
      text :  this.addonService[i].dis_items[j].dis_type ? ( 'Are you sure want to delete discount ' + this.addonService[i].dis_items[j].dis_name + ' with ' + this.addonService[i].dis_items[j].dis_percentage + '% discount') : ('Are you sure want to delete discount ' + this.addonService[i].dis_items[j].dis_name + ' with RM ' + this.addonService[i].dis_items[j].dis_percentage + ' discount') ,
      icon : 'info',
      heightAuto : false,
      showCancelButton : true,
      reverseButtons : true,
    }).then(a => {
      if(a['isConfirmed'])
      {
        this.http.post('https://api.nanogapp.com/deleteSalesPackageDiscount', {dis_id :  this.addonService[i].dis_items[j].dis_id}).subscribe(a => {
          console.log(a)
          this.refresher2(i)
        })
      }
    })
  }


  confirmPackageDiscount(){
    this.nav.pop()
  }
}
