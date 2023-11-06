import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PdfServiceFormPageRoutingModule } from './pdf-service-form-routing.module';

import { PdfServiceFormPage } from './pdf-service-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PdfServiceFormPageRoutingModule
  ],
  declarations: [PdfServiceFormPage]
})
export class PdfServiceFormPageModule {}
