import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, ModalController, NavController, NavParams, Platform } from '@ionic/angular';
// import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
import Swal from 'sweetalert2';
import * as EXIF from 'exif-js';

import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { MediaCapture, MediaFile, MediaFileData, CaptureError } from '@awesome-cordova-plugins/media-capture/ngx';

@Component({
  selector: 'app-services-view',
  templateUrl: './services-view.page.html',
  styleUrls: ['./services-view.page.scss'],
})
export class ServicesViewPage implements OnInit {


  sapid
  service = {} as any
  packages = [] as any
  filterpackage = [] as any
  selectedpackage = {} as any
  package = {} as any

  imageurl
  video

  dropdown = false
  dropdownitemstatus = false

  sweetalert = false
  filterword

  servicelist = ['Waterproofing', 'Anti-slip', 'WP & AS']
  arealist = [] as any
  sizelist = [] as any
  othersize
  packagelist = ['Baisc', 'Standard', 'Premium']
  packageselected = {} as any
  otherarea
  nonpackagestatus = false
  otherpackage = {} as any

  constructor(private route: ActivatedRoute,
    private http: HttpClient,
    private nav: NavController,
    private platform: Platform) { }

  ngOnInit() {

    this.route.queryParams.subscribe(a => {
      this.sapid = a['sap']


      this.http.post('https://api.nanogapp.com/getSalesPackage', { sap_id: this.sapid }).subscribe(a => {
        this.service = a['data']
        this.otherpackage = a['data']
        a['data']['size'] ? this.nonpackagestatus = true : this.nonpackagestatus = false
        if (this.service.services && this.service.area) {
          if (this.service.services.toLowerCase() == 'waterproofing' && this.service.area.toLowerCase() == 'bathroom') {
            this.sizelist = ['0-80', '81-120', '121-200', 'others']
          }
          else if (this.service.services.toLowerCase() == 'anti-slip' && this.service.area.toLowerCase() == 'bathroom') {
            this.sizelist = ['0-50', '51-100', '101-150', 'others']
          }
          else {
            this.sizelist = ['0-100', '101-200', '201-300', '301-400', '401-500', 'others']
          }
        }
        if (this.service.sqft == 'others') {
          this.nonpackagestatus = true
          this.calculateothersubtotal()
        }
        else {
          this.nonpackagestatus = false
          this.calculateTotal()
        }
        this.filterer(this.packages)

        // console.log(this.service, this.otherpackage)

        this.imageurl = this.service.pack_image
        // console.log(this.imageurl)

        this.http.get('https://api.nanogapp.com/getPackages').subscribe(a => {
          this.packages = a['data']
          // console.log(this.packages)
          // console.log(this.service)
          // console.log(this.service.package_id)
          let findpackage = a['data'].findIndex(b => b['id'] == this.service.package_id)
          // console.log(findpackage)
          this.service.package = a['data'][findpackage]
          // console.log(this.service.package)
        })


        this.http.get('https://api.nanogapp.com/getAllPlace').subscribe(a => {
          this.arealist = a['data']
          this.arealist.push({ name: 'others' })
          // console.log(this.arealist)

        })
      })
    })
  }

  calculateothersubtotal() {
    if (this.otherpackage.size && this.otherpackage.rate && this.otherpackage.discount) {
      this.otherpackage.subtotal = (this.otherpackage.size * this.otherpackage.rate).toFixed(2)
      this.calculateothertotal()
    }
    else if (this.otherpackage.size && this.otherpackage.rate) {
      this.otherpackage.subtotal = (this.otherpackage.size * this.otherpackage.rate).toFixed(2)
      this.otherpackage.total = this.otherpackage.subtotal
    }
  }

  calculateothertotal() {
    this.otherpackage.total = (this.otherpackage.subtotal / 100 * (100 - this.otherpackage.discount)).toFixed(2)
  }


  calculateTotal() {
    if (this.service.discount) {
      this.service.total = (this.service.subtotal * (100 - this.service.discount) / 100).toFixed(2)
    }
    else {
      this.service.total = (this.service.subtotal).toFixed(2)
    }
    // console.log(this.service.total, this.service.subtotal)
  }
  
  platformType() {
    return this.platform.platforms()
  }

  back() {
    this.nav.pop()
  }

  viewPhoto(i) {
    this.nav.navigateForward('image-viewer?imageurl=' + this.imageurl[i])
  }

  // removePhoto(i) {
  //   this.sweetalert = true
  //   Swal.fire({
  //     title: 'Are you sure want to delete this photo?',
  //     heightAuto: false,
  //     showCancelButton: true,
  //     reverseButtons: true
  //   }).then(a => {
  //     if (a['isConfirmed']) {
  //       this.imageurl.splice(i, 1)
  //       this.sweetalert = false
  //     }
  //     else if (a['isDismissed']) {
  //       this.sweetalert = false
  //     }
  //   })
  // }


  filterer(x) {
    // console.log(this.service.services && this.service.sqft && this.service.area)
    if (this.service.services && this.service.sqft && this.service.area) {
      let temp = this.packages.filter(a => a['service'].toLowerCase() == this.service.services.toLowerCase()
        && a['sqft'].toLowerCase() == this.service.sqft.toLowerCase())
      // console.log(temp)
      return temp
    }
  }
}
