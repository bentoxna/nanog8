import { Component, OnInit } from '@angular/core';
import firebase from 'firebase';
import "firebase/database";
import "firebase/auth";
import Swal from 'sweetalert2'
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-createuser',
  templateUrl: './createuser.page.html',
  styleUrls: ['./createuser.page.scss'],
})
export class CreateuserPage implements OnInit {

  user = {} as any

  constructor(private router: Router,
    private platform : Platform) { }

  ngOnInit() {
  }

  register() {
    firebase.auth().createUserWithEmailAndPassword(this.user.email, this.user.password).then(a => {
      Swal.fire({
        title: 'Register Successfully',
        text: 'Click "Login" to redirect to login page',
        icon: 'success',
        confirmButtonText: 'Login',
        heightAuto: false
      }).then((result => {
        if (result.isConfirmed) {
          this.goToLogin();
        }
      }))
      this.user.uid = a.user.uid
      this.user.role = "sales executive"
      firebase.database().ref('users/' + a.user.uid).update(this.user)
    }).catch(a => {
      switch (a.code) {
        case 'auth/email-already-in-use':
          Swal.fire({
            text: a.message,
            heightAuto: false
          });
        case 'auth/invalid-email':
          Swal.fire({
            text: a.message,
            heightAuto: false
          });
          break;
        case 'auth/operation-not-allowed':
          Swal.fire({
            text: a.message,
            heightAuto: false
          });
          break;
        case 'auth/weak-password':
          Swal.fire({
            text: a.message,
            heightAuto: false
          });
          break;
        default:
          Swal.fire({
            text: a.message,
            heightAuto: false
          });
          break;
      }
    });
  }

  goToLogin() {
    this.router.navigateByUrl('/login')
  }

  platformType(){
    return this.platform.platforms()
  }

}
