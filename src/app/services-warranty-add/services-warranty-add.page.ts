import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController, NavController, NavParams, Platform } from '@ionic/angular';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { MediaCapture, MediaFile, MediaFileData, CaptureError } from '@awesome-cordova-plugins/media-capture/ngx';
// import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
import Swal from 'sweetalert2';
import * as EXIF from 'exif-js';
import { ServicePackageDetailPage } from '../service-package-detail/service-package-detail.page';
import { identity } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import * as S3 from 'aws-sdk/clients/s3';

@Component({
  selector: 'app-services-warranty-add',
  templateUrl: './services-warranty-add.page.html',
  styleUrls: ['./services-warranty-add.page.scss'],
})
export class ServicesWarrantyAddPage implements OnInit {

  packages = [] as any
  filterpackage = [] as any
  selectedpackage = {} as any
  service = [] as any

  imagelink
  imageurl = [] as any
  videourl = [] as any
  dropdown = false
  dropdownitemstatus = false

  files: FileList;
  public testup(event) {
    this.files = event.target.files;
    console.log(this.files)
  }

  taskid
  userid
  salesid

  sweetalert = false

  servicelist = ['Waterproofing', 'Anti-slip', 'WP & AS']
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

  constructor(
    private http: HttpClient,
    private actionSheetController: ActionSheetController,
    private camera: Camera,
    private mediaCapture: MediaCapture,
    // private photoViewer: PhotoViewer,
    private nav: NavController,
    private modal: ModalController,
    private route: ActivatedRoute,
    private platform: Platform) { }

  ngOnInit() {

    this.route.queryParams.subscribe(a => {
      this.taskid = a['tid']
      this.salesid = a['sid']
      this.userid = a['uid']


      this.http.get('https://api.nanogapp.com/getPackages').subscribe(a => {
        console.log(a)
        this.packages = a['data']
        console.log(this.packages)

        for (let i = 0; i < this.packages.length; i++) {
          this.packages[i].detailstatus = false
        }
      })

      this.http.get('https://api.nanogapp.com/getAllPlace').subscribe(a => {
        this.arealist = a['data']
        this.arealist.push({ name: 'others' })
        console.log(this.arealist)
      })
    })

    // this.taskid = this.navparam.get('tid')
    // this.userid = this.navparam.get('uid')
    // this.salesid = this.navparam.get('sid')
    console.log(this.taskid, this.userid, this.salesid)


  }

  platformType() {
    return this.platform.platforms()
  }

  dropdownlist() {
    this.dropdown ? this.dropdown = false : this.dropdown = true
  }

  getpackage(x) {
    this.dropdown = false
    this.service.package = x
    this.nonpackagestatus = false
    this.service.subtotal = this.service.package.amount
    this.calculateTotal()
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

  // base64Img
  // userImg

  // opengallery(){
  //   this.camera.getPicture(this.gelleryOptions).then((imgData) => {
  //     console.log('image data =>  ', imgData);
  //     this.base64Img = 'data:image/jpeg;base64,' + imgData;
  //     this.userImg = this.base64Img;
  //     }, (err) => {
  //     console.log(err);
  //     })
  // }

  // gelleryOptions: CameraOptions = {
  //   quality: 100,
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
        console.log(base64)

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
      quality: 50,
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
      Swal.fire({
        title: 'processing...',
        text: 'Large photo will take long time',
        icon: 'info',
        heightAuto: false,
        allowOutsideClick: false,
        showConfirmButton: false,
      })
      if (event.target.files && event.target.files[0] && event.target.files[0].size < (81928192)) {
        console.log('here')
        console.log(event.target.files[0].type)
        this.imagectype = event.target.files[0].type;
        console.log(this.imagectype)
        console.log(event.target.files[0])
        // EXIF.getData(event.target.files[0], () => {
        //   console.log('run here 4')
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
            // this.base64img = imgarr[1];
            let base64 = imgarr[1]
            event.target.value = '';

            const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
            let body = new URLSearchParams()
            body.set('image', this.base64img)

            console.log(base64)

            this.http.post('https://api.nanogapp.com/upload', { image: this.imagec, folder: 'nanog', userid: 'nanog' }).subscribe((res) => {
              console.log('run here 2')
              this.imageurl.push(res['imageURL'])
              this.sweetalert = false
              Swal.close()
              resolve(res['imageURL'])
            }, awe => {
              console.log('run here 3')
              reject(awe)
            })



            // this.http.post('https://api.imgbb.com/1/upload?expiration=0&key=c0f647e7fcbb11760226c50f87b58303', body.toString(), { headers, observe: 'response' }).subscribe(res => {
            //   this.imageurl.push(res['body']['data'].url)
            //   this.sweetalert = false
            //   resolve((res['body'])['data'].url)
            // }, err => {
            //   alert(err)
            //   reject(err)
            // })


            // this.uploadToImgur(this.base64img, this.lengthof(this.benefit['photo']) - 1);

            // this.http.post('https://img.vsnap.my/upload', { image: this.imagec, folder: 'hockwong', userid: '5KLVpP3MdneiM1kgcHR26LGFSW52' }).subscribe((link) => {


            //   console.log(link['imageURL'])
            //   this.imageurl.push(link['imageURL'])

            // })

          };
          thisImage.src = URL.createObjectURL(event.target.files[0]);
        // });
      } else {

        alert('Your Current Image Too Large, ' + event.target.files[0].size / (10241024) + 'MB! (Please choose file lesser than 8MB)');
      }

    })
  }

  // uploadToImgur(base64, i) {
  //   let link = encodeURI('https://api.imgur.com/3/image');

  //   this.http.post('https://img.vsnap.my/upload', { image: this.imagec, folder: 'hockwong', userid: '5KLVpP3MdneiM1kgcHR26LGFSW52' }).subscribe((link) => {


  //     console.log(link['imageURL'])
  //     this.imageurl.push(link['imageURL'])

  //   })
  // }

  filechange(ev, maxsize) {
    console.log(ev)
    console.log(maxsize)
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

  // viewPhoto(i) {
  //   this.photoViewer.show(this.imageurl[i], ('Photo' + (i + 1)))
  // }
  viewPhoto(i) {
    this.nav.navigateForward('image-viewer?imageurl=' + this.imageurl[i])
  }


  confirm() {
    this.sweetalert = true
    if (!this.service.remark) {
      Swal.fire(
        {
          icon: 'warning',
          text: 'Please input remark',
          heightAuto: false,
          timer: 2000,
        }
      ).then(() => {
        this.sweetalert = false
      })
    }
    else {
      Swal.fire(
        {
          icon: 'info',
          text: 'Are you sure to add this package?',
          heightAuto: false,
          showCancelButton: true,
          reverseButtons: true
        }
      ).then(a => {
        if (a['isConfirmed'] == true) {
          this.http.post('https://api.nanogapp.com/addNewSalesPackage', {
            sales_id: this.salesid,
            width: null,
            height: null,
            image: JSON.stringify(this.imageurl) || JSON.stringify([]),
            video: JSON.stringify(this.videourl) || JSON.stringify([]),
            remark: this.service.remark,
            package_id: null ,
            sub_total: null,
            total: null,
            discount: null,
            service: null,
            area: null,
            sqft: null,
            size: null,
            rate:  null,
            other_area: null,
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

  back() {
    // this.modal.dismiss()
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
  //   console.log(this.service.height)
  //   console.log(this.service.width)
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
  //     console.log(this.filterpackage)
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
    if (this.service.services && this.service.area) {
      this.dropdown = true
      this.service.sqft = 'others'
      this.nonpackagestatus = true
    }
  }

  calculateothersubtotal() {
    console.log(this.service.size, this.service.sizerate, this.service.discount)
    if (this.service.size && this.service.sizerate && this.service.discount) {
      this.service.subtotal = (this.service.size * this.service.sizerate).toFixed(2)
      this.calculateothertotal()
    }
    else if (this.service.size && this.service.sizerate) {
      this.service.subtotal = (this.service.size * this.service.sizerate).toFixed(2)
      this.service.total = this.service.subtotal
    }
    console.log(this.service.subtotal, this.service.total)
  }

  calculateothertotal() {
    this.service.total = (this.service.subtotal / 100 * (100 - this.service.discount)).toFixed(2)
  }

  async getdropdownitemdetail(i) {
    console.log(this.packages[i])
    // if(this.filterpackage[i].detailstatus == true)
    // {
    //   for(let i = 0; i< this.filterpackage.length; i++)
    //   {
    //     this.filterpackage[i].detailstatus = false
    //   }
    // }
    // else if(this.filterpackage[i].detailstatus == false){
    //   for(let i = 0; i< this.filterpackage.length; i++)
    //   {
    //     this.filterpackage[i].detailstatus = false
    //   }
    //   console.log(this.filterpackage[i])
    //   this.filterpackage[i].detailstatus = true
    //   this.selectedpackage = this.filterpackage[i]
    // }

    if (this.packages[i].detailstatus == true) {
      for (let i = 0; i < this.packages.length; i++) {
        this.packages[i].detailstatus = false
      }
    }
    else if (this.packages[i].detailstatus == false) {
      for (let i = 0; i < this.packages.length; i++) {
        this.packages[i].detailstatus = false
      }
      console.log(this.packages[i])
      this.packages[i].detailstatus = true
      this.selectedpackage = this.packages[i]
    }
    console.log(this.selectedpackage)

    // Swal.fire({
    //   title: 'Package Detail',
    //   text : this.filterpackage[i].name + '\n\n\n\n\n' + this.filterpackage[i].amount,
    //   heightAuto: false,
    // })

    // const modal = await this.modal.create({
    //   cssClass: 'dropdownitemdetailcss',
    //   component: ServicePackageDetailPage,
    //   componentProps: {pid : this.filterpackage[i].id}
    // })


    // await modal.present()

    // const actionsheet = await this.actionSheetController.create({
    //   buttons: [
    //     {
    //       text: this.filterpackage[i].name,
    //     },
    //     {
    //       text: this.filterpackage[i].service,
    //     },
    //     {
    //       text: this.filterpackage[i].amount,
    //     },
    //     {
    //       text: this.filterpackage[i].sqft,
    //     },
    //     {
    //       text: this.filterpackage[i].type,
    //     },
    //     {
    //       cssClass: 'actionsheet-cancel',
    //       text: 'OK',
    //       role: 'cancel'
    //     }
    //   ]
    // })

    // await actionsheet.present()
  }

  filterer(x) {
    if (this.service.services && this.service.sqft && this.service.area) {
      let temp = this.packages.filter(a => a['service'].toLowerCase() == this.service.services.toLowerCase()
        && a['sqft'].toLowerCase() == this.service.sqft.toLowerCase())
      console.log(temp)
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
      this.changesqftlist()
      // this.getpackageprice()
    }
    else {
      this.service.area = this.arealist[i]['name']
      // this.areadropdown = false
      this.changesqftlist()
      // this.getpackageprice()
    }
  }

  // getsize(i){
  //   console.log(i)
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
    // console.log(this.service.services.toLowerCase(), this.service.area.toLowerCase())
    // console.log(this.service.services.toLowerCase() == 'waterproofing' && this.service.area.toLowerCase() == 'bathroom')
    if (this.service.services && this.service.area) {
      if (this.service.services.toLowerCase() == 'waterproofing' && this.service.area.toLowerCase() == 'bathroom') {
        console.log('here')
        this.sizelist = ['0-80', '81-120', '121-200', 'others']
      }
      else if (this.service.services.toLowerCase() == 'anti-slip' && this.service.area.toLowerCase() == 'bathroom') {
        console.log('here2')
        this.sizelist = ['0-50', '51-100', '101-150', 'others']
      }
      else {
        console.log('here4')
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
  //     console.log(this.packageselected)
  //     this.calculateTotal()
  //   }
  //   else if(this.service.size == 'others' || this.service.area == 'others')
  //   {
  //     console.log('here1')
  //     this.packageselected = [];
  //     this.packageprice = 0;
  //     this.packagetotal = 0;
  //     this.calculateTotal()
  //   }
  //   else
  //   {
  //     console.log('here2')
  //     this.packageselected = [];
  //     this.packagetotal = 0;
  //     this.calculateTotal()
  //   }
  // }

  calculateTotal() {
    if (this.service.discount) {
      this.service.total = (this.service.subtotal * (100 - this.service.discount) / 100).toFixed(2)
    }
    else {
      this.service.total = (this.service.subtotal).toFixed(2)
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
          link : data.Location,
          filename : file.name
        }
      )

      // this.videourl.link[i].link = data.Location
      // this.videourl.link[i].filename = file.name
      return true
    })

  }

  removeVideo(i){
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
}
