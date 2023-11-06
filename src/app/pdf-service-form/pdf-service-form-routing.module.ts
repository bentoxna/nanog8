import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PdfServiceFormPage } from './pdf-service-form.page';

const routes: Routes = [
  {
    path: '',
    component: PdfServiceFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PdfServiceFormPageRoutingModule {}
