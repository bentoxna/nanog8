import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-service-addon-list',
  templateUrl: './service-addon-list.page.html',
  styleUrls: ['./service-addon-list.page.scss'],
})
export class ServiceAddonListPage implements OnInit {

  uid = localStorage.getItem('nanogapp_uid') || ''
  sap
  sid
  tid
  lid

  wholeService = [] as any
  mainService = [] as any
  addonService = [] as any

  totalPrice = 0
  constructor(private http: HttpClient,
    private route: ActivatedRoute,
    private nav: NavController) { }

  ngOnInit() {
    // console.log(this.uid)
    this.route.queryParams.subscribe(a => {
      this.sap = a['sap']
      this.sid = a['sid']
      this.tid = a['tid']
      this.lid = a['lid']

      // console.log(this.sap)
      this.refresher()
    })
  }

  refresher(){
    this.http.post('https://api.nanogapp.com/getMainAndAddOnPackages', { sap_id: this.sap }).subscribe(a => {
      // console.log(a)
      this.wholeService = a['data']
      this.mainService = a['data'].filter(a => !a['addon_id'])
      this.addonService = a['data'].filter(a => a['addon_id'])
      
      this.totalPrice = this.wholeService.filter(a => a).map(b => b['total']).reduce((c,d) => c + d, 0)
    })
  }

  back() {
    this.nav.pop()
  }

  editService(x) {
    this.nav.navigateForward('services-edit?tid=' + this.tid + '&sid=' + this.sid + '&sap=' + x.sap_id + '&addon=' + this.mainService[0].sap_id +'&lid=' + this.lid + '&servicetype=' + (x.addon_id ? 'addon' : 'normal'))
  }

  editWarrantyService(x) {

  }

  deleteservice(i) {

  }

  addon() {
      this.nav.navigateForward('services-add?tid=' + this.tid + '&sid=' + this.sid + '&sapid=' + this.mainService[0].sap_id +'&lid=' + this.lid + '&servicetype=' + 'addon')
  }

  delete(i){
    // console.log(this.addonService[i])
    let delete_id = this.addonService[i].sap_id
    Swal.fire({
      text : 'Are you sure want to delete this packages?',
      icon : 'info',
      heightAuto : false,
      showCancelButton : true,
      reverseButtons : true,
    }).then(a => {
      if(a['isConfirmed'])
      {
        // deleteSalesPackage
        Swal.fire({
          text: 'Processing...',
          icon : 'info',
          heightAuto : false,
          showConfirmButton : false,
        })
        this.http.post('https://api.nanogapp.com/deleteSalesPackage', { 
        sap_id: delete_id,
        leadid : this.lid,
        aid : this.tid,
        uid : this.uid,
        servicetype : 'addon' 
      }).subscribe(a => {
          this.refresher()
          Swal.close()
        })

      }
    })
  }

}
