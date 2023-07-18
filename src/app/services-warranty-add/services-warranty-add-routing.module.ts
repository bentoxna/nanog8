import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServicesWarrantyAddPage } from './services-warranty-add.page';

const routes: Routes = [
  {
    path: '',
    component: ServicesWarrantyAddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServicesWarrantyAddPageRoutingModule {}
