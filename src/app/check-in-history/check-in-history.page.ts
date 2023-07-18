import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@awesome-cordova-plugins/native-geocoder/ngx';
import { NavController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-check-in-history',
  templateUrl: './check-in-history.page.html',
  styleUrls: ['./check-in-history.page.scss'],
})
export class CheckInHistoryPage implements OnInit {

  constructor(private route : ActivatedRoute, private http: HttpClient, private nav : NavController,private nativeGeocoder: NativeGeocoder,
    private platform : Platform) { }

  appointment = {} as any
  user = {} as any
  imageurl = [] as any
  address = [] as any
  addressstring

  ngOnInit() {
    this.route.queryParams.subscribe(a => {
      console.log(a)
      this.http.post('https://api.nanogapp.com/getAppointmentDetails', {id: a.tid}).subscribe(s => {
        console.log(s)
        this.appointment = s['data']
        console.log(this.appointment)
        this.imageurl = s['data']['checkin_img']
        console.log(this.imageurl)

        this.convertlocation()
      })

      this.http.post('https://api.nanogapp.com/getSalesExec', { uid: a.uid }).subscribe((s) => {
        this.user = s['data']
        console.log(this.user)
      })
    })

  }

  convertlocation(){
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };

    this.nativeGeocoder.reverseGeocode(this.appointment.checkin_latt, this.appointment.checkin_long, options)
    .then((result: NativeGeocoderResult[]) => {

        console.log(JSON.stringify(result[0]))
        this.address = result[0]

        let address = []
        let temp2 = this.address.postalCode + ' ' + this.address.locality
        if(this.address.areasOfInterest[0] == this.address.subThoroughfare)
        {
          address.push(this.address.subThoroughfare)
          address.push(this.address.thoroughfare)
          address.push(this.address.subLocality)
          address.push(temp2)
          address.push(this.address.subAdministrativeArea)
          address.push(this.address.administrativeArea)
          address.push(this.address.countryName)
        }
        else
        {
          address.push(this.address.areasOfInterest)
          address.push(this.address.subThoroughfare)
          address.push(this.address.thoroughfare)
          address.push(this.address.subLocality)
          address.push(temp2)
          address.push(this.address.subAdministrativeArea)
          address.push(this.address.administrativeArea)
          address.push(this.address.countryName)
        }
        this.addressstring = address.filter(a => a != '')
        this.addressstring = this.addressstring.toString()
        console.log(this.addressstring)

      }
    )
    .catch((error: any) => console.log(error));
  }

  viewPhoto(x)
  {
    this.nav.navigateForward('image-viewer?imageurl=' + x)
  }

  back(){
    this.nav.pop()
  }

  platformType(){
    return this.platform.platforms()
  }


}
