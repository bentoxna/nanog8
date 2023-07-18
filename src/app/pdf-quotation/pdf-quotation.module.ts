import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PdfQuotationPageRoutingModule } from './pdf-quotation-routing.module';

import { PdfQuotationPage } from './pdf-quotation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PdfQuotationPageRoutingModule
  ],
  declarations: [PdfQuotationPage]
})
export class PdfQuotationPageModule {}
