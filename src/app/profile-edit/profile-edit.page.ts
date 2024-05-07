import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { NavController, Platform } from '@ionic/angular';
import Swal from 'sweetalert2';
import firebase from 'firebase';
import 'firebase/database';
import { Plugins } from '@capacitor/core';
const { Camera } = Plugins;

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.scss'],
})
export class ProfileEditPage implements OnInit {

  constructor(private route: ActivatedRoute, private http: HttpClient, 
    // private camera: Camera,
     private nav: NavController,
    private platform: Platform) { }

  user = {} as any
  temp = [] as any
  checker
  tick = 0
  photo
  state = ['Johor', 'Kelantan', 'Kedah', 'Kuala Lumpur', 'Labuan', 'Malacca', 'Negeri Sembilan', 'Pahang', 'Penang', 'Perak', 'Perlis', 'Putrajaya', 'Sabah', 'Sarawak', 'Selangor', 'Terengganu'] as any
  ngOnInit() {

    this.route.queryParams.subscribe(a => {
      this.http.post('https://api.nanogapp.com/getSalesExec', { uid: a.uid }).subscribe(s => {
        this.user = s['data']
        this.user.keyword = this.user.user_state
        // console.log(this.user)
        this.checker = this.user.user_state
      })
    })
  }

  ionfocus(ev, num) {
    document.getElementById(num).style.border = '2px solid #6DAD48'
  }

  ionblur(ev, num) {
    document.getElementById(num).style.border = '1px solid #cacaca'
  }

  filter(x) {
    this.temp = this.state ? this.state.filter(a => a.toLowerCase().includes(x.toLowerCase())) : []
    // console.log(this.temp)
  }

  getfilter(x) {
    this.user.keyword = x
    this.checker = x
  }

  clearfilterlist() {
    this.temp = []
  }

  takephoto() {
    // const options: CameraOptions = {
    //   quality: 50,
    //   destinationType: this.camera.DestinationType.DATA_URL,
    //   encodingType: this.camera.EncodingType.JPEG,
    //   mediaType: this.camera.MediaType.PICTURE,
    //   correctOrientation: true,
    //   saveToPhotoAlbum: true
    // }

    // this.camera.getPicture(options).then((imageData) => {
    //   let base64Image = 'data:image/jpeg;base64,' + imageData;
    //   this.photo = base64Image
    // },
    //   (err) => {
    //     alert(err)
    //   });


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
        this.photo = base64Image

      } catch (error) {
        console.error('Error taking photo', error);
        // Handle error
      }
    })
  }

  cancel() {
    this.nav.pop();
  }

  getfirstselection() {
    this.user.keyword = this.temp[0]
    this.checker = this.temp[0]
    // console.log(this.user.keyword)
  }

  submit() {
    this.user.user_state = this.user.keyword
    // if (!this.user.user_name) {
    //   Swal.fire({
    //     icon: 'error',
    //     title: 'Name cannot be empty',
    //     heightAuto: false,
    //     timer: 2000
    //   })
    // }
    // else if (!this.user.user_phone_no) {
    //   Swal.fire({
    //     icon: 'error',
    //     title: 'Phone number cannot be empty',
    //     heightAuto: false,
    //     timer: 2000
    //   })
    // }

    let checkstate = this.state.filter(a => a.toLowerCase() == this.user.user_state.toLowerCase())

    if (!this.user.user_address) {
      Swal.fire({
        icon: 'error',
        text: 'Address cannot be empty',
        heightAuto: false,
        timer: 2000
      })
    }
    else if (!this.user.user_state) {
      Swal.fire({
        icon: 'error',
        text: 'State cannot be empty',
        heightAuto: false,
        timer: 2000
      })
    }
    else if (checkstate.length < 1) {
      Swal.fire({
        icon: 'error',
        text: 'Incorrect State',
        heightAuto: false,
        timer: 2000
      })
    }
    else {

      Swal.fire({
        text: 'Are you sure to save the change?',
        showCancelButton: true,
        heightAuto: false,
        reverseButtons: true,
        cancelButtonColor: 'red',
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: 'processing...',
            icon: 'info',
            heightAuto: false,
            allowOutsideClick: false,
            showConfirmButton: false,
          })
          this.uploadserve().then(pictureurl => {
            this.http.post('https://api.nanogapp.com/updateSalesExec', {
              name: this.user.user_name,
              phone: this.user.user_phone_no,
              address: this.user.user_address,
              state: this.user.user_state,
              image: pictureurl || '',
              uid: this.user.uid
            }).subscribe(a => {
              // console.log(a)
              if (a['success'] == 1) {
                Swal.fire({
                  title: 'Success',
                  icon: 'success',
                  text: 'Update Successfully',
                  heightAuto: false,
                  timer: 3000,
                })
              } else {
                Swal.fire({
                  title: 'Somthing Wrong ',
                  icon: 'error',
                  text: 'Please try again later',
                  heightAuto: false,
                  timer: 3000,
                })

              }
            }, r => {
              Swal.fire({
                title: 'Somthing Wrong ',
                icon: 'error',
                text: 'Please try again later',
                heightAuto: false,
                timer: 3000,
              })
            }
            )
          })
        }
      })

    }
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
        resolve(this.user.profile_image)
      }
    })
  }

  back() {
    this.nav.pop();
  }

  logout() {
    Swal.fire({
      title: 'Are you sure want to log out',
      icon: 'info',
      heightAuto: false,
      showCancelButton: true,
      reverseButtons: true
    }).then(a => {
      if (a['isConfirmed'] == true) {
        firebase.auth().signOut()
      }
    })

  }

  // imgur(event) {

  //   // console.log(event)
  //   let imgurheaders = new HttpHeaders({
  //     'Authorization': 'Client-ID 2dc0beb00bb3279'
  //   });

  //   return new Promise((resolve, reject) => {
  //     if (event.target.files && event.target.files[0] && event.target.files[0].size < (81928192)) {
  //       var canvas = <HTMLCanvasElement>document.createElement("canvas");
  //       var ctx = canvas.getContext("2d");
  //       var cw = canvas.width;
  //       var ch = canvas.height;
  //       var maxW = 400;
  //       var maxH = 400;
  //       var type = event.target.files[0].type;
  //       var img = new Image;
  //       img.onload = () => {
  //         var iw = img.width;
  //         var ih = img.height;
  //         var scale = Math.min((maxW / iw), (maxH / ih));
  //         var iwScaled = iw * scale;
  //         var ihScaled = ih * scale;
  //         canvas.width = iwScaled;
  //         canvas.height = ihScaled;
  //         ctx.drawImage(img, 0, 0, iwScaled, ihScaled);
  //         event.target.value = ''


  //         let imagec = canvas.toDataURL();
  //         // console.log(imagec)

  //         let imgggg = imagec.replace(';base64,', "thisisathingtoreplace;")
  //         let imgarr = imgggg.split("thisisathingtoreplace;")
  //         let base64String = imgarr[1]

  //         let body = {
  //           image: base64String // this is the base64img from upper part
  //         }

  //         this.http.post('https://api.imgur.com/3/image', body, { headers: imgurheaders }).subscribe(res => {
  //           resolve(res['data'].link)
  //         }, awe => {
  //           reject(awe)
  //         })
  //       }

  //       img.src = URL.createObjectURL(event.target.files[0]);
  //     } else {
  //       reject({ success: false, message: '"Your Current Image Too Large, " + event.target.files[0].size / (10241024) + "MB! (Please choose file lesser than 8MB)"' })
  //       alert("Your Current Image Too Large, " + event.target.files[0].size / (10241024) + "MB! (Please choose file lesser than 8MB)")
  //     }
  //   })
  // }

  // fileChange() {
  //   this.imgur(this.photo).then(a => {
  //     // console.log(a);
  //     this.user.profile_image = a
  //     // eval(z + "=a")
  //   })
  // }

  platformType() {
    return this.platform.platforms()
  }

  view(x) {
    this.nav.navigateForward('image-viewer?imageurl=' + x)
  }

}
