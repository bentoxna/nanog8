import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuotationPdfPage } from './quotation-pdf.page';

const routes: Routes = [
  {
    path: '',
    component: QuotationPdfPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuotationPdfPageRoutingModule {}
