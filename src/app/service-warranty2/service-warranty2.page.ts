import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, ModalController, NavController, NavParams, Platform } from '@ionic/angular';
// import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
import Swal from 'sweetalert2';
// import * as EXIF from 'exif-js';

// import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { MediaCapture, MediaFile, MediaFileData, CaptureError } from '@awesome-cordova-plugins/media-capture/ngx';
// import * as S3 from 'aws-sdk/clients/s3';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Plugins } from '@capacitor/core';
const { Camera } = Plugins;

@Component({
  selector: 'app-service-warranty2',
  templateUrl: './service-warranty2.page.html',
  styleUrls: ['./service-warranty2.page.scss'],
})
export class ServiceWarranty2Page implements OnInit {


  sapid
  linked_sapid: number
  salesid

  statuscheck
  service = {} as any
  linked_service = {} as any
  packages = [] as any
  filterpackage = [] as any
  selectedpackage = {} as any
  package = {} as any

  imageurl
  videourl

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
    // private navparam : NavParams,
    private http: HttpClient,
    private modal: ModalController,
    // private photoViewer : PhotoViewer,
    private actionSheetController: ActionSheetController,
    private mediaCapture: MediaCapture,
    // private camera: Camera,
    private nav: NavController,
    private platform: Platform) { }

  ngOnInit() {

    this.route.queryParams.subscribe(a => {
      this.linked_sapid = parseInt(a['linked_sapid'])
      this.salesid = a['salesid']
      // this.sapid = a['sapid']


      this.http.post('https://api.nanogapp.com/getWarrantySalesPackage', { sap_id: this.linked_sapid }).subscribe(a => {
        this.service = a['data'] || {}
        this.statuscheck = a['data']
        // console.log(this.service.length)
        // console.log(a['data'])
        this.imageurl = this.service.pack_image || []
        this.videourl = this.service.pack_video || []

      })


      this.http.post('https://api.nanogapp.com/getSalesPackage', { sap_id: this.linked_sapid }).subscribe(a => {
        this.linked_service = a['data']
        // console.log(this.linked_service)
      })
    })
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
    if (!this.service.remark) {
      Swal.fire(
        {
          icon: 'warning',
          text: 'Remark cannot be empty',
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
          text: 'Are you sure to insert/update this package?',
          heightAuto: false,
          showCancelButton: true,
          reverseButtons: true
        }
      ).then(a => {


        console.log({
          sales_id: this.salesid,
          width: this.linked_service.width || null,
          height: this.linked_service.width || null,
          image: JSON.stringify(this.imageurl) || JSON.stringify([]),
          video: JSON.stringify(this.videourl) || JSON.stringify([]),
          remark: this.service.remark,
          package_id: this.linked_service.package_id || null,
          sub_total: null,
          total: null,
          discount: null,
          service: this.linked_service.service || null,
          area: this.linked_service.area || null,
          sqft: this.linked_service.sqft || null,
          size: this.linked_service.size || null,
          rate: this.linked_service.rate || null,
          other_area: this.linked_service.other_area || null,
          linked_sp: this.linked_sapid,
        })
        if (a['isConfirmed'] == true) {
          if (!this.statuscheck) {
            this.http.post('https://api.nanogapp.com/addNewSalesPackage2', {
              sales_id: this.salesid,
              width: this.linked_service.width || null,
              height: this.linked_service.width || null,
              image: JSON.stringify(this.imageurl) || JSON.stringify([]),
              video: JSON.stringify(this.videourl) || JSON.stringify([]),
              remark: this.service.remark,
              package_id: this.linked_service.package_id || null,
              sub_total: null,
              total: null,
              discount: null,
              service: this.linked_service.service || null,
              area: this.linked_service.area || null,
              sqft: this.linked_service.sqft || null,
              size: this.linked_service.size || null,
              rate: this.linked_service.rate || null,
              other_area: this.linked_service.other_area || null,
              linked_sp: this.linked_sapid,
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
            if (a['isConfirmed'] == true) {
              this.http.post('https://api.nanogapp.com/updateSalesPackage', {
                sap_id: this.service.sap_id,
                width: this.service.width || null,
                height: this.service.height || null,
                image: JSON.stringify(this.imageurl) || JSON.stringify([]),
                video: JSON.stringify(this.videourl) || JSON.stringify([]),
                remark: this.service.remark,
                package_id: this.service.package_id || null,
                sub_total: null,
                total: null,
                discount: null,
                service: this.service.service || null,
                area: this.service.area || null,
                sqft: this.service.sqft || null,
                size: this.service.size || null,
                rate: this.service.rate || null,
                other_area: this.service.other_area || null,
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
          }

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
    // const options: CameraOptions = {
    //   quality: 50,
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
    //   }); confirm
    console.log('take photo');
    return new Promise(async (resolve, reject) => {
      try {
        const image = await Camera.getPhoto({
          quality: 50,
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
        this.imagectype = event.target.files[0].type;
        // EXIF.getData(event.target.files[0], () => {
        //   // console.log(event.target.files[0]);
        //   // console.log(event.target.files[0].exifdata.Orientation);
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
          // // console.log(event.target.files[0]);
          // if (event.target.files[0] && event.target.files[0].exifdata.Orientation) {
          //   // console.log(event.target.files[0].exifdata.Orientation);
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


          //   // console.log(link['imageURL'])
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
}
