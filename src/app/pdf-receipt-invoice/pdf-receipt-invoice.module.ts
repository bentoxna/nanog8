import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PdfReceiptInvoicePageRoutingModule } from './pdf-receipt-invoice-routing.module';

import { PdfReceiptInvoicePage } from './pdf-receipt-invoice.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PdfReceiptInvoicePageRoutingModule
  ],
  declarations: [PdfReceiptInvoicePage]
})
export class PdfReceiptInvoicePageModule {}
