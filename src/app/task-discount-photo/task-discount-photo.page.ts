import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, ModalController, NavController, Platform } from '@ionic/angular';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
// import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
import Swal from 'sweetalert2';
import * as EXIF from 'exif-js';

@Component({
  selector: 'app-task-discount-photo',
  templateUrl: './task-discount-photo.page.html',
  styleUrls: ['./task-discount-photo.page.scss'],
})
export class TaskDiscountPhotoPage implements OnInit {

  salesid
  custom
  noncustom

  userid
  taskid
  snnoncustom
  sncustom

  heighForAddPhoto = ((this.heigher() / 100 * 90) / 3) + 'px'

  constructor(private http: HttpClient,
    private modal: ModalController,
    private route: ActivatedRoute,
    private nav: NavController,
    private platform: Platform,
    private camera: Camera,
    // private photoViewer: PhotoViewer,
    private actionSheetController: ActionSheetController,) { }


  ngOnInit() {
    this.refresher()
  }

  platformType() {
    return this.platform.platforms()
  }

  refresher() {
    this.route.queryParams.subscribe(a => {
      this.userid = a['uid']
      this.taskid = a['tid']
      this.salesid = a['sid']
    })
    this.http.post('https://api.nanogapp.com/getAllSalesDiscount', { sales_id: this.salesid }).subscribe(a => {
      // console.log(a)
      this.custom = a['data'].filter(a => a['discount_id'] == null && a['need_photo'] == true)
      this.noncustom = a['data'].filter(a => a['discount_id'] != null && a['status'] == true && a['need_photo'] == true)
      // console.log(this.custom)
      // console.log(this.noncustom)

    }
    )
  }

  heigher() {
    return this.platform.width()
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

        // this.http.post('https://api.imgbb.com/1/upload?expiration=0&key=c0f647e7fcbb11760226c50f87b58303', body.toString(), { headers, observe: 'response' }).subscribe(res => {
        //   this.custom[this.selectednumber].photo.push((res['body']['data'].url))
        //   this.saveToDatabase(this.selectednumber)
        //   resolve((res['body'])['data'].url)
        // }, awe => {
        //   reject(awe)
        // })
        this.http.post('https://api.nanogapp.com/upload', { image: base64, folder: 'nanog', userid: 'nanog' }).subscribe((res) => {
          this.custom[this.sncustom].photo.push((res['imageURL']))
          this.saveToDatabase(this.sncustom)
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

  takePhoto(i) {
    const options: CameraOptions = {
      quality: 50,
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
        // console.log(res)
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
      Swal.fire({
        title: 'processing...',
        text: 'Large photo will take long time',
        icon: 'info',
        heightAuto: false,
        allowOutsideClick: false,
        showConfirmButton: false,
      })      
      
      const files = event.target.files;

      for(let i = 0; i< files.length ; i++)
      {
      if (event.target.files && event.target.files[i] && event.target.files[i].size < (10485768)) {
        this.imagectype = event.target.files[i].type;
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

            // console.log(this.custom[this.sncustom])


            // this.http.post('https://api.imgbb.com/1/upload?expiration=0&key=c0f647e7fcbb11760226c50f87b58303', body.toString(), { headers, observe: 'response' }).subscribe(res => {
            //   this.custom[this.selectednumber].photo.push((res['body']['data'].url))
            //   this.saveToDatabase(this.selectednumber)
            //   resolve((res['body'])['data'].url)
            // }, err => {
            //   alert(err)
            //   reject(err)
            // })

            this.http.post('https://api.nanogapp.com/upload', { image: this.imagec, folder: 'nanog', userid: 'nanog' }).subscribe((res) => {
              this.custom[this.sncustom].photo.push((res['imageURL']))
              this.saveToDatabase(this.sncustom)
              resolve(res['imageURL'])
            }, awe => {
              reject(awe)
            })
          };
          thisImage.src = URL.createObjectURL(event.target.files[i]);
        // });
      } else {

        Swal.fire({
          text: 'Your Current Image Too Large, ' + event.target.files[i].size / (1024102.4) + 'MB! (Please choose file lesser than 8MB',
          heightAuto : false,
          icon : 'info',
        })
        reject('error')
      }
    }

    })
  }

  async selectMedia(i) {
    this.sncustom = i
    const actionsheet = await this.actionSheetController.create({
      header: 'What would you like to add?',
      cssClass: 'custom-css',
      buttons: [
        {
          cssClass: 'actionsheet-selection',
          text: 'Upload from gallery',
          handler: () => {
            document.getElementById('uploadimage').click()
          }
        },
        {
          cssClass: 'actionsheet-selection',
          text: 'Camera',
          handler: () => {
            this.takePhoto(i)
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

  // viewPhoto(i, yi) {
  //   this.photoViewer.show(this.custom[i].photo[yi])
  // }

  viewPhoto(i, yi) {
    this.nav.navigateForward('image-viewer?imageurl=' + this.custom[i].photo[yi])
  }

  removePhoto(i, yi) {
    Swal.fire({
      text: 'Are you sure to delete this photo?',
      icon: 'info',
      heightAuto: false,
      showCancelButton: true,
      reverseButtons: true,
    }).then(a => {
      if (a['isConfirmed']) {
        this.custom[i].photo.splice(yi, 1)
        this.saveToDatabase(i)
      }
    })

  }

  saveToDatabase(i) {
    this.http.post('https://api.nanogapp.com/updatePhotoForSalesDiscount', {
      photo: JSON.stringify(this.custom[i].photo) || JSON.stringify([]),
      id: this.custom[i].id,
    }).subscribe(a => {
      this.refresher()
      Swal.close()
      // console.log(a)
    })
  }


  uploadserve2(base64Image) {
    return new Promise((resolve, reject) => {
      Swal.fire({
        title: 'processing...',
        icon: 'info',
        heightAuto: false,
        allowOutsideClick: false,
        showConfirmButton: false,
      })
      if (base64Image) {
        let imgggg = base64Image.replace(';base64,', "thisisathingtoreplace;")
        let imgarr = imgggg.split("thisisathingtoreplace;")
        let base64 = imgarr[1]


        const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
        let body = new URLSearchParams()
        body.set('image', base64)

        // this.http.post('https://api.imgbb.com/1/upload?expiration=0&key=c0f647e7fcbb11760226c50f87b58303', body.toString(), { headers, observe: 'response' }).subscribe(res => {
        //   this.noncustom[this.selectednumber].photo.push((res['body']['data'].url))
        //   this.saveToDatabase(this.selectednumber)
        //   resolve((res['body'])['data'].url)
        // }, awe => {
        //   reject(awe)
        // })

        // console.log(base64)

        this.http.post('https://api.nanogapp.com/upload', { image: base64, folder: 'nanog', userid: 'nanog' }).subscribe((res) => {
          this.noncustom[this.snnoncustom].photo.push((res['imageURL']))
          this.saveToDatabase2(this.snnoncustom)
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

  takePhoto2(i) {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      saveToPhotoAlbum: true
    }
    this.camera.getPicture(options).then((imageData) => {
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.uploadserve2(base64Image).then(res => {
        Swal.close()
        // console.log(res)
      })
    },
      (err) => {
        alert(err)
      });
  }


  fileChange3(event, maxsize) {
    return new Promise((resolve, reject) => {
      Swal.fire({
        title: 'processing...',
        text: 'Large photo will take long time',
        icon: 'info',
        heightAuto: false,
        allowOutsideClick: false,
        showConfirmButton: false,
      })
      const files = event.target.files;

      for(let i = 0; i< files.length ; i++)
      {
      if (event.target.files && event.target.files[i] && event.target.files[i].size < (10485768)) {
        this.imagectype = event.target.files[i].type;
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

            // console.log(this.custom[this.snnoncustom])


            // this.http.post('https://api.imgbb.com/1/upload?expiration=0&key=c0f647e7fcbb11760226c50f87b58303', body.toString(), { headers, observe: 'response' }).subscribe(res => {
            //   // this.discountimageurl.push((res['body']['data'].url))
            //   this.noncustom[this.selectednumber].photo.push((res['body']['data'].url))
            //   this.saveToDatabase2(this.selectednumber)
            //   resolve((res['body'])['data'].url)
            // }, err => {
            //   alert(err)
            //   reject(err)
            // })

            this.http.post('https://api.nanogapp.com/upload', { image: this.imagec, folder: 'nanog', userid: 'nanog' }).subscribe((res) => {
              this.noncustom[this.snnoncustom].photo.push((res['imageURL']))
              this.saveToDatabase2(this.snnoncustom)
              resolve(res['imageURL'])
            }, awe => {
              reject(awe)
            })
          };
          thisImage.src = URL.createObjectURL(event.target.files[i]);
        // });
      } else {

        Swal.fire({
          text: 'Your Current Image Too Large, ' + event.target.files[i].size / (1024102.4) + 'MB! (Please choose file lesser than 8MB',
          heightAuto : false,
          icon : 'info',
        })
        reject('error')
      }
    }

    })
  }

  async selectMedia2(i) {
    this.snnoncustom = i
    const actionsheet = await this.actionSheetController.create({
      header: 'What would you like to add?',
      cssClass: 'custom-css',
      buttons: [
        {
          cssClass: 'actionsheet-selection',
          text: 'Upload from gallery',
          handler: () => {
              document.getElementById('uploadimage2').click()
          }
        },
        {
          cssClass: 'actionsheet-selection',
          text: 'Camera',
          handler: () => {
            this.takePhoto2(i)
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

  // viewPhoto2(i, yi) {
  //   this.photoViewer.show(this.noncustom[i].photo[yi])
  // }

  viewPhoto2(i, yi) {
    // console.log(i, yi)
    // console.log(this.noncustom[i].photo[yi])
    this.nav.navigateForward('image-viewer?imageurl=' +  this.noncustom[i].photo[yi])
  }




  removePhoto2(i, yi) {
    Swal.fire({
      text: 'Are you sure to delete this photo?',
      icon: 'info',
      heightAuto: false,
      showCancelButton: true,
      reverseButtons: true,
    }).then(a => {
      if (a['isConfirmed']) {
        this.noncustom[i].photo.splice(yi, 1)
        this.saveToDatabase2(i)
      }
    })


  }

  saveToDatabase2(i) {
    // console.log(this.noncustom[i])
    this.http.post('https://api.nanogapp.com/updatePhotoForSalesDiscount', {
      photo: JSON.stringify(this.noncustom[i].photo) || JSON.stringify([]),
      id: this.noncustom[i].id,
    }).subscribe(a => {
      this.refresher()
      Swal.close()
      // console.log(a)
    })
  }

  back() {
    this.nav.pop()
  }

}
