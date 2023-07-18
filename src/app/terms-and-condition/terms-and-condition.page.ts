import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-terms-and-condition',
  templateUrl: './terms-and-condition.page.html',
  styleUrls: ['./terms-and-condition.page.scss'],
})
export class TermsAndConditionPage implements OnInit {

  constructor(private modal : ModalController) { }

  ngOnInit() {
  }

  dimiss(){
    this.modal.dismiss()
  }

}
