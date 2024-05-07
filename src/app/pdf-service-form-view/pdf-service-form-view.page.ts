import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-pdf-service-form-view',
  templateUrl: './pdf-service-form-view.page.html',
  styleUrls: ['./pdf-service-form-view.page.scss'],
})
export class PdfServiceFormViewPage implements OnInit {

  userid
  taskid
  salesid
  leadid
  serform = [] as any

  constructor(
    private nav: NavController,
    private http: HttpClient,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

    this.route.queryParams.subscribe(a => {
      this.userid = a.uid
      this.taskid = a.tid
      this.salesid = a['sid']
      this.leadid = a['leadid']

      this.http.post('https://api.nanogapp.com/getServiceFormByLead', { lead_id: this.leadid }).subscribe((s) => {

        this.serform = s['data']
        console.log('serform1', this.serform);
        if (this.serform && this.serform.length > 0) {
          // Sort the array in descending order based on timestamp
          this.serform.sort((a, b) => b.created_date - a.created_date);

          // Take the first element (latest one) and create a new array
          this.serform = [this.serform[0]];

        }
        console.log('serform', this.serform);
      })
    })
  }


  getpdf(x) {
    let pdfurl
    pdfurl = x

    window.open(pdfurl, '_system')
    if (!window.open(pdfurl, '_system')) {
      window.location.href = pdfurl;
    }
  }

  back() {
    this.nav.pop()
  }
}


