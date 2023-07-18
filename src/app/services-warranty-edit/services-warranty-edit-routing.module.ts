import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServicesWarrantyEditPage } from './services-warranty-edit.page';

const routes: Routes = [
  {
    path: '',
    component: ServicesWarrantyEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServicesWarrantyEditPageRoutingModule {}
