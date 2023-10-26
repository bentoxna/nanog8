import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import SignaturePad from 'signature_pad';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-task-payment-sign',
  templateUrl: './task-payment-sign.page.html',
  styleUrls: ['./task-payment-sign.page.scss'],
})
export class TaskPaymentSignPage implements OnInit {

  @ViewChild('canva') canvasEl: ElementRef;
  signaturePad: SignaturePad
  signatureImg: string;

  userid
  salesid

  status = false

  constructor(private nav: NavController,
    private http: HttpClient,
    private route: ActivatedRoute,
    private modal: ModalController) { }

  ngOnInit() {
    this.route.queryParams.subscribe(a => {
      this.userid = a['uid']
      this.salesid = a['sid']
    })
  }

  ngAfterViewInit() {
    this.signaturePad = new SignaturePad(this.canvasEl.nativeElement);
  }

  startDrawing(event: Event) {
    this.status = true
    // // console.log(event);
    // works in device not in browser

  }

  moved(event: Event) {
    // works in device not in browser
  }

  clearPad() {
    this.signaturePad.clear();
  }

  savePad() {
    if (!this.status) {
      Swal.fire({
        text: 'Please draw your signature',
        icon: 'info',
        heightAuto: false,
        timer: 1500
      })
    }
    else {
      const base64Data = this.signaturePad.toDataURL();
      this.signatureImg = base64Data;
      // console.log(this.signatureImg);
      this.uploadserve2(this.signatureImg).then(a => {
        Swal.close()
        this.modal.dismiss(this.imageurl)
      })

    }
  }

  imageurl

  uploadserve2(image) {
    return new Promise((resolve, reject) => {
      Swal.fire({
        title: 'processing...',
        icon: 'info',
        heightAuto: false,
        allowOutsideClick: false,
        showConfirmButton: false,
      })
      if (image) {
        let imgggg = image.replace(';base64,', "thisisathingtoreplace;")
        let imgarr = imgggg.split("thisisathingtoreplace;")
        let base64 = imgarr[1]

        const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
        let body = new URLSearchParams()
        body.set('image', base64)

        this.http.post('https://api.nanogapp.com/upload', { image: base64, folder: 'nanog', userid: 'nanog' }).subscribe((res) => {
          this.imageurl = res['imageURL']
          // this.http.post('https://api.nanogapp.com/updateSubSubSign', {
          //   sub_sub_sign: temp,
          //   sales_id: this.salesid,
          // }).subscribe(a => {
          //   // console.log(a)
          //   resolve((res['imageURL']))
          // })
          resolve(res['imageURL'])
        }, awe => {
          reject(awe)
        })

      }
      else {
        resolve('empty')
      }
    })
  }

  back() {
    this.modal.dismiss()
  }

}
