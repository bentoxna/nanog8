import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, ModalController, NavController, Platform, ToastController } from '@ionic/angular';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
// import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
import Swal from 'sweetalert2';
import * as EXIF from 'exif-js';
import { Injectable } from '@angular/core';
// import * as S3 from 'aws-sdk/clients/s3';
import * as pdfMake from "pdfmake/build/pdfmake";
import { File } from '@awesome-cordova-plugins/file/ngx';
// import { File } from '@awesome-cordova-plugins/file';
// import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { TermsAndConditionPage } from '../terms-and-condition/terms-and-condition.page';
import { TaskPaymentSignPage } from '../task-payment-sign/task-payment-sign.page';
declare let cordova: any;


@Component({
  selector: 'app-website-sign',
  templateUrl: './website-sign.page.html',
  styleUrls: ['./website-sign.page.scss'],
})
export class WebsiteSignPage implements OnInit {


  userid
  taskid
  salesid
  paymenttype

  user = [] as any
  appointment = [] as any
  paymentlog = [] as any
  totaldeposit = 0
  discounts = [] as any
  discount1
  discount2
  rate

  subtotal
  total

  minheightforfooter = (this.heighter() / 100 * 7) + 'px'
  marginbottomforcontent = (this.heighter() / 100 * 8) + 'px'

  deposit
  receipturl = []
  paymentmethod = ['Credit/Debit Card', 'Cash', 'Online Transfer', 'Cheques', 'Installment 6 months', 'Installment 12 month', 'Installment 24 month', 'Others'] as any
  selectedpaymentmethod
  paymentdropdownstatus = false
  paymentothers = ''
  paymentremark

  //pdf variable
  selectedFiles
  task
  pdffileurl = []
  pdffilename

  dpercentage: number = 0
  dnumber: number = 0
  deductprice
  subtotalstring
  totaldiscountdisplay

  discountPhoto
  discountPhotoStatus = false

  promocodedetail = [] as any

  termsAndCondition = false

  email
  validation
  errorMessage
  sales_packages: any;
  sales_packages_main: any;
  sales_packages_addon: any;
  service: any;
  sales_status: any;

  scafffee
  skyliftfee
  scaffnSkylift

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private platform: Platform,
    private actionSheetController: ActionSheetController,
    private camera: Camera,
    // private photoViewer: PhotoViewer,
    private nav: NavController,
    private file: File,
    // private fileOpener: FileOpener,
    private modal: ModalController,
    private toastController: ToastController) { }



  ngOnInit() {
    this.refresher()
  }

  platformType() {
    return this.platform.platforms()
  }


  refresher() {
    // this.route.queryParams.subscribe(a => {
    //   console.log(a)
    //   this.userid = a['uid']
    //   this.taskid = a['tid']
    //   this.paymenttype = a['type']

    //   this.http.post('https://api.nanogapp.com/getUserDetail', { uid: this.userid }).subscribe(res => {
    //     this.user = res['data']
    //     console.log(this.user)
    //   })
    //   this.http.post('https://api.nanogapp.com/getAppointmentDetails', { id: this.taskid }).subscribe(res => {
    //     this.appointment = res['data']

    //     this.promocodedetail.name = res['data']['promo_name']
    //     this.promocodedetail.id = res['data']['promo_id']
    //     this.promocodedetail.percentage = res['data']['promo_percent']

    //     this.http.post('https://api.nanogapp.com/checkPaymentLog', { sales_id: this.appointment.sales_id }).subscribe(res => {
    //       this.paymentlog = res['data']
    //       let tempPayment = this.paymentlog.filter(a => a['ac_approval'] != 'Rejected' && a['sc_approval'] != 'Rejected')
    //       console.log(this.paymentlog)
    //       for (let i = 0; i < tempPayment.length; i++) {
    //         this.totaldeposit = this.totaldeposit + tempPayment[i].total
    //       }
    //       console.log(this.totaldeposit)
    //       this.http.get('https://api.nanogapp.com/getActiveDiscount').subscribe(a => {
    //         this.discounts = a['data']
    //         console.log(this.discounts)
    //         if (this.promocodedetail.id) {
    //           console.log(this.promocodedetail)
    //           this.dpercentage = this.promocodedetail.percentage
    //           this.gettotal2()
    //         }
    //         else {
    //           console.log('here')
    //           this.dpercentage = 0
    //           this.dnumber = 0
    //           this.http.post('https://api.nanogapp.com/getAllSalesDiscount', { sales_id: this.salesid }).subscribe(a => {
    //             console.log(a)
    //             this.discountPhoto = a['data'].filter(b => b['type'] == true && b['need_photo'] == true && b['photo'].length < 1)
    //             this.discountPhoto.length > 0 ? this.discountPhotoStatus = true : this.discountPhotoStatus = false
    //             console.log(this.discountPhoto)
    //             console.log(this.discountPhotoStatus)
    //             a['data'].filter(b => b['type'] == true ? (b['status'] == true || b['status'] == null ? this.dpercentage += b['percentage'] : this.dpercentage = this.dpercentage) : this.dnumber += b['percentage'])
    //             console.log(this.dpercentage)
    //             console.log(this.dnumber)
    //             this.gettotal()
    //           })
    //         }
    //       })
    //       console.log(this.appointment)
    //     })
    //   })
    // })

    this.route.queryParams.subscribe(a => {
      console.log(a)
      this.userid = a['uid']
      this.taskid = a['tid']
      this.salesid = a['sid']
      this.paymenttype = a['type']

      this.http.post('https://api.nanogapp.com/getUserDetail', { uid: this.userid }).subscribe(res => {
        this.user = res['data']
        console.log(this.user)
      })

      this.http.post('https://api.nanogapp.com/getAppointmentDetails', { id: this.taskid }).subscribe(res => {
        console.log(res)
        this.appointment = res['data']
        this.promocodedetail.id = res['data']['promo_id']
        this.promocodedetail.percentage = res['data']['promo_percent']
        this.scafffee = res['data']['scaff_fee'] || 0
        this.skyliftfee = res['data']['skylift_fee'] || 0
        this.scaffnSkylift = this.scafffee + this.skyliftfee
        this.customersignimage = this.appointment.customer_signature

        this.http.post('https://api.nanogapp.com/checkPaymentLog', { sales_id: this.appointment.sales_id }).subscribe(res => {
          this.paymentlog = res['data']
          this.totaldeposit = 0
          res['data'].filter(a => (a['ac_approval'] != 'Rejected' && a['sc_approval'] != 'Rejected') ? this.totaldeposit += a['total'] : this.totaldeposit = this.totaldeposit)
          console.log(this.totaldeposit)

          this.http.get('https://api.nanogapp.com/getActiveDiscount').subscribe(a => {
            this.discounts = a['data']
            console.log(this.discounts)
            console.log(this.promocodedetail)
            if (this.promocodedetail.id) {
              console.log(this.promocodedetail)
              this.dpercentage = this.promocodedetail.percentage
              this.gettotal2()
            }
            else {
              console.log('here')
              this.dpercentage = 0
              this.dnumber = 0
              this.http.post('https://api.nanogapp.com/getAllSalesDiscount', { sales_id: this.salesid }).subscribe(a => {
                a['data'].filter(b => b['type'] == true ? (b['status'] == true || b['status'] == null ? this.dpercentage += b['percentage'] : this.dpercentage = this.dpercentage) : this.dnumber += b['percentage'])
                console.log(this.dpercentage, this.dnumber)
                this.gettotal()
              })
            }

          })

        })
      })


      this.http.post('https://api.nanogapp.com/getAppointmentDetails', { id: this.taskid }).subscribe((s) => {
        console.log(s['data'])
        this.appointment = s['data']
        this.sales_packages = s['data']['sales_packages']
        this.sales_packages_main = s['data']['sales_packages'].filter(a => !a['addon_id'])
        this.sales_packages_addon = s['data']['sales_packages'].filter(a => a['addon_id'])
        for (let i = 0; i < this.sales_packages_main.length; i++) {
          let temp = this.sales_packages_main[i].sap_id
          let temparr = [] as any
          this.sales_packages_main[i].sum_total = this.sales_packages.filter(a => a['addon_id'] == temp || a['sap_id'] == temp).map(b => b['total_after'] ? b['total_after'] : b['total']).reduce((c, d) => c + d, 0)
          temparr.push(this.sales_packages_addon.filter(a => a['addon_id'] == temp))
          this.sales_packages_main[i].addon_packages = temparr[0]
        }
      })
    })

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

    return new Date(parseInt(year), parseInt(month) - 1, parseInt(date), 0).getTime()
  }

  gettotal() {
    this.total = 0
    this.subtotal = 0
    this.deductprice = 0
    this.appointment.sales_packages.forEach(a => {
      a['total_after'] ? this.subtotal += a['total_after'] : this.subtotal += a['total']
      this.deductprice = this.subtotal * this.dpercentage / 100
    });

    if (this.appointment.sales_packages && this.appointment.sales_packages.length > 0 && this.dpercentage == 0 && this.dnumber == 0) {

      this.total = this.subtotal - this.totaldeposit + this.scaffnSkylift
    }
    else if (this.appointment.sales_packages && this.appointment.sales_packages.length > 0 && ((this.dpercentage != 0 || this.dnumber != 0) || (this.dpercentage != 0 && this.dnumber != 0))) {
      console.log('here')
      this.total = this.subtotal - this.deductprice - this.dnumber - this.totaldeposit + this.scaffnSkylift
    }

    this.deductprice = (this.deductprice / 100 * 100).toFixed(2)
    this.total = (this.total / 100 * 100).toFixed(2)
    this.subtotalstring = (this.subtotal / 100 * 100).toFixed(2)
    this.totaldiscountdisplay = (this.dpercentage / 100 * 100).toFixed(2)
    console.log(this.total, this.deductprice)
  }


  gettotal2() {
    this.total = 0
    this.subtotal = 0
    this.deductprice = 0
    this.appointment.sales_packages.forEach(a => {
      a['total_after'] ? this.subtotal += a['total_after'] : this.subtotal += a['total']
      this.deductprice = this.subtotal * this.dpercentage / 100
    });

    this.total = this.subtotal - this.deductprice - this.totaldeposit + this.scaffnSkylift

    this.deductprice = (this.deductprice / 100 * 100).toFixed(2)
    this.total = (this.total / 100 * 100).toFixed(2)
    this.subtotalstring = (this.subtotal / 100 * 100).toFixed(2)
    this.totaldiscountdisplay = (this.dpercentage / 100 * 100).toFixed(2)
  }


  heighter() {
    return this.platform.height()
  }

  async selectMedia() {
    const actionsheet = await this.actionSheetController.create({
      header: 'What would you like to add?',
      cssClass: 'custom-css',
      buttons: [
        {
          cssClass: 'actionsheet-selection',
          text: 'Upload from gallery',
          handler: () => {
            document.getElementById('uploadi2').click()
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
          cssClass: 'actionsheet-selection',
          text: 'Upload Pdf',
          handler: () => {
            document.getElementById('uploadpdf').click()
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

        this.http.post('https://api.nanogapp.com/upload', { image: base64, folder: 'nanog', userid: 'nanog' }).subscribe((res) => {
          this.receipturl.push(res['imageURL'])
          console.log(this.receipturl)
          resolve(res['imageURL'])
        }, awe => {
          reject(awe)
        })

        // this.http.post('https://api.imgbb.com/1/upload?expiration=0&key=c0f647e7fcbb11760226c50f87b58303', body.toString(), { headers, observe: 'response' }).subscribe(res => {
        //   this.receipturl = res['body']['data'].url
        //   resolve((res['body'])['data'].url)
        // }, awe => {
        //   reject(awe)
        // })

      }
      else {
        resolve('empty')
      }
    })
  }

  takePhoto() {
    const options: CameraOptions = {
      quality: 25,
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

  fileChange(event, maxsize) {
    return new Promise((resolve, reject) => {
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
            //   Swal.close()
            // this.receipturl = ((res['body']['data'].url))
            //   resolve((res['body'])['data'].url)
            // }, err => {
            //   alert(err)
            //   reject(err)
            // })

            this.http.post('https://api.nanogapp.com/upload', { image: this.imagec, folder: 'nanog', userid: 'nanog' }).subscribe((res) => {
              Swal.close()
              this.receipturl.push((res['imageURL']))
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

  viewPhoto(i) {
    this.nav.navigateForward('image-viewer?imageurl=' + this.receipturl[i])
  }

  removePhoto(i) {
    Swal.fire({
      text: 'Are you sure to delete this photo?',
      icon: 'info',
      heightAuto: false,
      showCancelButton: true,
      reverseButtons: true,
    }).then(a => {
      if (a['isConfirmed']) {
        this.receipturl.splice(i, 1)
      }
    })

  }

  // pay(x) {
  //   if (x == 'Deposit') {
  //     if(this.total <= 0)
  //     {
  //       Swal.fire({
  //         icon: 'info',
  //         title: 'Payment Completed',
  //         text: 'No need to pay more',
  //         heightAuto: false,
  //         timer: 1500
  //       })
  //     }
  //     else if (this.deposit == undefined || this.deposit == 0.0 || this.deposit == 0) {
  //       Swal.fire({
  //         icon: 'error',
  //         text: 'Please input deposit amount',
  //         heightAuto: false,
  //         timer: 1500
  //       })
  //     }
  //     else if(this.deposit > this.total)
  //     {
  //       Swal.fire({
  //         icon: 'error',
  //         text: 'Deposit cannot higher than Total Payment',
  //         heightAuto: false,
  //         timer: 1500
  //       })
  //     }
  //     else if (this.selectedpaymentmethod == undefined || this.selectedpaymentmethod == null || this.selectedpaymentmethod == '') {
  //       Swal.fire({
  //         icon: 'error',
  //         text: 'Please select a payment method',
  //         heightAuto: false,
  //         timer: 1500
  //       })
  //     }
  //     else if (this.selectedpaymentmethod == 'Others' && this.paymentothers == '') {
  //       Swal.fire({
  //         icon: 'error',
  //         text: 'Please enter payment method',
  //         heightAuto: false,
  //         timer: 1500
  //       })
  //     }
  //     else if (this.receipturl == undefined && this.pdffileurl == undefined) {
  //       Swal.fire({
  //         icon: 'error',
  //         text: 'Please upload receipt for this payment',
  //         heightAuto: false,
  //         timer: 1500
  //       })
  //     }
  //     else {
  //       Swal.fire(
  //         {
  //           text: 'Are you sure pay RM ' + this.deposit + ' as deposit?',
  //           heightAuto: false,
  //           showCancelButton: true,
  //           reverseButtons: true,
  //           icon: 'info',
  //         }
  //       ).then(res => {
  //         let payment_status
  //         if (res['isConfirmed'] == true) {
  //           if (this.selectedpaymentmethod != 'Others') {
  //             this.selectedpaymentmethod = this.selectedpaymentmethod
  //           }
  //           else if (this.selectedpaymentmethod == 'Others') {
  //             this.selectedpaymentmethod = this.paymentothers
  //           }
  //           this.deposit = (this.deposit / 100 * 100).toFixed(2)
  //           console.log(this.deposit)
  //           if (this.deposit >= this.total) {
  //             this.deposit = this.total
  //             x = 'Full Payment'
  //             payment_status = 'Deposited'
  //           }
  //           else {
  //             x = 'Deposit'
  //             payment_status = 'Fully Paid'
  //           }

  //           let link
  //           if(this.pdffileurl)
  //           {
  //             link = this.pdffileurl
  //           }
  //           else if(this.receipturl)
  //           {
  //             link = this.receipturl
  //           }
  //           this.http.post('https://api.nanogapp.com/updateSalesRemark', {
  //             remark: this.paymentremark,
  //             payment_date: this.now,
  //             sales_status: x,
  //             payment_status: payment_status,
  //             sales_id: this.appointment.sales_id,
  //             type: this.paymenttype,
  //             payment_image: link,
  //             total: this.deposit,
  //             created_by: this.userid,
  //             gateway: this.selectedpaymentmethod
  //           }).subscribe(res => {
  //             console.log(res)
  //             if (res['success'] == true) {
  //               this.nav.pop()
  //             }
  //             else if (res['success'] == false) {
  //               alert(res['error'])
  //             }
  //           })
  //         }
  //       })
  //     }
  //   }
  //   else if (x == 'Full Payment') {
  //     if(this.total <= 0)
  //     {
  //       Swal.fire({
  //         icon: 'info',
  //         title: 'Payment Completed',
  //         text: 'No need to pay more',
  //         heightAuto: false,
  //         timer: 1500
  //       })
  //     }
  //     else if (this.receipturl == undefined) {
  //       Swal.fire({
  //         icon: 'error',
  //         text: 'Please unpload receipt for this payment',
  //         heightAuto: false,
  //         timer: 1500
  //       })
  //     }
  //     else {
  //       Swal.fire(
  //         {
  //           text: 'Are you sure pay RM ' + this.total + ' as payment?',
  //           heightAuto: false,
  //           showCancelButton: true,
  //           reverseButtons: true,
  //           icon: 'info',
  //         }
  //       ).then(res => {
  //         if (res['isConfirmed'] == true) {
  //           this.http.post('https://api.nanogapp.com/updateSalesRemark', {
  //             remark: this.paymentremark,
  //             payment_date: this.now,
  //             sales_status: x,
  //             payment_status: 'Completed',
  //             sales_id: this.appointment.sales_id,
  //             type: this.paymenttype,
  //             payment_image: this.receipturl,
  //             total: this.total,
  //             created_by: this.userid,
  //             gateway: this.selectedpaymentmethod
  //           }).subscribe(res => {
  //             console.log(res)
  //             if (res['success'] == true) {
  //               this.nav.pop()
  //             }
  //             else if (res['success'] == false) {
  //               alert(res['error'])
  //             }
  //           })
  //         }
  //       })
  //     }
  //   }
  // }

  pay2() {
    this.deposit = (this.deposit / 100 * 100).toFixed(2)
    this.total = (this.total / 100 * 100).toFixed(2)
    let payment_status
    let sales_satus
    let total: number = +this.total
    let deposit: number = +this.deposit
    console.log(this.deposit, this.total)
    console.log(deposit, total)
    if (!this.appointment.customer_email) {
      Swal.fire({
        text: 'Enter customer email before make payment',
        icon: 'info',
        heightAuto: false,
        input: 'text',
        showCancelButton: true,
        reverseButtons: true,
      }).then(a => {
        if (a['isConfirmed']) {
          this.email = a['value']
          if (this.email == '') {
            this.validation = true
            this.errorMessage = "Please enter your email"
            // this.presentToast(this.errorMessage)
            Swal.fire({
              title: this.errorMessage,
              heightAuto: false,
              timer: 1500,
              confirmButtonText: 'Enter',
            }).then(a => {
              this.pay2()
            })
          }
          else if (this.email != '' && !this.emailValidator(this.email)) {
            this.validation = true
            this.errorMessage = "Wrong email format"
            Swal.fire({
              title: this.errorMessage,
              heightAuto: false,
              timer: 1500,
              confirmButtonText: 'Re-enter',
            }).then(a => {
              this.pay2()
            })
          }
          else {
            Swal.fire({
              text: 'Processing',
              icon: 'info',
              heightAuto: false,
              showConfirmButton: false,
            })
            this.http.post('https://api.nanogapp.com/updateLeadEmail', {
              email: a['value'],
              lead_id: this.appointment.lead_id,
            }).subscribe(res => {
              if (res['success'] == true) {
                this.refresher()
                Swal.fire({
                  text: 'Email has been updated',
                  icon: 'info',
                  heightAuto: false,
                  timer: 2000,
                }).then(() => {
                  this.pay2()
                })
              }
              // else if (res['success'] == false) {
              //   this.refresher()
              //   Swal.close()
              //   alert(res['error'])
              // }
            })
            console.log(this.email)
          }
        }
      })
    }
    else if (total <= 0) {
      Swal.fire({
        icon: 'info',
        title: 'Payment Completed',
        text: 'No need to pay more',
        heightAuto: false,
        timer: 1500
      })
    }
    else if (!deposit) {
      Swal.fire({
        icon: 'error',
        text: 'Please input deposit amount',
        heightAuto: false,
        timer: 1500
      })
    }
    else if (!this.selectedpaymentmethod) {
      Swal.fire({
        icon: 'error',
        text: 'Please select a payment method',
        heightAuto: false,
        timer: 1500
      })
    }
    else if (this.selectedpaymentmethod == 'Others' && this.paymentothers == '') {
      Swal.fire({
        icon: 'error',
        text: 'Please enter payment method',
        heightAuto: false,
        timer: 1500
      })
    }
    else if (!this.receipturl && !this.pdffileurl) {
      Swal.fire({
        icon: 'error',
        text: 'Please upload receipt for this payment',
        heightAuto: false,
        timer: 1500
      })
    }
    else if (deposit > total) {
      console.log(deposit, total)
      Swal.fire({
        text: 'Cannot pay more than total price',
        icon: 'error',
        heightAuto: false,
        timer: 1500,
      })
    }
    // else if (!this.termsAndCondition) {
    //   Swal.fire({
    //     text: 'Please tick to accept Terms And Conditions before make payment',
    //     icon: 'error',
    //     heightAuto: false,
    //     timer: 1500,
    //   })
    // }
    // else if (!this.customersignimage) {
    //   Swal.fire({
    //     text: 'Please let customer sign before make payment',
    //     icon: 'error',
    //     heightAuto: false,
    //     timer: 1500,
    //   })
    // }
    else {
      console.log(this.deposit, this.total, total)
      // if(deposit >= total)
      // {
      //   deposit = total
      //   sales_satus = 'Full Payment'
      //   payment_status = 'Fully Paid'
      // }
      // else if(this.deposit < total)
      // {
      deposit = deposit
      sales_satus = 'Deposit'
      payment_status = 'Deposited'
      // }
      console.log(sales_satus, payment_status)
      console.log(this.deposit, total)
      Swal.fire(
        {
          text: 'Are you sure pay RM ' + deposit + '?',
          heightAuto: false,
          showCancelButton: true,
          reverseButtons: true,
          icon: 'info',
        }
      ).then(res => {
        if (res['isConfirmed'] == true) {
          if (this.selectedpaymentmethod != 'Others') {
            this.selectedpaymentmethod = this.selectedpaymentmethod
          }
          else if (this.selectedpaymentmethod == 'Others') {
            this.selectedpaymentmethod = this.paymentothers
          }
          // let link
          // if (this.pdffileurl) {
          //   link = this.pdffileurl
          // }
          // else if (this.receipturl) {
          //   link = this.receipturl
          // }

          this.http.post('https://api.nanogapp.com/updateSalesRemark2', {
            remark: this.paymentremark,
            payment_date: new Date().getTime(),
            sales_status: sales_satus,
            payment_status: payment_status,
            sales_id: this.appointment.sales_id,
            type: this.paymenttype,
            // payment_image: link,
            receipt_img : JSON.stringify(this.receipturl || []),
            receipt_pdf : JSON.stringify(this.pdffileurl || []),
            total: deposit,
            created_by: this.userid,
            gateway: this.selectedpaymentmethod,
            leadid: this.appointment.lead_id,
            aid: this.taskid,
            cust_sign: this.customersignimage
          }).subscribe(res => {
            console.log(res)
            if (res['success'] == true) {
              // this.nav.navigateRoot('tab2-pending-approval')
              Swal.fire({
                title: 'Pay Successfully',
                icon: 'success',
                heightAuto: false,
                showConfirmButton: false,
                timer: 1500
              })
              this.nav.pop()
            }
            else if (res['success'] == false) {
              alert(res['error'])
            }
          })
        }
      })
    }
  }

  emailValidator(email) {
    if (email) {
      var re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    } else {
      return false;
    }
  }

  async presentToast(errorMessage) {
    const toast = await this.toastController.create({
      message: errorMessage,
      duration: 2000
    });
    toast.present();
  }

  getpaymentmethod(i) {
    console.log(this.paymentmethod[i])
    this.selectedpaymentmethod = this.paymentmethod[i]
    this.paymentdropdownstatus = false
  }

  showpaymentdropdown() {
    this.paymentdropdownstatus == true ? this.paymentdropdownstatus = false : this.paymentdropdownstatus = true
  }

  back() {
    this.nav.pop()
  }

  fileChangepdf(event) {
    Swal.fire({
      title: 'Processing...',
      icon: 'info',
      heightAuto: false,
      showConfirmButton: false
    })
    if (event.target.files && event.target.files.length > 0) {
      let temp = event.target.files
      for(let i = 0;  i < event.target.files.length; i++)
      {
        let tempfile = temp[i]
        this.toBase64(tempfile).then(data => {
          console.log('955',data)
          this.http.post('https://api.nanogapp.com/uploadReceiptPDF', { base64: data }).subscribe((link) => {
            Swal.close()
            this.pdffileurl.push(link['imageURL'])
          }, awe => {
            console.log(awe);
          })
        });
      }


    }
  }

  toBase64(blob) {
    return new Promise((resolve, rej) => {
      const reader = new FileReader();
      reader.onload = (a) => {
        resolve(reader.result)
      }
      reader.readAsDataURL(blob)
    });
  }

  removepdf(i) {
    Swal.fire({
      text: 'Are you sure to delete this pdf?',
      icon: 'info',
      heightAuto: false,
      showCancelButton: true,
      reverseButtons: true,
    }).then(a => {
      if (a['isConfirmed']) {
        this.pdffileurl.splice(i, 1)
      }
    })

  }

  downloadpdf(i) {
    window.open(this.pdffileurl[i], '_system')
    if (!window.open(this.pdffileurl[i], '_system')) {
      window.location.href = this.pdffileurl[i];
    }
  }

  changeTermAndConditionStatus() {
    this.appointment.termsncondition = true
    console.log(this.appointment.termsncondition)
    this.customersign()
  }

  async viewTermAndConditionDetail() {
    const modal = await this.modal.create({
      cssClass: 'termsAndConditionmodal',
      component: TermsAndConditionPage,
    })

    await modal.present()
  }

  fullPayment() {
    this.deposit = this.total
  }


  customersignimage

  async customersign() {
    const modal = await this.modal.create({
      cssClass: 'signaturemodal',
      component: TaskPaymentSignPage,
      componentProps: { uid: this.userid, sid: this.salesid }
    })

    await modal.present()


    modal.onDidDismiss().then(a => {
      if (a['data']) {
        this.customersignimage = a['data']
      }
    })
  }


  createsof(){
    this.nav.navigateForward('pdf-sales-order-form?uid=' + this.userid + '&tid=' + this.taskid + '&sid=' + this.salesid)
  }




}

