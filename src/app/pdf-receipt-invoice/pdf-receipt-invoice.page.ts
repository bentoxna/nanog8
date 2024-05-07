import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
// import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';

@Component({
  selector: 'app-pdf-receipt-invoice',
  templateUrl: './pdf-receipt-invoice.page.html',
  styleUrls: ['./pdf-receipt-invoice.page.scss'],
})
export class PdfReceiptInvoicePage implements OnInit {

  userid
  taskid
  salesid

  paymentdetail = [] as any

  heightofimage = ((this.widther() - 8) / 3) + 'px'

  constructor(private nav:NavController,
    private route : ActivatedRoute,
    private http : HttpClient,
    // private photoViewer : PhotoViewer,
    private platform : Platform) { }

  ngOnInit() {
    this.route.queryParams.subscribe((a) => {
      this.userid = a['uid']
      this.taskid = a['tid']
      this.salesid = a['sid']

      this.http.post('https://api.nanogapp.com/getReceiptInApp', {sales_id : this.salesid}).subscribe(a => {
        // console.log(a['data'])
        this.paymentdetail = a['data']
        console.log(this.paymentdetail)
      })
    })
  }

  getpdf(y, i){
    let pdfurl
    // console.log(y)

      // this.paymentdetail[i].receipt.filter(a => a['pdf'].split('/')[4] == y ? pdfurl = a['pdf'] : pdfurl = pdfurl)
    window.open(y.pdf, '_system')
    if(!window.open(y.pdf, '_system'))
    {
      window.location.href = y.pdf;
    }
    
  }

  back(){
    this.nav.pop()
  }

  getreceipt(x){
    // getReceiptInApp
  }

  // getimage(x){
  //   this.photoViewer.show(x)
  // }

  getimage(x) {
    this.nav.navigateForward('image-viewer?imageurl=' + x)
  }

  widther(){
    return this.platform.width()
  }

  platformType(){
    return this.platform.platforms()
  }
}
