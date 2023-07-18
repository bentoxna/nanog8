import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PdfSofFillPage } from './pdf-sof-fill.page';

const routes: Routes = [
  {
    path: '',
    component: PdfSofFillPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PdfSofFillPageRoutingModule {}
