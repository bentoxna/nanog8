import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import firebase from 'firebase';
import 'firebase/database';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {

  constructor(private nav : NavController){}
    
  canLoad(
    route: Route,
    segments: UrlSegment[]): Promise<boolean>  {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged((user) => {
        if(user){
          resolve(true)
        }else{
          resolve(false)
          this.nav.navigateRoot('login')
        }
      })
    });
  }
  
}
