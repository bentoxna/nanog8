import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-task-discount-list',
  templateUrl: './task-discount-list.page.html',
  styleUrls: ['./task-discount-list.page.scss'],
})
export class TaskDiscountListPage implements OnInit {

  userid = localStorage.getItem('nanogapp_uid') || ''

  sales_packages = [] as any
  sales_packages_main = [] as any
  sales_packages_addon = [] as any
  taskid
  salesid
  dcustompercentage: number;
  custom: any;
  noncustom: any;
  discounts: any;

  constructor(private http: HttpClient,
    private route: ActivatedRoute,
    private nav : NavController) { }

  ngOnInit() {

    this.route.queryParams.subscribe(a => {
      this.taskid = a['tid']
      this.salesid = a['sid']
      // getSalesPackageDetails
      this.http.post('https://api.nanogapp.com/getSalesPackageDetails', { sales_id: this.salesid }).subscribe(s => {
        this.sales_packages = s['data']
        this.sales_packages_main = s['data'].filter(a => !a['addon_id'])
        this.sales_packages_addon = s['data'].filter(a => a['addon_id'])
        for (let i = 0; i < this.sales_packages_main.length; i++) {
          let temp = this.sales_packages_main[i].sap_id
          let temparr = [] as any
          this.sales_packages_main[i].sum_total = this.sales_packages.filter(a => a['addon_id'] == temp || a['sap_id'] == temp).map(b => b['total']).reduce((c, d) => c + d, 0)
          this.sales_packages_main[i].sum_total_after = this.sales_packages.filter(a => a['addon_id'] == temp || a['sap_id'] == temp).map(b => b['total_after'] ? b['total_after'] : b['total']).reduce((c, d) => c + d, 0)
          temparr.push(this.sales_packages_addon.filter(a => a['addon_id'] == temp))
          this.sales_packages_main[i].addon_packages = temparr[0]
        }

        console.log(this.sales_packages)
        console.log(this.sales_packages_main)
        console.log(this.sales_packages_addon)
      })


      // this.http.post('https://api.nanogapp.com/getAllSalesDiscount', {sales_id: this.salesid}).subscribe(a => {
      //   this.dcustompercentage = 0
      //     this.custom = a['data'].filter(a => a['discount_id'] == null)
      //     this.noncustom = a['data'].filter(a => a['discount_id'] != null)
      //     this.custom.filter(b => b['type'] == true ? ((b['status'] == true || b['status'] == null) ? this.dcustompercentage += b['percentage'] : this.dcustompercentage = this.dcustompercentage ) : this.dcustompercentage = this.dcustompercentage)
      //     console.log(this.dcustompercentage)
      //     console.log(this.custom)
      //     console.log(this.noncustom)

      //     this.http.get('https://api.nanogapp.com/getActiveDiscount').subscribe(a => {
      //       this.discounts = a['data']
      //       this.discounts.filter(a => this.noncustom.filter(b => a['id'] == b['discount_id'] ? ( b['status'] == true ? a['selected'] = true : a['selected'] = false) : (a['selected'] == null ? a['selected'] = false : a['selected'] = a['selected'])))
      //       console.log(this.discounts)
      //     })
      //  })

    })
  }

  back(){
    this.nav.pop()
  }

  getdiscount(i, j, x)
  {
    if(x == 'main')
    {
      console.log(this.sales_packages_main[i])
      this.nav.navigateForward('task-discount3?sapid=' + this.sales_packages_main[i].sap_id + '&tid=' + this.taskid + '&sid=' + this.salesid)
    }
    else if(x == 'addon')
    {
      console.log(this.sales_packages_main[i])
      this.nav.navigateForward('task-discount3?sapid=' + this.sales_packages_main[i].addon_packages[j].sap_id + '&tid=' + this.taskid + '&sid=' + this.salesid)
    }
  }

  getWholeDiscount(){
    this.nav.navigateForward('task-discount3?tid=' + this.taskid + '&sid=' + this.salesid)
  }


}
