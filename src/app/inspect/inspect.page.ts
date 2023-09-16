import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetButton, ActionSheetController, NavController } from '@ionic/angular';
import Swal from 'sweetalert2';
import * as S3 from 'aws-sdk/clients/s3';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';

@Component({
  selector: 'app-inspect',
  templateUrl: './inspect.page.html',
  styleUrls: ['./inspect.page.scss'],
})
export class InspectPage implements OnInit {

  salesid
  leadid 
  appointmentid
  inspect = {} as any
  uid = localStorage.getItem('nanogapp_uid') || ''

  constructor(private route : ActivatedRoute,
    private nav : NavController,
    private http : HttpClient,
    private actionSheetController : ActionSheetController,
    private camera: Camera) { }

  ngOnInit() {
    this.route.queryParams.subscribe(a => {
      console.log(a)
      this.salesid = a['salesid']
      this.leadid = a['leadid']
      this.appointmentid = a['aid']

      this.refresher()

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

  refresher(){
    this.http.post('https://api.nanogapp.com/getinspectation', {lead_id : this.leadid}).subscribe(a => {
      console.log(a)
      if(a['data'])
      {
        this.inspect = a['data']
        this.imageurl = this.inspect['label_photo'] || []
        console.log(this.inspect)

        this.videourl = (this.inspect['label_video']) || []
      }
    })
  }

  back(){
    this.nav.pop()
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
        {
          cssClass: 'actionsheet-cancel',
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    await actionsheet.present()
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
        {
          cssClass: 'actionsheet-cancel',
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    await actionsheet.present()
  }

  captureImage() {
    const options: CameraOptions = {
      quality: 25,
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
  imageurl = [] as any
  videourl = [] as any

  fileChange2(event, maxsize) {
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

            ctx.drawImage(thisImage, 0, 0, iwScaled, ihScaled);
            ctx.restore();

            this.imagec = can.toDataURL();
            
            this.http.post('https://api.nanogapp.com/upload', { image: this.imagec, folder: 'nanog', userid: 'nanog' }).subscribe((res) => {
              this.imageurl.push(res['imageURL'])
              Swal.close()
              resolve(res['imageURL'])
            }, awe => {
              console.log('run here 3')
              reject(awe)
            })


          };
          thisImage.src = URL.createObjectURL(event.target.files[i]);
          // });
        }
      }

    })
  }

  uploadFile(event) {
    let uploadedFile = event.target.files;
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

    console.log(file)
    console.log(file.type)

    const bucket = new S3({
      region: 'ap-southeast-1',
      accessKeyId: "AKIA4FJWF7YCVSZJKLFE",
      secretAccessKey: "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",
      signatureVersion: 'v4'
    })

    const params = {
      Bucket: 'nanogbucket',
      Key: 'video name:' + file.name,
      Body: file,
      ContentType: file.type,
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

      console.log(data);

      this.videourl.push(
        {
          link: data.Location,
          filename: file.name
        }
      )
      return true
    })

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

  viewPhoto(i) {
    this.nav.navigateForward('image-viewer?imageurl=' + this.imageurl[i])
  }


  async dataURLToBlob(dataURL) {
    const response = await fetch(dataURL);
    const blob = await response.blob();
    return blob;
  }


  submit() {


      Swal.fire({
        text: 'Are you sure to update inspection?',
        icon: 'info',
        heightAuto: false,
        showCancelButton: true,
        reverseButtons: true,
      }).then(a => {
        if (a['isConfirmed']) {
          Swal.fire({
            text: 'Processing...',
            icon: 'info',
            heightAuto: false,
            showConfirmButton: false,
          })
          this.http.post('https://api.nanogapp.com/updateinspect', {
            lead_id: this.leadid,
            uid: this.uid,
            inspect_photo: JSON.stringify(this.imageurl) || JSON.stringify([]),
            inspect_video: JSON.stringify(this.videourl) || JSON.stringify([]),
            inspect_remark: this.inspect.inspect_remark,
          }).subscribe(a => {
            console.log(a)
            setTimeout(() => {
              Swal.close()
              this.nav.pop()
            }, 700);
          })
        }
      })
  }
  
  submit2() {

    if(this.inspect['inspect_no'])
    {
      Swal.fire({
        text: 'Are you sure to update inspection?',
        icon: 'info',
        heightAuto: false,
        showCancelButton: true,
        reverseButtons: true,
      }).then(a => {
        if (a['isConfirmed']) {
          Swal.fire({
            text: 'Processing...',
            icon: 'info',
            heightAuto: false,
            showConfirmButton: false,
          })
          this.http.post('https://api.nanogapp.com/updateinspect', {
            appointment_id : this.appointmentid,
            lead_id: this.leadid,
            uid: this.uid,
            inspect_photo: JSON.stringify(this.imageurl) || JSON.stringify([]),
            inspect_video: JSON.stringify(this.videourl) || JSON.stringify([]),
            inspect_remark: this.inspect.inspect_remark,
          }).subscribe(a => {
            console.log(a)
            setTimeout(() => {
              Swal.close()
              this.nav.pop()
            }, 700);
          })
        }
      })
    }
    else
    {
      Swal.fire({
        text: 'Are you sure to insert inspection?',
        icon: 'info',
        heightAuto: false,
        showCancelButton: true,
        reverseButtons: true,
      }).then(a => {
        if (a['isConfirmed']) {
          Swal.fire({
            text: 'Processing...',
            icon: 'info',
            heightAuto: false,
            showConfirmButton: false,
          })
          this.http.post('https://api.nanogapp.com/insertinspect', {
            appointment_id : this.appointmentid,
            lead_id: this.leadid,
            uid: this.uid,
            inspect_photo: JSON.stringify(this.imageurl) || JSON.stringify([]),
            inspect_video: JSON.stringify(this.videourl) || JSON.stringify([]),
            inspect_remark: this.inspect.inspect_remark,
          }).subscribe(a => {
            console.log(a)
            setTimeout(() => {
              Swal.close()
              this.nav.pop()
            }, 700);
          })
        }
      })
    }

  }
  

}
