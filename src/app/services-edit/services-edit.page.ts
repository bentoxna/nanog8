import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, ModalController, NavController, NavParams, Platform } from '@ionic/angular';
// import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
import Swal from 'sweetalert2';
import * as EXIF from 'exif-js';

import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { MediaCapture, MediaFile, MediaFileData, CaptureError } from '@awesome-cordova-plugins/media-capture/ngx';
import * as S3 from 'aws-sdk/clients/s3';

@Component({
  selector: 'app-services-edit',
  templateUrl: './services-edit.page.html',
  styleUrls: ['./services-edit.page.scss'],
})
export class ServicesEditPage implements OnInit {

  uid = localStorage.getItem('nanogapp_uid') || ''

  remove = false
  package_install = [] as any
  package_remove = [] as any

  sapid
  service = {} as any
  packages = [] as any
  filterpackage = [] as any
  selectedpackage = {} as any
  package = {} as any

  imageurl = [] as any
  videourl = [] as any

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

  allPackagesSubtotal = 0
  salesid
  index = 0
  leadid
  servicetype
  taskid

  warranty = [0,1,2,3,4,5]
  selectedwarranty

  constructor(private route: ActivatedRoute,
    // private navparam : NavParams,
    private http: HttpClient,
    private modal: ModalController,
    // private photoViewer : PhotoViewer,
    private actionSheetController: ActionSheetController,
    private mediaCapture: MediaCapture,
    private camera: Camera,
    private nav: NavController,
    private platform: Platform) { } true

  ngOnInit() {
    this.index = 0
    this.route.queryParams.subscribe(a => {
      this.sapid = a['sap']
      this.salesid = a['sid']
      this.leadid = a['lid']
      this.servicetype = a['servicetype']
      this.taskid = a['tid']

      // this.index = 0
      this.http.post('https://api.nanogapp.com/getSalesPackage', { sap_id: this.sapid }).subscribe(a => {
        this.service = a['data']
        console.log(this.service)
        // if(!a['data']['discount'])
        // {
        //   this.service.discount = 0
        //   this.otherpackage.discount = 0
        // }
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

        // if (this.service.sqft == 'others') {
        //   this.nonpackagestatus = true
        //   this.calculateothersubtotal()
        // }
        // else {
        //   this.nonpackagestatus = false
        //   this.calculateTotal()
        // }
        this.filterer(this.packages)
        this.imageurl && this.imageurl.length > 0 ? this.imageurl : this.imageurl = this.service.pack_image
        this.videourl && this.videourl.length > 0 ? this.videourl : this.videourl = this.service.pack_video

        console.log(this.imageurl)

        console.log(this.service)

        this.http.get('https://api.nanogapp.com/getPackages').subscribe(a => {
          console.log(a)
          this.packages = a['data']
          this.package_install = this.packages.filter(a => a['job_type'] == 'Install')
          this.package_remove = this.packages.filter(a => a['job_type'] == 'Remove')
          let findpackage = a['data'].findIndex(b => b['id'] == this.service.package_id)
          this.service.package = a['data'][findpackage]

        })


        this.http.get('https://api.nanogapp.com/getAllPlace').subscribe(a => {
          this.arealist = a['data']
          this.arealist.push({ name: 'others' })
        })

        this.http.post('https://api.nanogapp.com/getSalesPackageDetails', { sales_id: this.salesid }).subscribe(res => {
          console.log(res)
          res['data'].filter(a => a['sap_id'] == this.sapid ? this.allPackagesSubtotal = this.allPackagesSubtotal : this.allPackagesSubtotal += a['total'])
          // this.allPackagesSubtotal = res['data'].map(a => a['total']).reduce((a,b)=> a + b, 0)
          console.log(this.allPackagesSubtotal)
        })


        this.http.post('https://api.nanogapp.com/getMainAndAddOnPackagesJoinDiscount', { sap_id: this.sapid }).subscribe(a => {
          console.log(a)
          this.package = a['data'][0]
          console.log(this.package)
          if (this.package.dis_items) {
            this.ServiceCalculator()
          }
          else {
            this.package.aftertotal = this.package.total
            console.log(this.package.aftertotal)
          }
        })

      })
    })
  }

  ServiceCalculator() {
    return new Promise((resolve, reject) => {
      this.package.aftertotal = this.service.total
      console.log(this.package.dis_items)
      if (this.package.dis_items) {
        for (let j = 0; j < this.package.dis_items.length; j++) {
          if (this.package.dis_items[j].dis_type) {
            this.package.aftertotal = Number((this.package.aftertotal * (100 - this.package.dis_items[j].dis_percentage) / 100).toFixed(2))
            console.log(this.package.aftertotal)
          }
        }

        for (let j = 0; j < this.package.dis_items.length; j++) {
          if (!this.package.dis_items[j].dis_type) {
            this.package.aftertotal = Number((this.package.aftertotal - this.package.dis_items[j].dis_percentage).toFixed(2))
            console.log(this.package.aftertotal)
          }
        }
      }
      resolve(this.package.aftertotal)
    })
  }


  platformType() {
    return this.platform.platforms()
  }

  getservice(i) {
    this.service.services = this.servicelist[i]
    this.changesqftlist()
  }

  getarea(i) {
    if (i == 'others') {
      this.changesqftlist()
    }
    else {
      this.service.area = this.arealist[i]['name']
      this.changesqftlist()
    }
  }

  changesqftlist() {
    this.service.sqft = undefined
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
  }

  getsqft(i) {
    this.service.sqft = this.sizelist[i]
    this.filterer(this.packages)

    if (this.service.sqft == 'others') {
      this.nonpackagestatus = true
      this.service.package = null
    }
    else {
      this.nonpackagestatus = false
    }
    this.dropdown = true
  }

  calculateothersubtotal() {
    // if (this.service.size && this.service.rate && this.service.discount) {
    //   this.service.subtotal = (this.service.size * this.service.rate).toFixed(2)
    //   this.service.total = (this.service.subtotal).toFixed(2)
    // }
    // else if (this.service.size && this.service.rate) {
    //   this.service.subtotal = (this.service.size * this.service.rate).toFixed(2)
    //   this.service.total = (this.service.subtotal).toFixed(2)
    // }

    if (this.service.size && this.service.rate) {
      console.log(this.index)
      this.service.subtotal = (this.service.size * this.service.rate).toFixed(2)
      this.index > 1 ? this.service.total = this.service.subtotal : this.index++

      console.log(this.service.total)
    }

    console.log(this.service.subtotal, this.service.total)
    console.log(this.service)
  }

  // calculateothertotal() {

  //   this.otherpackage.total = (this.otherpackage.subtotal / 100 * (100 - this.otherpackage.discount)).toFixed(2)

  // }

  // calculateTotal() {
  //   console.log('run total')
  //   if (this.service.discount) {
  //         this.service.total = (this.service.subtotal * (100 - this.service.discount) / 100).toFixed(2)
  //       }
  //       else {
  //         this.service.total = (this.service.subtotal).toFixed(2)
  //       }

  //   console.log(this.service.total, this.service.subtotal)
  // }


  // calculateTotal(x) {
  // if(x == 'packages')
  // {
  //   if (this.service.discount) {
  //     this.service.total = (this.service.subtotal * (100 - this.service.discount) / 100).toFixed(2)
  //     this.service.total = (this.service.total - this.service.discount_roundoff).toFixed(2)
  //   }
  //   else {
  //     this.service.total = (this.service.subtotal).toFixed(2)
  //     this.service.total = (this.service.total - this.service.discount_roundoff).toFixed(2)
  //   }
  // }
  // else if(x == 'others')
  // {
  //   this.service.total = (this.service.subtotal / 100 * (100 - this.service.discount)).toFixed(2)
  //   this.service.total = (this.service.total - this.service.discount_roundoff).toFixed(2)
  // }

  //   console.log(this.service)

  // }

  dropdownlist() {
    this.dropdown ? this.dropdown = false : this.dropdown = true
  }

  back() {
    // this.modal.dismiss()
    this.index = 0
    this.nav.pop()
  }

  getpackage(x) {
    this.dropdown = false
    this.service.package = x
    this.nonpackagestatus = false
    this.service.subtotal = this.service.package.amount
    this.service.total = (this.service.subtotal).toFixed(2)
  }

  nonpackage() {
    if (this.service.services && this.service.area) {
      this.dropdown = true
      this.nonpackagestatus = true
      this.service.sqft = 'others'
    }
  }

  // viewPhoto(i)
  // {
  //   this.photoViewer.show(this.imageurl[i], ('Photo' + (i + 1)))
  // }


  viewPhoto(i) {
    this.nav.navigateForward('image-viewer?imageurl=' + this.imageurl[i])
  }

  removePhoto(i) {
    this.sweetalert = true
    Swal.fire({
      title: 'Are you sure want to delete this photo?',
      heightAuto: false,
      showCancelButton: true,
      reverseButtons: true
    }).then(a => {
      if (a['isConfirmed']) {
        this.imageurl.splice(i, 1)
        this.sweetalert = false
      }
      else if (a['isDismissed']) {
        this.sweetalert = false
      }
    })
  }

  confirm() {
    this.sweetalert = true
    if (!this.service.services) {
      Swal.fire(
        {
          icon: 'warning',
          text: 'Please choose a service',
          heightAuto: false,
          timer: 2000,
        }
      ).then(() => {
        this.sweetalert = false
      })
    }
    else if (!this.service.area) {
      Swal.fire({
        icon: 'warning',
        text: 'Please choose an area',
        heightAuto: false,
        timer: 2000,
      })
    }
    else if (this.service.area == 'others' && !this.service.other_area) {
      Swal.fire({
        icon: 'warning',
        text: 'Please insert your area',
        heightAuto: false,
        timer: 2000
      })
    }
    else if (!this.service.sqft) {
      Swal.fire({
        icon: 'warning',
        text: 'Please select your sqft',
        heightAuto: false,
        timer: 2000
      })
    }
    else if ((this.service.sqft == 'others' || this.nonpackagestatus) && !this.service.size) {
      Swal.fire({
        icon: 'warning',
        text: 'Please insert yout size',
        heightAuto: false,
        timer: 2000
      })
    }
    else if ((this.service.sqft == 'others' || this.nonpackagestatus) && !this.service.rate) {
      Swal.fire({
        icon: 'warning',
        text: 'Please insert yout rate',
        heightAuto: false,
        timer: 2000
      })
    }
    else if (!this.nonpackagestatus && !this.service.package) {
      Swal.fire({
        icon: 'warning',
        text: 'Please choose a package or press non package button',
        heightAuto: false,
        timer: 2000
      })
    }
    else if (!this.nonpackagestatus && this.service.discount > 100) {
      Swal.fire({
        icon: 'warning',
        text: 'The discount value cannot more than 100',
        heightAuto: false,
        timer: 2000
      })
    }
    else if (this.nonpackagestatus && this.service.discount > 100) {
      Swal.fire({
        icon: 'warning',
        text: 'The discount value cannot more than 100',
        heightAuto: false,
        timer: 2000
      })
    }
    else if (this.nonpackagestatus && this.service.subtotal <= 0) {
      Swal.fire({
        icon: 'warning',
        text: 'Something went wrong, kindly check carefully',
        heightAuto: false,
        timer: 2000
      })
    }
    else {
      let temp = this.service
      Swal.fire(
        {
          icon: 'info',
          text: 'Package with RM ' + this.service.total + ' will be updated',
          heightAuto: false,
          showCancelButton: true,
          reverseButtons: true
        }
      ).then(a => {
        this.ServiceCalculator()
        console.log(this.package)

        if (a['isConfirmed'] == true) {
          this.http.post('https://api.nanogapp.com/updateSalesPackagev2', {
            sap_id: this.sapid,
            sales_id: this.salesid,
            width: this.service.width || null,
            height: this.service.height || null,
            image: JSON.stringify(this.imageurl) || JSON.stringify([]),
            video: JSON.stringify(this.videourl) || JSON.stringify([]),
            remark: this.service.remark,
            package_id: this.nonpackagestatus ? null : this.service.package.id,
            sub_total: this.service.subtotal,
            total: this.service.total,
            total_total: (this.allPackagesSubtotal + parseFloat(this.service.total)),
            discount: this.service.discount,
            package_warranty : this.service.package_warranty ? this.service.package_warranty : 0,

            service: this.service.services,
            area: this.service.area,
            sqft: this.service.sqft,
            size: this.nonpackagestatus ? this.service.size : null,
            rate: this.nonpackagestatus ? this.service.rate : null,
            other_area: this.service.area == 'others' ? this.service.other_area : null,
            discount_roundoff: this.service.discount_roundoff,

            total_after: this.package.aftertotal,
            leadid: this.leadid,
            aid: this.taskid,
            uid: this.uid,
            servicetype: this.servicetype
          }).subscribe(a => {
            if (a['success']) {
              Swal.fire(
                {
                  title: 'Add Successfully',
                  icon: 'success',
                  heightAuto: false,
                  timer: 2000,
                }
              )
              // this.modal.dismiss('success')
              this.nav.pop()
            }
            else if (!a['success']) {
              Swal.fire(
                {
                  title: 'Something went Wreong',
                  text: 'Failed to Add',
                  icon: 'error',
                  heightAuto: false,
                  timer: 2000,
                }
              )
              this.sweetalert = false
            }
            else {
              Swal.fire(
                {
                  title: 'Something went Wreong',
                  text: 'Failed to Add',
                  icon: 'error',
                  heightAuto: false,
                  timer: 2000,
                }
              )
              this.sweetalert = false
            }
          })
        }
        else {
          this.sweetalert = false
        }
      })
    }
  }

  async selectMedia() {
    const actionsheet = await this.actionSheetController.create({
      header: 'What would you want to add?',
      cssClass: 'custom-css',
      buttons: [
        {
          cssClass: 'actionsheet-selection',
          text: 'Upload from gallery',
          handler: () => {
            document.getElementById('uploadlabel').click()
          }
        },
        {
          cssClass: 'actionsheet-selection',
          text: 'Capture Image',
          handler: () => {
            console.log('Capture Image')
            this.captureImage()
          }
        },
        // {
        //   cssClass: 'actionsheet-selection',
        //   text: 'Record Video',
        //   handler: () => {
        //     console.log('Record Video')
        //     this.recordVideo()
        //   }
        // },
        {
          cssClass: 'actionsheet-cancel',
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    await actionsheet.present()
  }


  uploadserve2(image) {
    return new Promise((resolve, reject) => {
      this.sweetalert = true
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
        //   this.imageurl.push(res['body']['data'].url)
        //   resolve((res['body'])['data'].url)
        // }, awe => {
        //   reject(awe)
        // })

        this.http.post('https://api.nanogapp.com/upload', { image: base64, folder: 'nanog', userid: 'nanog' }).subscribe((res) => {
          this.imageurl.push(res['imageURL'])
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


  captureImage() {
    const options: CameraOptions = {
      quality: 25,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetHeight: 1000,
      targetWidth: 600,
      correctOrientation: true,
      saveToPhotoAlbum: true
    }

    this.camera.getPicture(options).then((imageData) => {
      this.sweetalert = true
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.uploadserve2(base64Image).then(res => {
        this.sweetalert = false
        // Swal.fire({
        //   title: 'Done',
        //   icon: 'success',
        //   heightAuto: false,
        //   timer: 500,
        //   showConfirmButton: false,
        // })
        Swal.close()
        console.log(res)
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
      this.sweetalert = true
      const files = event.target.files;

      for (let i = 0; i < files.length; i++) {
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

            console.log(a);
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
            this.base64img = imgarr[1];
            event.target.value = '';

            const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
            let body = new URLSearchParams()
            body.set('image', this.base64img)


            // this.http.post('https://api.imgbb.com/1/upload?expiration=0&key=c0f647e7fcbb11760226c50f87b58303', body.toString(), { headers, observe: 'response' }).subscribe(res => {
            //   this.imageurl.push(res['body']['data'].url)
            //   this.sweetalert = false
            //   resolve((res['body'])['data'].url)
            // }, err => {
            //   alert(err)
            //   reject(err)
            // })

            this.http.post('https://api.nanogapp.com/upload', { image: this.imagec, folder: 'nanog', userid: 'nanog' }).subscribe((res) => {
              this.imageurl.push(res['imageURL'])
              this.sweetalert = false
              Swal.close()
              resolve(res['imageURL'])
            }, awe => {
              reject(awe)
            })

            // this.uploadToImgur(this.base64img, this.lengthof(this.benefit['photo']) - 1);

            // this.http.post('https://img.vsnap.my/upload', { image: this.imagec, folder: 'hockwong', userid: '5KLVpP3MdneiM1kgcHR26LGFSW52' }).subscribe((link) => {


            //   console.log(link['imageURL'])
            //   this.imageurl.push(link['imageURL'])

            // })

          };
          thisImage.src = URL.createObjectURL(event.target.files[i]);
          // });
        }
      }
    })
  }

  recordVideo() {
    this.mediaCapture.captureVideo().then(
      (data: MediaFile[]) => {
        if (data.length > 0) {
          this.copyFileToLocalDir(data[0].fullPath);
          console.log(data)
        }
      },
      (err: CaptureError) => alert(err)
    );
  }

  copyFileToLocalDir(f) {

  }


  setsqft() {
    if ((this.service.height == undefined || this.service.height == null) && (this.service.height == undefined || this.service.width == null)) {
      this.dropdownitemstatus = false
    }
    else {
      let sqft = this.service.height * this.service.width
      this.filterpackage = this.packages.filter(a => (sqft > a['min_sqft']) && (sqft <= a['max_sqft']))
      for (let i = 0; i < this.filterpackage.length; i++) {
        this.filterpackage[i].detailstatus = false
      }
      this.dropdownitemstatus = true
      this.dropdown = true
    }
  }

  async getdropdownitemdetail(i) {
    if (this.packages[i].detailstatus == true) {
      for (let i = 0; i < this.packages.length; i++) {
        this.packages[i].detailstatus = false
      }
    }
    else if (this.packages[i].detailstatus == false) {
      for (let i = 0; i < this.packages.length; i++) {
        this.packages[i].detailstatus = false
      }
      this.packages[i].detailstatus = true
      this.selectedpackage = this.packages[i]
    }
  }



  filterer(x) {
    if (this.service.services && this.service.sqft && this.service.area && this.remove == false) {
      let temp = this.package_install.filter(a => a['service'].toLowerCase() == this.service.services.toLowerCase()
        && a['sqft'].toLowerCase() == this.service.sqft.toLowerCase())
      return temp
    }
    else if (this.service.services && this.service.sqft && this.service.area && this.remove == true) {
      let temp = this.package_remove.filter(a => a['service'].toLowerCase() == this.service.services.toLowerCase()
        && a['sqft'].toLowerCase() == this.service.sqft.toLowerCase())
      return temp
    }
  }


  async selectMedia2() {
    const actionsheet = await this.actionSheetController.create({
      header: 'What would you want to add?',
      cssClass: 'custom-css',
      buttons: [
        {
          cssClass: 'actionsheet-selection',
          text: 'Upload Video',
          handler: () => {
            document.getElementById('uploadlabel2').click()
          }
        },
        // {
        //   cssClass: 'actionsheet-selection',
        //   text: 'Record Video',
        //   handler: () => {
        //     console.log('Record Video')
        //     this.recordVideo()
        //   }
        // },
        {
          cssClass: 'actionsheet-cancel',
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    await actionsheet.present()
  }


  uploadFile(event) {
    let uploadedFile = event.target.files;

    // console.log(uploadedFile)
    // console.log(uploadedFile.item(0))
    this.uploadToS3(uploadedFile.item(0))
  }

  uploadToS3(file) {
    Swal.fire({
      title: "Uploading",
      text: "Thank You for Your Patient...",
      heightAuto: false,
      icon: 'info',
      showConfirmButton: false,
    })

    const bucket = new S3({
      accessKeyId: "AKIA4FJWF7YCVSZJKLFE",
      secretAccessKey: "vDCeKG0BG1SawYkngWg5l4ldLZtD1/1fUn6NCDhr",
      region: 'ap-southeast-1',
      signatureVersion: 'v4'
    })

    const params = {
      Bucket: 'nanogbucket',
      Key: 'video name:' + file.name,
      Body: file
    }

    bucket.upload(params, (err, data) => {
      console.log(data)
      if (err) {

        Swal.close()

        Swal.fire({
          title: "Something Wrong",
          text: "Please try again later",
          icon: 'error',
          timer: 2000,
          heightAuto: false,
          showConfirmButton: false,
        })
        console.log('There was an error uploading file: ' + err)
        return false
      }


      Swal.close()

      console.log('Successfully uploaded file.', data)

      // console.log(i)
      console.log(data);

      this.videourl.push(
        {
          link: data.Location,
          filename: file.name
        }
      )

      // this.videourl.link[i].link = data.Location
      // this.videourl.link[i].filename = file.name
      return true
    })

  }

  removeVideo(i) {
    Swal.fire({
      title: 'Are you sure want to delete this video?',
      heightAuto: false,
      showCancelButton: true,
      reverseButtons: true
    }).then(a => {
      if (a['isConfirmed']) {
        this.videourl.splice(i, 1)
      }
      else if (a['isDismissed']) {
      }
    })
  }


  changeToRemove() {
    this.remove = !this.remove
    this.dropdown = true
  }


}
