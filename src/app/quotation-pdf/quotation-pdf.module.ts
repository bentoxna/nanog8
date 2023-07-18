import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuotationPdfPageRoutingModule } from './quotation-pdf-routing.module';

import { QuotationPdfPage } from './quotation-pdf.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuotationPdfPageRoutingModule
  ],
  declarations: [QuotationPdfPage]
})
export class QuotationPdfPageModule {}
