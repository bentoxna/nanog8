import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PdfReceiptInvoicePage } from './pdf-receipt-invoice.page';

const routes: Routes = [
  {
    path: '',
    component: PdfReceiptInvoicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PdfReceiptInvoicePageRoutingModule {}
