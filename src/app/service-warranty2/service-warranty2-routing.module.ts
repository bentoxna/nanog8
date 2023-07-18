import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServiceWarranty2Page } from './service-warranty2.page';

const routes: Routes = [
  {
    path: '',
    component: ServiceWarranty2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceWarranty2PageRoutingModule {}
