import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServicesEditPage } from './services-edit.page';

const routes: Routes = [
  {
    path: '',
    component: ServicesEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServicesEditPageRoutingModule {}
