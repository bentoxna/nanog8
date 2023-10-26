import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, NavController, Platform } from '@ionic/angular';
import Swal from 'sweetalert2';
import * as S3 from 'aws-sdk/clients/s3';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';

import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.page.html',
  styleUrls: ['./check-out.page.scss'],
})

export class CheckOutPage implements OnInit {

  salesid
  userid
  taskid
  leadid
  labelm
  labels

  location = {} as any
  addressstring
  
  alllabel = [] as any
  mainlabel = [] as any
  sublabel = [] as any
  label = [] as any
  sublabelDependMainLabel = [] as any

  videourl = [] as any
  imageurl = [] as any

  eventtime

  constructor(private nav : NavController,
    private route : ActivatedRoute,
    private http : HttpClient,
    private platform: Platform,
    private actionSheetController : ActionSheetController,
    private camera : Camera,
    private geolocation: Geolocation) { }

  ngOnInit() {
    this.route.queryParams.subscribe(a => {
      this.userid = a['uid']
      this.salesid = a['sid']
      this.leadid = a['lid']
      this.labelm = a['labelm']
      this.labels = a['labels']
      this.taskid = a['tid']

      // console.log(this.leadid, this.labelm, this.labels)
      
      this.http.get('https://api.nanogapp.com/getLabel').subscribe(a => {
        // console.log(a)
        this.alllabel = a['data']
        this.mainlabel = this.alllabel.filter(a => a['main'] == true && a['status'] == true)
        this.sublabel = this.alllabel.filter(a => a['main'] == false && a['status'] == true)
        // console.log(this.alllabel)
        // console.log(this.mainlabel)
        // console.log(this.sublabel)

        this.label.mainlabel = this.mainlabel.filter(a => a['id'] == this.labelm)[0]
        this.sublabelDependMainLabel = this.sublabel.filter(a => a['category'] == this.label.mainlabel.category)
        this.label.sublabel = this.sublabel.filter(a => a['id'] == this.labels)[0]

        // console.log(this.label)
      })

      this.http.post('https://api.nanogapp.com/getLabelForLead', {lead_id : this.leadid}).subscribe(a => {
        // console.log(a['data'])
        this.label.remark = a['data']['label_remark']
        !a['data']['label_photo'] ? this.imageurl = [] : this.imageurl = a['data']['label_photo']
        !a['data']['label_video'] ? this.videourl = [] : this.videourl = a['data']['label_video']

        // console.log('here 71', this.imageurl)
      })
    })
  }

  platformType(){
    return this.platform.platforms()
  }

  back(){
    this.nav.pop()
  }

  getmainlabel(i){
    this.label.mainlabel = this.mainlabel[i]
    this.sublabelDependMainLabel = this.sublabel.filter(a => a['category'] == this.label.mainlabel.category)
  }

  getsublabel(i){
    this.label.sublabel = this.sublabelDependMainLabel[i]
  }

  submit(){
    
    if(!this.label.mainlabel || !this.label.sublabel || !this.label.remark)
    {
      Swal.fire({
        text: 'Please insert all the information',
        icon: 'info',
        heightAuto: false,
        timer: 1500,
      })
    }
    else if (!this.location.latitude || !this.location.longitude) {
      Swal.fire({
        title: 'Empty Address',
        text: 'Please open your GPS and wait for a while',
        heightAuto: false,
        timer: 2000
      }).then(() => {
        this.getaddress()
      })
    }
    else if (!this.addressstring) {
      Swal.fire({
        title: 'Empty Address',
        text: 'Please open your GPS and wait for a while',
        heightAuto: false,
        timer: 2000
      }).then(() => {
        this.getaddress().then(()=> {
          this.submit()
        })
      })
    }
    else
    {
      Swal.fire({
        text: 'Are you sure to update the label for this appointment?',
        icon: 'info',
        heightAuto: false,
        showCancelButton: true,
        reverseButtons: true,
      }).then(a => {
        if(a['isConfirmed'])
        {
          Swal.fire({
            text: 'Processing...',
            icon: 'info',
            heightAuto: false,
            showConfirmButton: false,
          })
          this.http.post('https://api.nanogapp.com/insertCheckOut', {
            label_m : this.label.mainlabel.id,
            label_s : this.label.sublabel.id,
            lead_id : this.leadid,
            uid : this.userid,
            image : JSON.stringify(this.imageurl) || JSON.stringify([]),
            // label_video : JSON.stringify(this.videourl) || JSON.stringify([]),
            remark : this.label.remark,

            latt: this.location.latitude,
            long: this.location.longitude,
            // image: JSON.stringify(this.imageurl),
            aid: this.taskid,
            checkin_address: this.addressstring,
            check_status : 'hold' , 
            event_time : this.eventtime ? new Date(this.eventtime).getTime() : new Date().getTime() 
          }).subscribe(a => {
            // console.log(a)
            setTimeout(() => {
              Swal.close()
              Swal.fire({
                title: 'Success',
                icon: 'success',
                text: 'Update Successfully',
                heightAuto: false,
                timer: 3000,
              })
              this.nav.pop()
            }, 700);
          })
        }
      })
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
      // console.log(data)
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
        // console.log('There was an error uploading file: ' + err)
        return false
      }


      Swal.close()

      // console.log('Successfully uploaded file.', data)

      // // console.log(i)
      // console.log(data);

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

  removePhoto(i) {
    Swal.fire({
      title: 'Are you sure want to delete this photo?',
      heightAuto: false,
      showCancelButton: true,
      reverseButtons: true
    }).then(a => {
      if (a['isConfirmed']) {
        this.imageurl.splice(i, 1)
      }
      else if (a['isDismissed']) {

      }
    })
  }

  viewPhoto(i) {
    this.nav.navigateForward('image-viewer?imageurl=' + this.imageurl[i])
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
      quality : 25,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetHeight: 1000,
      targetWidth: 600,
      // correctOrientation: true,
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
        // // console.log('here')
        // // console.log(event.target.files[i].type)
        this.imagectype = event.target.files[i].type;
        // // console.log(this.imagectype)
        // // console.log(event.target.files[0])
        // EXIF.getData(event.target.files[0], () => {
        //   // console.log('run here 4')
        //   // console.log(event.target.files[0]);
        //   // console.log(event.target.files[0].exifdata.Orientation);
        //   const orientation = EXIF.getTag(this, 'Orientation');
          const can = document.createElement('canvas');
          const ctx = can.getContext('2d');
          const thisImage = new Image;
          const maxW = maxsize;
          const maxH = maxsize;
          thisImage.onload = (a) => {

            // // console.log(a);
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
            // this.base64img = imgarr[1];
            let base64 = imgarr[1]
            event.target.value = '';

            const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
            let body = new URLSearchParams()
            body.set('image', this.base64img)

            // // console.log(base64)

            this.http.post('https://api.nanogapp.com/upload', { image: this.imagec, folder: 'nanog', userid: 'nanog' }).subscribe((res) => {
              // // console.log('run here 2')
              // // console.log(res)
              this.imageurl.push(res['imageURL'])
              Swal.close()
              resolve(res['imageURL'])
            }, awe => {
              // console.log('run here 3')
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

  async getaddress() {
    Swal.fire({
      title: 'Processing',
      icon: 'info',
      showConfirmButton: false,
      heightAuto: false
    })
    this.getlocation().then(b => {
      this.convertlocation()
      // Swal.close()
    })
  }

  async getlocation() {
    return new Promise((resolve, reject) => {
      this.geolocation.getCurrentPosition().then((resp) => {
        // console.log(resp)
        this.location = resp.coords
        resolve(this.location)
      }).catch((error) => {
        // console.log('Error getting location', error);
        reject()
      });
    })
  }


  convertlocation() {
    let geocoder = new google.maps.Geocoder;
    let latlng = { lat: this.location.latitude, lng: this.location.longitude };
    geocoder.geocode({ 'location': latlng }, (results, status) => {
      // console.log(results);
      // console.log(status);
      if (results.length > 0) {
        this.addressstring = results[0].formatted_address
        this.addressstring = this.addressstring.toString()
        Swal.close()
      }
      else if (results.length < 1) {
        this.addressstring = 'Undefined Address'
        Swal.close()
      }
      // console.log(this.addressstring)

    });
  }

}
