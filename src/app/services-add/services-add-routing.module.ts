import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServicesAddPage } from './services-add.page';

const routes: Routes = [
  {
    path: '',
    component: ServicesAddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServicesAddPageRoutingModule {}
