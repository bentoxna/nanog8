import { Component, OnInit  ,AfterViewInit, ElementRef, ViewChild} from '@angular/core';
import { NavController } from '@ionic/angular';
import SignaturePad from 'signature_pad';

@Component({
  selector: 'app-signature',
  templateUrl: './signature.page.html',
  styleUrls: ['./signature.page.scss'],
})
export class SignaturePage implements OnInit {

  @ViewChild('canva') canvasEl: ElementRef;
  signaturePad: SignaturePad
  signatureImg: string;

  constructor(private nav : NavController) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.signaturePad = new SignaturePad(this.canvasEl.nativeElement);
  }

  startDrawing(event: Event) {
    // console.log(event);
    // works in device not in browser

  }

  moved(event: Event) {
    // works in device not in browser
  }

  clearPad() {
    this.signaturePad.clear();
  }

  savePad() {
    const base64Data = this.signaturePad.toDataURL();
    this.signatureImg = base64Data;
    // console.log(this.signatureImg);
    
  }

  back(){
    this.nav.pop()
  }

}
