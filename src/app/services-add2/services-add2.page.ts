import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController, NavController, NavParams, Platform } from '@ionic/angular';
// import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { MediaCapture, MediaFile, MediaFileData, CaptureError } from '@awesome-cordova-plugins/media-capture/ngx';
// import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
// import * as S3 from 'aws-sdk/clients/s3';
// import { S3 } from 'aws-sdk';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

import { Plugins } from '@capacitor/core';
const { Camera } = Plugins;


@Component({
  selector: 'app-services-add2',
  templateUrl: './services-add2.page.html',
  styleUrls: ['./services-add2.page.scss'],
})
export class ServicesAdd2Page implements OnInit {

  uid = localStorage.getItem('nanogapp_uid') || ''

  packages = [] as any
  package_install = [] as any
  package_remove = [] as any

  remove = false
  filterpackage = [] as any
  selectedpackage = {} as any
  service = {} as any

  imagelink
  imageurl = [] as any
  videourl = [] as any
  dropdown = false
  dropdownitemstatus = false

  files: FileList;
  public testup(event) {
    this.files = event.target.files;
    // console.log(this.files)
  }

  taskid
  salesid
  sapid = 0
  leadid
  servicetype


  allPackagesSubtotal = 0

  sweetalert = false

  servicelist = ['Waterproofing', 'Anti-slip', 'Waterproofing & Anti-slip']
  servicedropdown = false
  arealist = [] as any
  areadropdown = false
  sizelist = [] as any
  sizedropdown = false
  othersize
  packagelist = ['Baisc', 'Standard', 'Premium']
  packagedropdown = false
  packageselected = {} as any
  nonpackagestatus = false
  otherpackage = {} as any


  warranty = [0, 1, 2, 3, 4, 5, 6, 7]
  selectedwarranty


  constructor(
    private http: HttpClient,
    private actionSheetController: ActionSheetController,
    // private camera: Camera,
    private mediaCapture: MediaCapture,
    private nav: NavController,
    private modal: ModalController,
    private route: ActivatedRoute,
    private platform: Platform) { }

  ngOnInit() {
    this.route.queryParams.subscribe(a => {
      this.taskid = a['tid']
      this.salesid = a['sid']
      this.sapid = a['sapid']
      this.leadid = a['lid']
      this.servicetype = a['servicetype']

      // console.log(this.sapid)

      this.service['discount_roundoff'] = 0
      this.service['package_warranty'] ? this.service['package_warranty'] : this.service['package_warranty'] = 1
      // console.log(this.service)
      this.http.get('https://api.nanogapp.com/getPackages').subscribe(a => {
        this.packages = a['data']
        for (let i = 0; i < this.packages.length; i++) {
          this.packages[i].detailstatus = false
        }

        this.package_install = this.packages.filter(a => a['job_type'] == 'Install')
        this.package_remove = this.packages.filter(a => a['job_type'] == 'Remove')
      })

      this.http.get('https://api.nanogapp.com/getAllPlace').subscribe(a => {
        this.arealist = a['data']
        this.arealist.push({ name: 'others' })
      })
    })

    this.http.post('https://api.nanogapp.com/getSalesPackageDetails', { sales_id: this.salesid }).subscribe(res => {
      this.allPackagesSubtotal = res['data'].map(a => a['total']).reduce((a, b) => a + b, 0)
    })

  }


  handleChange(x) {
    this.service.package_warranty = x['detail']['value']
    // let warranty = x['detail']['value']
    // this.http.post('https://api.nanogapp.com/updatewarranty', {warranty : warranty , salesid: this.salesid}).subscribe(a => { 
    //   Swal.fire({
    //     text : 'warranty updated',
    //     icon : 'success',
    //     heightAuto : false,
    //     showConfirmButton : false,
    //     timer : 1000,
    //   })

    // })
  }


  platformType() {
    return this.platform.platforms()
  }

  dropdownlist() {
    this.dropdown ? this.dropdown = false : this.dropdown = true
  }

  getpackage(x) {
    console.log(x)
    this.dropdown = false
    this.service.package = x
    this.nonpackagestatus = false
    this.service.subtotal = this.service.package.amount
    this.calculateTotal('packages')
  }

  async selectMedia() {
    const actionsheet = await this.actionSheetController.create({
      header: 'What would you want to add?',
      cssClass: 'custom-css',
      buttons: [
        {
          cssClass: 'actionsheet-selection',
          text: 'Upload Single Photo',
          handler: () => {
            document.getElementById('uploadlabel').click()
          }
        },
        {
          cssClass: 'actionsheet-selection',
          text: 'Upload Multiple Photo',
          handler: () => {
            document.getElementById('uploadlabelmul').click()
          }
        },
        {
          cssClass: 'actionsheet-selection',
          text: 'Capture Image',
          handler: () => {
            // console.log('Capture Image')
            this.captureImage()
          }
        },
        // {
        //   cssClass: 'actionsheet-selection',
        //   text: 'Record Video',
        //   handler: () => {
        //     // console.log('Record Video')
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

  // base64Img
  // userImg

  // opengallery(){
  //   this.camera.getPicture(this.gelleryOptions).then((imgData) => {
  //     // console.log('image data =>  ', imgData);
  //     this.base64Img = 'data:image/jpeg;base64,' + imgData;
  //     this.userImg = this.base64Img;
  //     }, (err) => {
  //     // console.log(err);
  //     })
  // }

  // gelleryOptions: CameraOptions = {
  //   quality : 250,
  //   sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
  //   destinationType: this.camera.DestinationType.DATA_URL,
  //   allowEdit: true
  //   }

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
        // console.log(base64)

        this.http.post('https://api.nanogapp.com/upload', { image: base64, folder: 'nanog', uid: 'nanog' }).subscribe((res) => {
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
    // const options: CameraOptions = {
    //   quality: 25,
    //   destinationType: this.camera.DestinationType.DATA_URL,
    //   encodingType: this.camera.EncodingType.JPEG,
    //   mediaType: this.camera.MediaType.PICTURE,
    //   targetHeight: 1000,
    //   targetWidth: 600,
    //   correctOrientation: true,
    //   saveToPhotoAlbum: true
    // }

    // this.camera.getPicture(options).then((imageData) => {
    //   this.sweetalert = true
    //   let base64Image = 'data:image/jpeg;base64,' + imageData;
    //   this.uploadserve2(base64Image).then(res => {
    //     this.sweetalert = false
    //     Swal.close()
    //     // console.log(res)
    //   })
    // },
    //   (err) => {
    //     alert(err)
    //   });

    console.log('take photo');
    return new Promise(async (resolve, reject) => {
      try {
        const image = await Camera.getPhoto({
          quality: 25,
          allowEditing: false,
          resultType: 'base64',
          source: 'CAMERA',
          width: 600,
          height: 1000
        });

        let base64Image = 'data:image/jpeg;base64,' + image.base64String;
        this.uploadserve2(base64Image).then(res => {
          Swal.close()
          resolve(res)
        })

      } catch (error) {
        console.error('Error taking photo', error);
        // Handle error
      }
    })
  }

  imagectype;
  imagec;
  base64img;

  fileChange2(event, maxsize) {
    console.log('test'); // Check if this line is executed

    return new Promise((resolve, reject) => {
      this.sweetalert = true;

      const files = event.target.files;

      const processImage = (file) => {
        Swal.fire({
          title: 'Processing...',
          text: 'Larger size of the image may result in a longer upload time.',
          icon: 'info',
          heightAuto: false,
          allowOutsideClick: false,
          showConfirmButton: false,
        });

        const thisImage = new Image();
        const can = document.createElement('canvas');
        const ctx = can.getContext('2d');

        thisImage.onload = () => {
          const iw = thisImage.width;
          const ih = thisImage.height;
          const scale = Math.min((maxsize / iw), (maxsize / ih));
          const iwScaled = iw * scale;
          const ihScaled = ih * scale;

          can.width = iwScaled;
          can.height = ihScaled;
          ctx.save();
          ctx.drawImage(thisImage, 0, 0, iwScaled, ihScaled);
          ctx.restore();

          this.imagec = can.toDataURL();

          const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
          let body = new URLSearchParams();
          body.set('image', this.base64img);

          this.http.post('https://api.nanogapp.com/upload', { image: this.imagec, folder: 'nanog', uid: 'nanog' }).subscribe(
            (res) => {
              this.imageurl.push(res['imageURL']);
              resolve(res['imageURL']);
            },
            (error) => {
              reject(error);
            }
          );
          Swal.close();
        };

        thisImage.src = URL.createObjectURL(file);
      };

      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          processImage(files[i]);
        }
      }
    });
  }



  filechange(ev, maxsize) {
    // console.log(ev)
    // console.log(maxsize)
  }

  recordVideo() {
    this.mediaCapture.captureVideo().then(
      (data: MediaFile[]) => {
        if (data.length > 0) {
          this.copyFileToLocalDir(data[0].fullPath);
          // console.log(data)
        }
      },
      (err: CaptureError) => alert(err)
    );
  }

  copyFileToLocalDir(f) {

  }

  viewPhoto(i) {
    this.nav.navigateForward('image-viewer?imageurl=' + this.imageurl[i])
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
    else if (this.service.area == 'others' && !this.service.otherarea) {
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
    else if ((this.service.sqft == 'others' || this.nonpackagestatus) && !this.service.sizerate) {
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
    else if (this.service.discount > 100) {
      Swal.fire({
        icon: 'warning',
        text: 'The discount value cannot more than 100',
        heightAuto: false,
        timer: 2000
      })
    }
    else if (this.service.subtotal <= 0) {
      Swal.fire({
        icon: 'warning',
        text: 'Something went wrong, kindly check carefully',
        heightAuto: false,
        timer: 2000
      })
    }
    else if (this.service.total < 0) {
      Swal.fire({
        icon: 'warning',
        text: 'Total price cannot smaller than 0',
        heightAuto: false,
        timer: 2000
      })
    }
    // else if (!this.imageurl || this.imageurl.length < 1) {
    //   Swal.fire({
    //     icon: 'info',
    //     text: 'At least upload one photo',
    //     heightAuto: false,
    //     timer: 2000
    //   })
    // }
    else {

      console.log(this.service);


      Swal.fire(
        {
          icon: 'info',
          text: 'Package with RM ' + (this.nonpackagestatus ? this.service.total : this.service.total) + ' will be added',
          heightAuto: false,
          showCancelButton: true,
          reverseButtons: true
        }
        // {
        //   icon: 'info',
        //   title : 'Processing...',
        //   heightAuto: false,
        //   showConfirmButton : false,
        //   // showCancelButton: true,
        //   // reverseButtons: true,
        //   didOpen : () => {
        //     Swal.showLoading(Swal.getConfirmButton())
        //     let startTime = new Date().getTime();

        //     // Update the loading time every second
        //     const timerInterval = setInterval(() => {
        //       const elapsedTime = Math.floor((new Date().getTime() - startTime) / 1000); // Calculate elapsed time in seconds

        //       // Update the Swal.fire dialog with the new loading time
        //       Swal.update({
        //         icon: 'info',
        //         title : 'Processing...',
        //         html: `Loading Time: ${elapsedTime} seconds`,
        //         // allowOutsideClick: false,
        //         showConfirmButton : false,
        //       });
        //     }, 1000);

        //   }
        // }
      ).then(a => {
        if (a['isConfirmed'] == true) {
          this.http.post('https://api.nanogapp.com/addNewSalesPackagev3', {
            sales_id: this.salesid,
            width: this.service.width || null,
            height: this.service.height || null,
            image: JSON.stringify(this.imageurl) || JSON.stringify([]),
            video: JSON.stringify(this.videourl) || JSON.stringify([]),
            remark: this.service.remark,
            package_id: this.nonpackagestatus ? null : this.service.package.id,
            sub_total: this.service.subtotal,
            total: this.service.total,
            total_total: ((this.allPackagesSubtotal) + parseFloat(this.service.total)),
            package_warranty: this.service.package_warranty,
            // discount: this.service.discount,
            service: this.service.services,
            area: this.service.area,
            sqft: this.service.sqft,
            size: this.nonpackagestatus ? this.service.size : null,
            rate: this.nonpackagestatus ? this.service.sizerate : null,
            other_area: this.service.area == 'others' ? this.service.otherarea : null,
            // discount_roundoff : this.service.discount_roundoff
            addon_id: this.sapid == 0 ? null : this.sapid,
            leadid: this.leadid,
            aid: this.taskid,
            uid: this.uid,
            servicetype: this.servicetype,
            pu_status: this.service.pu_status
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

  back() {
    this.nav.pop()
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

  // setsqft(){
  //   // console.log(this.service.height)
  //   // console.log(this.service.width)
  //   if((this.service.height == undefined || this.service.height == null) && (this.service.height == undefined || this.service.width == null))
  //   {
  //     this.dropdownitemstatus = false
  //   }
  //   else{
  //     let sqft = this.service.height * this.service.width
  //     // this.filterpackage = this.packages.filter(a => sqft > (a['sqft'].split('-'))[0] && sqft < (a['sqft'].split('-')[1]))
  //     this.filterpackage = this.packages.filter(a => (sqft > a['min_sqft']) && (sqft <= a['max_sqft']))
  //     for(let i = 0; i< this.filterpackage.length; i++)
  //     {
  //       this.filterpackage[i].detailstatus = false
  //     }
  //     // console.log(this.filterpackage)
  //     this.dropdownitemstatus = true
  //     this.dropdown = true
  //   }
  // }

  getsqft(i) {
    this.service.sqft = this.sizelist[i]
    this.dropdown = true
    this.filterer(this.packages)
    if (this.service.sqft == 'others') {
      this.nonpackagestatus = true
    }
    else {
      this.nonpackagestatus = false
    }
  }

  nonpackage() {
    // if (this.service.services && this.service.area) {
    this.dropdown = true
    this.service.sqft = 'others'
    this.nonpackagestatus = !this.nonpackagestatus

    this.service.size = null
    this.service.sizerate = null
    this.service.subtotal = 0
    this.service.total = 0
    // }
  }

  calculateothersubtotal() {
    // console.log(this.service.size, this.service.sizerate, this.service.discount)
    if (this.service.size && this.service.sizerate && this.service.discount) {
      this.service.subtotal = (this.service.size * this.service.sizerate).toFixed(2)
      this.calculateTotal('others')
    }
    else if (this.service.size || this.service.sizerate) {
      this.service.subtotal = (this.service.size * this.service.sizerate).toFixed(2)
      this.service.total = this.service.subtotal
    }
    // console.log(this.service.subtotal, this.service.total)
  }

  // calculateothertotal() {
  //   this.service.total = (this.service.subtotal / 100 * (100 - this.service.discount)).toFixed(2)
  // }

  async getdropdownitemdetail(x) {
    this.packages.filter(a => {
      a['id'] == x.id ? a.detailstatus = !a.detailstatus : a.detailstatus = false
    })

  }

  filterer(x) {
    // if (this.service.services && this.service.sqft && this.service.area && this.remove == false) {
    //   let temp = this.package_install.filter(a => a['service'].toLowerCase() == this.service.services.toLowerCase()
    //     && a['sqft'].toLowerCase() == this.service.sqft.toLowerCase())
    //   return temp
    // }
    // else if (this.service.services && this.service.sqft && this.service.area && this.remove == true) {
    //   let temp = this.package_remove.filter(a => a['service'].toLowerCase() == this.service.services.toLowerCase()
    //     && a['sqft'].toLowerCase() == this.service.sqft.toLowerCase())
    //   return temp
    // }
    // console.log(this.package_install)
    if (this.service.services && this.service.sqft && this.service.area && this.remove == false) {
      let temp = this.package_install.filter(a => a['service'].toLowerCase() == this.service.services.toLowerCase()
        && (this.service.area == 'others' ? a['area'] : a['area'].toLowerCase() == (this.service.area).toLowerCase()) &&
        Number(a['sqft'].split('-')[0]) < (this.service.sqft == 'others' ? -1 : Number(this.service.sqft))
        && Number(a['sqft'].split('-')[1]) >= (this.service.sqft == 'others' ? -1 : Number(this.service.sqft))
      )
      // console.log(temp)
      return temp
    }
    else if (this.service.services && this.service.sqft && this.service.area && this.remove == true) {
      let temp = this.package_remove.filter(a => a['service'].toLowerCase() == this.service.services.toLowerCase()
        && (this.service.area == 'others' ? a['area'] : a['area'].toLowerCase() == (this.service.area).toLowerCase()) &&
        Number(a['sqft'].split('-')[0]) < (this.service.sqft == 'others' ? -1 : Number(this.service.sqft))
        && Number(a['sqft'].split('-')[1]) >= (this.service.sqft == 'others' ? -1 : Number(this.service.sqft))
      )
      // console.log(temp)
      return temp
    }
  }

  getservice(i) {
    this.service.services = this.servicelist[i]
    this.changesqftlist()
    // this.getpackageprice()
  }

  getarea(i) {
    if (i == 'others') {
      // this.changesqftlist()
      // this.getpackageprice()
    }
    else {
      this.service.area = this.arealist[i]['name']
      // this.areadropdown = false
      // this.changesqftlist()
      // this.getpackageprice()
    }
  }

  // getsize(i){
  //   // console.log(i)
  //   if(i == 'others')
  //   {
  //     this.getpackageprice()
  //   }
  //   else
  //   {
  //     this.service.size = this.sizelist[i]
  //     this.getpackageprice()
  //   }
  // }


  // getpackagetype(i){
  //   this.service.packagetype = this.packagelist[i]
  //   this.packagedropdown = false
  //   this.getpackageprice()
  // }

  changesqftlist() {
    this.service.sqft = undefined
    // // console.log(this.service.services.toLowerCase(), this.service.area.toLowerCase())
    // // console.log(this.service.services.toLowerCase() == 'waterproofing' && this.service.area.toLowerCase() == 'bathroom')
    if (this.service.services && this.service.area) {
      if (this.service.services.toLowerCase() == 'waterproofing' && this.service.area.toLowerCase() == 'bathroom') {
        // console.log('here')
        this.sizelist = ['0-80', '81-120', '121-200', 'others']
      }
      else if (this.service.services.toLowerCase() == 'anti-slip' && this.service.area.toLowerCase() == 'bathroom') {
        // console.log('here2')
        this.sizelist = ['0-50', '51-100', '101-150', 'others']
      }
      else {
        // console.log('here4')
        this.sizelist = ['0-100', '101-200', '201-300', '301-400', '401-500', 'others']
      }
    }
    // this.sizedropdown = true

  }

  // getpackageprice(){
  //   if(this.service.services && this.service.size && this.service.area && this.service.size != 'others')
  //   {
  //     let temp = this.packages.filter(a => a['service'].toLowerCase() == this.service.services.toLowerCase() 
  //     && a['sqft'].toLowerCase() == this.service.size.toLowerCase())
  //     this.packageselected = temp
  //     this.packageselected.length > 0 ? this.packageprice = this.packageselected[0].amount : this.packageprice = 0
  //     // console.log(this.packageselected)
  //     this.calculateTotal()
  //   }
  //   else if(this.service.size == 'others' || this.service.area == 'others')
  //   {
  //     // console.log('here1')
  //     this.packageselected = [];
  //     this.packageprice = 0;
  //     this.packagetotal = 0;
  //     this.calculateTotal()
  //   }
  //   else
  //   {
  //     // console.log('here2')
  //     this.packageselected = [];
  //     this.packagetotal = 0;
  //     this.calculateTotal()
  //   }
  // }

  calculateTotal(x) {
    // if (x == 'packages') {
    //   if (this.service.discount) {
    //     this.service.total = (this.service.subtotal * (100 - this.service.discount) / 100).toFixed(2)
    //     this.service.total = (this.service.total - this.service.discount_roundoff).toFixed(2)
    //   }
    //   else {
    //     this.service.total = (this.service.subtotal).toFixed(2)
    //     this.service.total = (this.service.total - this.service.discount_roundoff).toFixed(2)
    //   }
    // }
    // else if (x == 'others') {
    //   this.service.total = (this.service.subtotal / 100 * (100 - this.service.discount)).toFixed(2)
    //   this.service.total = (this.service.total - this.service.discount_roundoff).toFixed(2)
    // }
    this.service.total = (this.service.subtotal).toFixed(2)
    // console.log(this.service)
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
        //     // console.log('Record Video')
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

    // // console.log(uploadedFile)
    // // console.log(uploadedFile.item(0))
    this.uploadToS3(uploadedFile.item(0))
  }

  async uploadToS3(file) {
    try {
      // Show uploading message
      Swal.fire({
        title: "Uploading",
        text: "Thank you for your patience...",
        heightAuto: false,
        icon: 'info',
        showConfirmButton: false,
      });

      // const s3Client = new S3Client({
      //   accessKeyId: "AKIA4FJWF7YCVSZJKLFE",
      //   secretAccessKey: "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",
      //   region: 'ap-southeast-1',
      //   signatureVersion: 'v4'
      // });
      const s3Client = new S3Client({
        region: 'ap-southeast-1',
        credentials: {
          accessKeyId: "AKIA4FJWF7YCVSZJKLFE",
          secretAccessKey: "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",
        }
      });
      const params = {
        Bucket: 'nanogbucket',
        Key: 'video name:' + file.name,
        Body: file
      };

      const command = new PutObjectCommand(params);
      const data = await s3Client.send(command);
      const objectUrl = `https://nanogbucket.s3.ap-southeast-1.amazonaws.com/${encodeURIComponent(params.Key)}`;

      // Close uploading message
      Swal.close();

      // Add uploaded file details to videourl array
      this.videourl.push({
        link: objectUrl,
        filename: file.name
      });

      return true; // Indicates successful upload
    } catch (error) {
      // Close uploading message on error
      Swal.close();

      // Show error message
      Swal.fire({
        title: "Something went wrong",
        text: "Please try again later",
        icon: 'error',
        timer: 2000,
        heightAuto: false,
        showConfirmButton: false,
      });

      console.error('Error uploading file:', error);
      return false; // Indicates upload failure
    }
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
    // this.service.package = null
  }

}
