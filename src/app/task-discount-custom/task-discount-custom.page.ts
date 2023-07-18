import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, Platform } from '@ionic/angular';
import Swal from 'sweetalert2';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-task-discount-custom',
  templateUrl: './task-discount-custom.page.html',
  styleUrls: ['./task-discount-custom.page.scss'],
})
export class TaskDiscountCustomPage implements OnInit {

  userid = localStorage.getItem('nanogapp_uid') || ''
  sapid
taskid
salesid
totalprice 
photoornot = false
percentage = true
custom = {} as any

dpercentage
dnumber

package = {} as any
packagediscountitem = [] as any

  constructor(private modal : ModalController,
    private navparams : NavParams,
    private http : HttpClient,
    private platform : Platform) { }

  ngOnInit() {
    this.taskid = this.navparams.get('tid')
    this.salesid = this.navparams.get('sid')
    this.sapid = this.navparams.get('sapid') ? this.navparams.get('sapid') : null
    console.log(this.sapid, this.taskid, this.salesid)
    // this.http.post('https://api.nanogapp.com/getAppointmentDetails', { id: this.taskid }).subscribe((s) => { 
    //   console.log(s)
    //   this.totalprice = s['data']['sales_packages'].map(a => a['total']).reduce((a,b) => a + b, 0)  
    //   console.log(this.totalprice)
    // }) 

    this.http.post('https://api.nanogapp.com/getAllSalesDiscount', {sales_id: this.salesid}).subscribe(a => { 
      this.dpercentage = 0
      this.dnumber = 0
      a['data'].filter(b => b['type'] == true ? ((b['status'] == true || b['status'] == null) ? this.dpercentage += b['percentage'] : this.dpercentage = this.dpercentage ) : this.dnumber += b['percentage'])
    })

    this.http.post('https://api.nanogapp.com/getMainAndAddOnPackagesJoinDiscount', { sap_id: this.sapid }).subscribe(a => {
      console.log(a)
      this.package = a['data'][0]
      console.log(this.package)
      if(this.package && this.package.dis_items)
      {
        this.ServiceCalculator()
      }
      else if(this.package && !this.package.dis_items)
      {
        this.package.aftertotal = this.package.total
        console.log(this.package.aftertotal)
      }
    })

  }

  ServiceCalculator(){
      return new Promise((resolve, reject) => {
        this.package.aftertotal = this.package.total
        console.log(this.package.dis_items)
        if(this.package.dis_items)
        {
          for(let j = 0 ; j < this.package.dis_items.length; j++)
          {
            if(this.package.dis_items[j].dis_type)
            {
              this.package.aftertotal = Number((this.package.aftertotal * (100 - this.package.dis_items[j].dis_percentage) / 100).toFixed(2))
              console.log(this.package.aftertotal)
            }
          }
    
          for(let j = 0 ; j < this.package.dis_items.length; j++)
          {
            if(!this.package.dis_items[j].dis_type)
            {
              this.package.aftertotal = Number((this.package.aftertotal - this.package.dis_items[j].dis_percentage).toFixed(2))
              console.log(this.package.aftertotal)
            }
          }
        }

        resolve(this.package.aftertotal)
      })
  }

  ServiceCalculator2(){
    return new Promise((resolve, reject) => {
      if(this.package.dis_items){
        this.package.dis_items.push({
          dis_name : this.custom.name, 
          dis_remark : this.custom.remark, 
          dis_percentage : this.custom.haoma, 
          need_photo : this.photoornot ? true : false, 
          dis_id : 0,
          dis_type : this.percentage ? true : false,
        })
      }
      else{
        this.package.dis_items = []
        this.package.dis_items.push({
          dis_name : this.custom.name, 
          dis_remark : this.custom.remark, 
          dis_percentage : this.custom.haoma, 
          need_photo : this.photoornot ? true : false, 
          dis_id : 0,
          dis_type : this.percentage ? true : false,
        })
      }

      this.package.aftertotal = this.package.total
      console.log(this.package.dis_items)
      if(this.package.dis_items)
      {
        for(let j = 0 ; j < this.package.dis_items.length; j++)
        {
          if(this.package.dis_items[j].dis_type)
          {
            this.package.aftertotal = Number((this.package.aftertotal * (100 - this.package.dis_items[j].dis_percentage) / 100).toFixed(2))
            console.log(this.package.aftertotal)
          }
        }
  
        for(let j = 0 ; j < this.package.dis_items.length; j++)
        {
          if(!this.package.dis_items[j].dis_type)
          {
            this.package.aftertotal = Number((this.package.aftertotal - this.package.dis_items[j].dis_percentage).toFixed(2))
            console.log(this.package.aftertotal)
          }
        }
      }

      resolve(this.package.aftertotal)
    })
}

  platformType(){
    return this.platform.platforms()
  }

  photoOrNot(){
    this.photoornot = !this.photoornot
  }

  percentageOrNumber(x){
    x == 'percentage' ? this.percentage = true : this.percentage = false
  }

  cancel(){
    this.modal.dismiss()
  }

  createcustomdiscount(){
    if(!this.custom.name || !this.custom.haoma)
    {
      Swal.fire({
        text: 'Please fill in all the item',
        icon: 'error',
        heightAuto: false,
        timer: 1500
      })
    }
    else if(this.percentage ? this.custom.haoma > 100 : null)
    {
      Swal.fire({
        text: 'The percentage of discount cannot higher than 100',
        icon: 'error',
        heightAuto: false,
        timer: 1500
      })
    }
    else if(this.percentage == true && this.custom.haoma + (this.dpercentage || 0) > 100 )
    {
      Swal.fire({
        text: 'Total Discount cannot higher than 100%',
        icon: 'error',
        heightAuto: false,
        timer: 1500,
      })
    }
    else
    {
      Swal.fire({
        text: 'Are you sure to create this discount?',
        icon: 'info',
        heightAuto: false,
        showCancelButton: true,
        reverseButtons: true,
      }).then(a => {
        if(a['isConfirmed'])
        {
          Swal.fire({
            text: 'Processing...',
            icon:'info',
            heightAuto: false, 
            showConfirmButton: false,
          })
          // AddNewSalesPackageDiscountWritten
          if(this.sapid)
          {
            this.ServiceCalculator2().then(a => {
              console.log(a)
              this.http.post('https://api.nanogapp.com/AddNewSalesPackageDiscountWritten', {
                name : this.custom.name, 
                remark : null,
                percentage : this.custom.haoma, 
                need_photo : false, 
                sapid : this.sapid, 
                discount_id : null,
                type : this.percentage ? true : false,
                total_after : this.package.aftertotal,
              }).subscribe(a => {
                Swal.close()
                this.modal.dismiss('done')
               })
            })

          }
          else if(!this.sapid)
          {
            console.log('run here for discount?')
            this.http.post('https://api.nanogapp.com/AddNewSalesDiscountWritten', {
              name : this.custom.name, 
              remark : null,
              percentage : this.custom.haoma, 
              need_photo : this.photoornot ? true : false, 
              sales_id : this.salesid, 
              discount_id : null,
              type : this.percentage ? true : false,
            }).subscribe(a => {
              Swal.close()
              this.modal.dismiss('done')
             })
          }

        }
      })

    }
  }

}
