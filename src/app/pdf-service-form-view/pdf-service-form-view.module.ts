import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PdfServiceFormViewPageRoutingModule } from './pdf-service-form-view-routing.module';

import { PdfServiceFormViewPage } from './pdf-service-form-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PdfServiceFormViewPageRoutingModule
  ],
  declarations: [PdfServiceFormViewPage]
})
export class PdfServiceFormViewPageModule {}
