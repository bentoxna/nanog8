import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-service-package-detail',
  templateUrl: './service-package-detail.page.html',
  styleUrls: ['./service-package-detail.page.scss'],
})
export class ServicePackageDetailPage implements OnInit {

  package_id

  constructor(private route : ActivatedRoute, private http : HttpClient,
    private platform : Platform) { }

  ngOnInit() {

    this.route.queryParams.subscribe(a => {
      this.package_id = a['pid']

      this.http.post('https://api.nanogapp.com/getPackagesByPackageId', {pid : a['pid']}).subscribe(a => {
        // console.log(a['data'])
      })
    })
  }

  platformType(){
    return this.platform.platforms()
  }

}
