import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PdfServiceFormViewPage } from './pdf-service-form-view.page';

const routes: Routes = [
  {
    path: '',
    component: PdfServiceFormViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PdfServiceFormViewPageRoutingModule {}
