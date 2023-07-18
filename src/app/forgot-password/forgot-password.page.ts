import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import firebase from 'firebase';
import 'firebase/database';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  email
  emailTest

  constructor(private nav: NavController, private platform : Platform) { }

  ngOnInit() {


  }

  sendemail() {
    if (this.email) {
      this.validateEmail(this.email)

      if (this.emailTest == true) {
        Swal.fire({
          text: 'Are you sure want to reset password with ' + this.email + ' ?',
          icon: 'info',
          heightAuto: false,
          showCancelButton: true,
          reverseButtons: true,
        }).then(a => {
          if(a['isConfirmed'] == true)
          {
            firebase.auth().sendPasswordResetEmail(this.email)
            this.nav.pop()
          }
        })

      }
      else if (this.emailTest != true) {
        Swal.fire({
          text: 'Please enter valid email',
          icon: 'error',
          heightAuto: false,
          timer: 1500,
        })
      }

    }
    else if(!this.email) {
      Swal.fire({
        text: 'Please input your email',
        icon: 'error',
        heightAuto: false,
        timer: 1500,
      })
    }

  }

  validateEmail(email) {
    if (email != '') {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      console.log(re.test(String(email).toLowerCase()))
      this.emailTest = re.test(String(email).toLowerCase())
    }
  }

  back() {
    this.nav.pop()
  }


  platformType(){
    return this.platform.platforms()
  }

}
