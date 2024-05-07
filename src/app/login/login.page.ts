import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import firebase from 'firebase';
import 'firebase/database';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  eye = false

  user = {} as any

  constructor(private nav: NavController,
    private http: HttpClient,
    private platform: Platform) { }

  ngOnInit() {

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // console.log(user)
        this.user.uid = user.uid
        console.log(this.user.uid)
        localStorage.setItem('nanogapp_uid', this.user.uid)
        this.http.post('https://api.nanogapp.com/getSalesExec', { uid: this.user.uid }).subscribe((a) => {
          this.user = a['data']
          console.log(this.user)

          if (this.user) {

            Swal.fire({
              title: 'Welcome',
              text: this.user.user_name,
              timer: 1500,
              showConfirmButton: false,
              icon: 'success',
              heightAuto: false
            }).then(a => {

              // console.log(a)
              if (this.user['user_role'] == 'Sales Executive') {
                this.nav.navigateRoot("home2?uid=" + this.user.uid)
              }
              else if (this.user['user_role'] == 'Project Coordinator') {
                this.nav.navigateRoot("pc-home?uid=" + this.user.uid)
                // Swal.fire({
                //   text: 'Developing....',
                //   heightAuto: false,
                //   icon: 'warning',
                // })
              }
              // 
            })

          } else {
            firebase.auth().signOut()
          }

        })

        // firebase.database().ref("users/" + this.user.uid).on('value', (a) => {
        //   this.user = a.val()
        //   // console.log(this.user)
        //   Swal.fire({
        //     title: 'Welcome',
        //     text: this.user.name,
        //     timer: 1500,
        //     showConfirmButton: false,
        //     icon: 'success',
        //     heightAuto: false
        //   }).then(a => {
        //     this.nav.navigateRoot("home?uid=" + this.user.uid)
        //   })
        // })
      }
    })
  }

  focus(ev, num) {
    document.getElementById(num).style.border = '1.5px solid #6DAD48'
  }

  blur(ev, num) {
    document.getElementById(num).style.border = '1px solid #CBDF7D'
  }

  login() {
    firebase.auth().signInWithEmailAndPassword(this.user.email, this.user.password).then(a => {
      // console.log(a)
    }).catch(e => {
      Swal.fire({
        text: e.message,
        heightAuto: false
      })
    });
  }

  gotoregister() {
    this.nav.navigateForward('createuser')
  }

  forgotpassword() {
    this.nav.navigateForward('forgot-password')
    // firebase.auth().sendPasswordResetEmail('')
  }

  platformType() {
    return this.platform.platforms()
  }

}
