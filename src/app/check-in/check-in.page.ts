import { Component, OnInit, ViewChild } from '@angular/core';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';

import { HttpClient, HttpHeaders } from '@angular/common/http';

// import { Storage } from '@ionic/storage-angular';

import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions, CaptureVideoOptions } from '@awesome-cordova-plugins/media-capture/ngx';
import { File, FileEntry } from '@awesome-cordova-plugins/file/ngx';
import { Media, MediaObject } from '@awesome-cordova-plugins/media/ngx';
import { StreamingMedia, StreamingVideoOptions } from '@awesome-cordova-plugins/streaming-media/ngx';
// import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
// import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';

import { DomSanitizer } from '@angular/platform-browser'
import { ActionSheetController, NavController, Platform } from '@ionic/angular';

// import { VideoPlayer } from '@awesome-cordova-plugins/video-player/ngx';
import { ActivatedRoute } from '@angular/router';

import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@awesome-cordova-plugins/native-geocoder/ngx';

import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';

import Swal from 'sweetalert2'
import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';


import {
  GoogleMap,
  MapInfoWindow,
  MapGeocoder,
  MapGeocoderResponse,
} from '@angular/google-maps';

const MEDIA_FOLDER_NAME = 'my_media';

const MEDIA_FILES_KEY = 'mediaFiles';

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.page.html',
  styleUrls: ['./check-in.page.scss']
})
export class CheckInPage implements OnInit {


  //   mediaFiles = [];
  //   @ViewChild('myvideo') myVideo: any;

  //   constructor(public navCtrl: NavController, private mediaCapture: MediaCapture, private storage: Storage, private file: File, private media: Media) {}

  //   ionViewDidLoad() {
  //     this.storage.get(MEDIA_FILES_KEY).then(res => {
  //       this.mediaFiles = JSON.parse(res) || [];
  //     })
  //   }

  //   captureAudio() {
  //     this.mediaCapture.captureAudio().then(res => {
  //       this.storeMediaFiles(res);
  //     }, (err: CaptureError) => console.error(err));
  //   }

  //   captureVideo() {
  //     let options: CaptureVideoOptions = {
  //       limit: 1,
  //     }
  //     this.mediaCapture.captureVideo(options).then((res: MediaFile[]) => {
  //       let capturedFile = res[0];
  //       let fileName = capturedFile.name;
  //       let dir = capturedFile['localURL'].split('/');
  //       dir.pop();
  //       let fromDirectory = dir.join('/');      
  //       var toDirectory = this.file.dataDirectory;

  //       console.log(fromDirectory , fileName , toDirectory , fileName)

  //       this.file.copyFile(fromDirectory , fileName , toDirectory , fileName).then((res) => {
  //         this.storeMediaFiles([{name: fileName, size: capturedFile.size}]);
  //       },err => {
  //         console.log('err: ', err);
  //       });
  //           },
  //     (err: CaptureError) => console.error(err));
  //   }

  //   play(myFile) {
  //     if (myFile.name.indexOf('.wav') > -1) {
  //       const audioFile: MediaObject = this.media.create(myFile.localURL);
  //       audioFile.play();
  //     } else {
  //       let path = this.file.dataDirectory + myFile.name;
  //       let url = path.replace(/^file:\/\//, '');
  //       let video = this.myVideo.nativeElement;
  //       video.src = url;
  //       video.play();
  //     }
  //   }

  //   storeMediaFiles(files) {
  //     this.storage.get(MEDIA_FILES_KEY).then(res => {
  //       if (res) {
  //         let arr = JSON.parse(res);
  //         arr = arr.concat(files);
  //         this.storage.set(MEDIA_FILES_KEY, JSON.stringify(arr));
  //       } else {
  //         this.storage.set(MEDIA_FILES_KEY, JSON.stringify(files))
  //       }
  //       this.mediaFiles = this.mediaFiles.concat(files);
  //     })
  //   }
  // }
  while_check_status
  gps = false

  task = {} as any
  checkin = [] as any
  user = {} as any

  photo = [] as any
  imageurl = [] as any

  selectedtask = {} as any

  location = {} as any
  address = {} as any
  addressstring

  files = []

  checkinvideo = [] as any
  checkinphoto = [] as any

  videopath
  safeUrl

  open
  leadid
  userid
  checkin_status

  customer = [] as any
  appointment_time : any

  constructor(
    private camera: Camera,
    private mediaCapture: MediaCapture,
    private sanitizer: DomSanitizer,
    // private imagePicker : ImagePicker,
    private file: File,
    private media: Media,
    private streamingMedia: StreamingMedia,
    // private photoViewer: PhotoViewer,
    private actionSheetController: ActionSheetController,
    private plt: Platform,
    // private videoPlayer: VideoPlayer,
    private http: HttpClient,
    private route: ActivatedRoute,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private nav: NavController,
    private locationAccuracy: LocationAccuracy,
    private platform: Platform,
    private diagnostic: Diagnostic
  ) { }


  // ngOnInit() {
  //   this.plt.ready().then(() => {
  //     let path = this.file.dataDirectory;
  //     console.log(path, MEDIA_FOLDER_NAME)
  //     this.file.checkDir(path, MEDIA_FOLDER_NAME).then(
  //       () => {
  //         this.loadFiles();
  //       },
  //       err => {
  //         this.file.createDir(path, MEDIA_FOLDER_NAME, false);
  //       }
  //     );
  //   });
  // }

  // ngOnInit() {
  //   this.route.queryParams.subscribe(a => {
  //     console.log(a)
  //     this.task = a
  //     this.leadid = a['lid']
  //     this.userid = a['uid']
  //     this.checkin_status = a['checkin_status']
  //     this.appointment_time = a['time']
  //     this.checkin.now = 1690830530001
  //     this.http.post('https://api.nanogapp.com/getSalesExec', { uid: a.uid }).subscribe((s) => {
  //       this.user = s['data']
  //       console.log(this.user)
  //     })
  //     this.checkingstatus()
  //   })
  // }

  ngOnInit() {
    console.log('address string', this.addressstring)

    this.getaddress()
    // this.getphoto()
    this.gpsstatuschecker()
    this.platformType()

    console.log(this.platformType())

    this.route.queryParams.subscribe(a => {
      console.log(a)
      this.task = a
      this.leadid = a['lid']
      this.userid = a['uid']
      this.checkin_status = a['checkin_status']
      this.appointment_time = a['time']
      this.http.post('https://api.nanogapp.com/getSalesExec', { uid: a.uid }).subscribe((s) => {
        this.user = s['data']
        console.log(this.user)
      })
      // this.selectedtask = this.customer.filter(x => (x['tid'].toLowerCase()).includes(a['tid'].toLowerCase()))
      // console.log(this.selectedtask)

    })
  }

  gpsstatuschecker() {
    this.platform.ready().then(() => {
      this.diagnostic.registerLocationStateChangeHandler((a) => {
        if (a != 'location_off') {
          this.open = 0
        } else {
          Swal.fire({
            text: 'Please switch on GPS',
            heightAuto: false,
          })
          this.open = 1
          this.gpsstatuschecker()
        }
      })
    })
  }

  async getlocation() {
    return new Promise((resolve, reject) => {
      this.geolocation.getCurrentPosition().then((resp) => {
        console.log(resp)
        this.location = resp.coords
        resolve(this.location)
      }).catch((error) => {
        console.log('Error getting location', error);
        reject()
      });
    })
  }

  // convertlocation() {
  //   console.log('run here geocoder')
  //   console.log(this.location.latitude, this.location.longitude)
  //   let options: NativeGeocoderOptions = {
  //     useLocale: true,
  //     maxResults: 5
  //   };

  //   this.nativeGeocoder.reverseGeocode(2.7092367, 101.964655, options)
  //     .then((result: NativeGeocoderResult[]) => {

  //       console.log(JSON.stringify(result[0]))
  //       this.address = result[0]

  //       let address = []
  //       let temp2 = this.address.postalCode + ' ' + this.address.locality
  //       if (this.address.areasOfInterest[0] == this.address.subThoroughfare) {
  //         address.push(this.address.subThoroughfare)
  //         address.push(this.address.thoroughfare)
  //         address.push(this.address.subLocality)
  //         address.push(temp2)
  //         address.push(this.address.subAdministrativeArea)
  //         address.push(this.address.administrativeArea)
  //         address.push(this.address.countryName)
  //         this.addressstring = address.filter(a => a != '')
  //         this.addressstring = this.addressstring.toString()
  //         console.log(this.addressstring)

  //         Swal.close()
  //       }
  //       else {
  //         address.push(this.address.areasOfInterest)
  //         address.push(this.address.subThoroughfare)
  //         address.push(this.address.thoroughfare)
  //         address.push(this.address.subLocality)
  //         address.push(temp2)
  //         address.push(this.address.subAdministrativeArea)
  //         address.push(this.address.administrativeArea)
  //         address.push(this.address.countryName)
  //         this.addressstring = address.filter(a => a != '')
  //         this.addressstring = this.addressstring.toString()
  //         console.log(this.addressstring)

  //         Swal.close()
  //       }


  //     }
  //     ).catch((error: any) => {
  //       console.log(error)
  //       Swal.close()
  //     } 
  //     );
  // }

  async convertlocation() {
    let geocoder = new google.maps.Geocoder;
    let latlng = { lat: this.location.latitude, lng: this.location.longitude };
    geocoder.geocode({ 'location': latlng }, (results, status) => {
      console.log(results);
      console.log(status);
      if (results.length > 0) {
        this.addressstring = results[0].formatted_address
        this.addressstring = this.addressstring.toString()
        Swal.close()
      }
      else if (results.length < 1) {
        this.addressstring = 'Undefined Address'
        Swal.close()
      }
      console.log(this.addressstring)

    });
  }

  uploadserve() {
    return new Promise((resolve, reject) => {
      if (this.photo) {

        let imgggg = this.photo.replace(';base64,', "thisisathingtoreplace;")
        let imgarr = imgggg.split("thisisathingtoreplace;")
        let base64 = imgarr[1]


        const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
        let body = new URLSearchParams()
        body.set('image', base64)

        // this.http.post('https://api.imgbb.com/1/upload?expiration=0&key=c0f647e7fcbb11760226c50f87b58303', body.toString(), { headers, observe: 'response' }).subscribe(res => {
        //   resolve((res['body'])['data'].url)
        // }, awe => {
        //   reject(awe)
        // })

        this.http.post('https://api.nanogapp.com/upload', { image: base64, folder: 'nanog', userid: 'nanog' }).subscribe((res) => {
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

  async takePhoto() {
    return new Promise((resolve, reject) => {
      const options: CameraOptions = {
        quality : 25,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,

        targetHeight: 1000,
        targetWidth: 600,

        correctOrientation: true,
        saveToPhotoAlbum: true
      }

      this.camera.getPicture(options).then((imageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64 (DATA_URL):
        let base64Image = 'data:image/jpeg;base64,' + imageData;
        // this.photo.push(base64Image)
        this.checkin.now = new Date().getTime();
        console.log(base64Image)
        this.uploadserve2(base64Image).then(res => {
          Swal.close()
          resolve(res)
        })
      }, (err) => {
        console.log(err)
        // Handle error
      });
    })
  }

  async getphoto() {
    if (this.imageurl.length >= 9) {
      Swal.fire({
        title: 'Maximum nine photo',
        text: 'Please remove photo to continue',
        heightAuto: false,
        timer: 2000
      })
    }
    else if (this.imageurl.length < 9) {
      await this.takePhoto().then(a => {
        console.log(this.addressstring)
        if (!this.addressstring) {
          this.getaddress()
        }
      })
    }
  }
  timerInterval

  async getaddress() {
    Swal.fire(        {
      icon: 'info',
      title : 'Getting address...',
      heightAuto: false,
      showConfirmButton : false,
      allowOutsideClick : false,
      // showCancelButton: true,
      // reverseButtons: true,
      didOpen : () => {
        Swal.showLoading(Swal.getConfirmButton())
        let startTime = new Date().getTime();

        // Update the loading time every second
        this.timerInterval = setInterval(() => {
          const elapsedTime = Math.floor((new Date().getTime() - startTime) / 1000); // Calculate elapsed time in seconds
          
          // Update the Swal.fire dialog with the new loading time
          Swal.update({
            icon: 'info',
            title : 'Getting address...',
            html: `Loading Time: ${elapsedTime} seconds <br/> If the loading time is too long, please reopen your app and try again`,
            // allowOutsideClick: false,
            showConfirmButton : false,
            allowOutsideClick : false,
          });
        }, 1000);
        
      }
    })
    this.getlocation().then(b => {
      Swal.close()
      clearInterval(this.timerInterval);
      this.convertlocation().then(c => {
        this.takePhoto()
      })
      // Swal.close()
    })
  }
  // submit(){
  //   console.log({
  //     latt: this.location.latitude,
  //     long: this.location.longitude,
  //     time: this.checkin.now,
  //     image: JSON.stringify(this.imageurl),
  //     aid: this.task.tid,
  //     checkin_address: this.addressstring,
  //     lead_id: this.leadid,
  //     uid: this.userid,
  //     check_status : 'in' , 
  //     while_check_status : this.checkingstatus()
  //   })
  // }

  submit() {
    if (this.imageurl.length < 1) {
      Swal.fire({
        title: 'No Photo',
        text: 'Please take a photo for check in',
        heightAuto: false,
        timer: 2000
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
        this.getaddress()
      })
    }
    else {
      Swal.fire({
        title: 'Are you sure to check in?',
        icon: 'info',
        heightAuto: false,
        showCancelButton: true,
        reverseButtons: true,
      }).then(a => {

        if (a['isConfirmed']) {
          Swal.fire({
            title: 'processing...',
            icon: 'info',
            heightAuto: false,
            allowOutsideClick: false,
            showConfirmButton: false,
          })
          // let year = new Date(this.checkin.now).getFullYear()
          // let month = '' + (new Date(this.checkin.now).getMonth() + 1)
          // let date = '' + (new Date(this.checkin.now).getDate())

          // if (month.length < 2) {
          //   month = '0' + month
          // }
          // if (date.length < 2) {
          //   date = '0' + date
          // }

          // let todaystring = this.checkin.now + ''
          // let todayarray = []
          // todayarray = todaystring.split(" ")
          // let datetime = [year, month, date].join('-')
          // let datetime2 = [datetime, todayarray[4]].join(' ')
          // let datetime3 = new Date(datetime2).getTime()

          // console.log(datetime3)

          console.log(this.checkin.now)


          console.log(this.location.latitude, this.location.longitude, this.checkin.now, this.imageurl, this.task.tid)

          if(this.checkin_status == 'first')
          {
            this.http.post('https://api.nanogapp.com/checkInAppointment2', {
              latt: this.location.latitude,
              long: this.location.longitude,
              time: this.checkin.now,
              image: JSON.stringify(this.imageurl),
              aid: this.task.tid,
              checkin_address: this.addressstring,
              lead_id: this.leadid,
              uid: this.userid,
              check_status : 'in' , 
              while_check_status : this.checkingstatus()
            }).subscribe(a => {
  
              Swal.close()
  
              Swal.fire({
                title: 'Success',
                icon: 'success',
                text: 'Update Successfully',
                heightAuto: false,
                timer: 3000,
              })
  
              this.nav.pop()
  
            })
          }
          else if(this.checkin_status == 'again')
          {
            this.http.post('https://api.nanogapp.com/checkInAppointmentAgain', {
              latt: this.location.latitude,
              long: this.location.longitude,
              time: this.checkin.now,
              image: JSON.stringify(this.imageurl),
              aid: this.task.tid,
              checkin_address: this.addressstring,
              lead_id: this.leadid,
              uid: this.userid,
              check_status : 'in' , 
              while_check_status : this.checkingstatus()
            }).subscribe(a => {
  
              Swal.close()
  
              Swal.fire({
                title: 'Success',
                icon: 'success',
                text: 'Update Successfully',
                heightAuto: false,
                timer: 3000,
              })
  
              this.nav.pop()
  
            })
          }


        }
      })
    }
  }

  checkingstatus() : string{
    let temp
    let num1 = this.checkin.now
    let num2 = this.appointment_time
    if(num1 <= num2)
    {
      if(num2 - num1 <= 3600000)
      {
        temp = 'within 1 hour early'
      }
      else if((num2 - num1 > 3600000) && (num2 - num1 <= 86400000))
      {
        temp = 'more than 1 hour early'
      }
      else if(num2 - num1 > 86400000)
      {
        temp = 'more than 1 day early'
      }
    }
    else if(num1 > num2)
    {
      if(num1 - num2 <= 3600000)
      {
        temp = 'within 1 hour late'
      }
      else if(num1 - num2 > 3600000 && (num1 - num2 <= 86400000))
      {
        temp = 'more than 1 hour late'
      }
      else if(num1 - num2 > 86400000)
      {
        temp = 'more than 1 day late'
      }
    }
    console.log(this.checkin.now) 
    console.log(this.appointment_time)
    
    return temp
  }

  cancel() {
    this.nav.pop()
  }

  back() {
    this.nav.pop()
  }

  viewPhoto(i) {
    this.nav.navigateForward('image-viewer?imageurl=' + this.imageurl[i])
  }

  // viewPhoto(x)
  // {
  //   this.nav.navigateForward('image-viewer?imageurl=' + x)
  // }


  removePhoto(x) {
    console.log(x)
    let findphoto = this.imageurl.findIndex(a => a == x)
    console.log(findphoto)
    if (findphoto != -1) {
      this.imageurl.splice(findphoto, 1)
    }
  }

  // loadFiles() {
  //   this.file.listDir(this.file.dataDirectory, MEDIA_FOLDER_NAME).then(
  //     res => {
  //       this.files = res;
  //     },
  //     err => console.log('error loading files: ', err)
  //   );
  // }

  // async selectMedia() {
  //   const actionSheet = await this.actionSheetController.create({
  //     header: 'What would you like to add?',
  //     buttons: [
  //       {
  //         text: 'Capture Image',
  //         handler: () => {
  //           this.captureImage();
  //         }
  //       },
  //       {
  //         text: 'Record Video',
  //         handler: () => {
  //           this.recordVideo();
  //         }
  //       },
  //       {
  //         text: 'Record Audio',
  //         handler: () => {
  //           this.recordAudio();
  //         }
  //       },
  //       // {
  //       //   text: 'Load multiple',
  //       //   handler: () => {
  //       //     this.pickImages();
  //       //   }
  //       // },
  //       {
  //         text: 'Cancel',
  //         role: 'cancel'
  //       }
  //     ]
  //   });
  //   await actionSheet.present();
  // }

  // pickImages() {
  //   this.imagePicker.getPictures({}).then(
  //     results => {
  //       for (var i = 0; i < results.length; i++) {
  //         this.copyFileToLocalDir(results[i]);
  //       }
  //     }
  //   );

  // }

  //   captureImage() {
  //     this.mediaCapture.captureImage().then(
  //       (data: MediaFile[]) => {
  //         if (data.length > 0) {
  //           this.copyFileToLocalDir(data[0].fullPath);
  //         }
  //       },
  //       (err: CaptureError) => console.error(err)
  //     );
  //   }

  //   recordAudio() {
  //     this.mediaCapture.captureAudio().then(
  //       (data: MediaFile[]) => {
  //         if (data.length > 0) {
  //           this.copyFileToLocalDir(data[0].fullPath);
  //         }
  //       },
  //       (err: CaptureError) => console.error(err)
  //     );
  //   }

  //   recordVideo() {
  //     this.mediaCapture.captureVideo().then(
  //       (data: MediaFile[]) => {
  //         if (data.length > 0) {
  //           this.copyFileToLocalDir(data[0].fullPath);
  //         }
  //       },
  //       (err: CaptureError) => console.error(err)
  //     );
  //   }


  //  copyFileToLocalDir(fullPath) {
  //     let myPath = fullPath;
  //     // Make sure we copy from the right location
  //     if (fullPath.indexOf('file://') < 0) {
  //       myPath = 'file://' + fullPath;
  //     }

  //     const ext = myPath.split('.').pop();
  //     const d = Date.now();
  //     const newName = `${d}.${ext}`;

  //     const name = myPath.substr(myPath.lastIndexOf('/') + 1);
  //     const copyFrom = myPath.substr(0, myPath.lastIndexOf('/') + 1);
  //     const copyTo = this.file.dataDirectory + MEDIA_FOLDER_NAME + '/';

  //     const copyfrom2 = copyFrom + name
  //     const copyto2 = copyTo + newName

  //     this.file.copyFile(copyFrom, name , copyTo , newName).then(
  //       success => {
  //         this.loadFiles();
  //       },
  //       error => {
  //         console.log('error: ', error);
  //       }
  //     );
  //   }

  //   openFile(f: FileEntry) {
  //     if (f.name.indexOf('.wav') > -1) {
  //       // We need to remove file:/// from the path for the audio plugin to work
  //       const path =  f.nativeURL.replace(/^file:\/\//, '');
  //       const audioFile: MediaObject = this.media.create(path);
  //       audioFile.play();
  //     } else if (f.name.indexOf('.MOV') > -1 || f.name.indexOf('.mp4') > -1) {

  //       // this.videoPlayer.play(f.nativeURL).then(() => {
  //       //   console.log('video completed')
  //       // }).catch(err => {
  //       //   console.log(err)
  //       // });
  //       let options: StreamingVideoOptions = {
  //           // orientation: 'landscape',
  //           controls : true,
  //       }
  //       this.streamingMedia.playVideo(f.nativeURL, options);
  //     } else if (f.name.indexOf('.jpg') > -1) {
  //       // E.g: Use the Photoviewer to present an Image
  //       this.photoViewer.show(f.nativeURL, f.name);
  //     }
  //   }

  //   deleteFile(f: FileEntry) {
  //     const path = f.nativeURL.substr(0, f.nativeURL.lastIndexOf('/') + 1);
  //     this.file.removeFile(path, f.name).then(() => {
  //       this.loadFiles();
  //     }, err => console.log('error remove: ', err));
  //   }

  // takeVideo() {
  //   let options: CaptureVideoOptions = { limit : 1 }
  //   this.mediaCapture.captureVideo(options)
  //     .then(
  //       (data: MediaFile[]) => {
  //         console.log(data)
  //         this.checkinvideo.push(data[0]['localURL'])

  //       },
  //       (err: CaptureError) => alert(err)
  //     );

  //     console.log(this.checkinvideo)
  // }

  platformType() {
    return this.platform.platforms()
  }


}
