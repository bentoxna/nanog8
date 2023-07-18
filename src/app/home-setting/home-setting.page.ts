import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import firebase from 'firebase';
import 'firebase/database';

@Component({
  selector: 'app-home-setting',
  templateUrl: './home-setting.page.html',
  styleUrls: ['./home-setting.page.scss'],
})
export class HomeSettingPage implements OnInit {

  constructor(private modal : ModalController, private platform : Platform) { }

  ngOnInit() {
  }

  modaldismiss(){
    this.modal.dismiss()
  }

  signout(){
    this.modal.dismiss()
    firebase.auth().signOut()
  }

  platformType(){
    return this.platform.platforms()
  }
}
