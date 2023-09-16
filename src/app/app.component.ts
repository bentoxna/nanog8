import { Component } from '@angular/core';
import firebase from 'firebase';
import { firebaseConfig } from './app.firebase.config';
import { FCM } from "@capacitor-community/fcm";
import { PushNotifications } from '@capacitor/push-notifications';
import { Platform } from '@ionic/angular';
import { CapacitorUpdater, BundleInfo } from '@capgo/capacitor-updater'
import Swal from 'sweetalert2';
import { Plugins } from '@capacitor/core';
const { NativeMarket } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  version_appstore = '010038';

  showDownload = false
  showFail = false
  p_bar_value = 0;
  showLoader = false
  versioniOS = 0;
  versionAndroid = 0;


  constructor( private platform: Platform ) {
    firebase.initializeApp(firebaseConfig)

    firebase.database().ref('versions').on('value', data => {
      if (data.val()['Appstore'][this.platform.is('ios') ? "ios" : "md"][this.version_appstore]) {
        console.log('Latest Version')
      } else {
        console.log('Old Version')

        Swal.fire({
          icon: 'warning',
          title: 'Update App',
          text: 'Please update your app to the latest version.',
          heightAuto: false,
          timerProgressBar: false,
          allowOutsideClick: false,
          confirmButtonText: 'Ok',
        }).then(() => {
          this.navigateToNewVersion()
          if (this.platform.is('ios')) {
            firebase.database().ref('versions/Bundle/ios').once('value', link => {
              window.open(link.val())
            })
          } else {
            NativeMarket.openStoreListing({
              appId: 'com.nano.user'
            });
          }
        })
      }
    })

    this.platform.ready().then(() => {
      CapacitorUpdater.notifyAppReady()

      CapacitorUpdater.addListener('download', (info: any) => {
        // this.progress = `${info.percent}`
        this.showDownload = true
        this.showFail = false
        this.p_bar_value = ((info.percent / 100) >= this.p_bar_value) ? (info.percent / 100) : this.p_bar_value;

        if (this.p_bar_value >= 1) {
          this.showLoader = false
        }
      });

      CapacitorUpdater.addListener('downloadFailed', (info: any) => {
        this.showDownload = false
        this.showFail = true
      });
    })

    this.platform.resume.subscribe(async () => {
      if (this.showFail == true) {
        this.checkForUpdate()
      }
    });

    PushNotifications.requestPermissions();
    PushNotifications.register();

    firebase.auth().onAuthStateChanged(a => {
      if (a) {
        FCM.subscribeTo({ topic: a.uid })
      }
    })
  }

  navigateToNewVersion() {
    Swal.fire({
      icon: 'warning',
      title: 'Update App',
      text: 'Please update your app to the latest version.',
      heightAuto: false,
      timerProgressBar: false,
      allowOutsideClick: false,
      didOpen: () => {
       Swal.showLoading(Swal.getConfirmButton())
      },
    }).then(() => {
      this.navigateToNewVersion()
      if (this.platform.is('ios')) {

      } else {

      }
    })
  }


  checkForUpdate() {
    let appVersion = (this.platform.is('ios') ? `ios/${this.versioniOS}` : `android/${this.versionAndroid}`);
    this.showFail = false
    this.showLoader = false;
    this.showDownload = false;
    this.p_bar_value = 0;
    console.log(this.showLoader)

    firebase.database().ref('inAppUpdate/' + appVersion).once('value', async (available) => {

      if (available.exists()) {
        let availableVersion = available.val()
        let bundleList = await CapacitorUpdater.list()

        // bundleList ---> [{ version : '000001', status : 'pending' }]

        let foundBundle = bundleList.bundles.find(b => b['version'] == availableVersion['version'])
        let data: BundleInfo | null = null

        if (foundBundle == null) {
          this.showLoader = true;
          data = await CapacitorUpdater.download({
            url: availableVersion['url'],
            version: availableVersion['version'],
          })
        }

        if (data || foundBundle['status'] == 'pending') {
          await CapacitorUpdater.set((data ? data : foundBundle))
        }
      }

    })
  }

}
