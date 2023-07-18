import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServicesViewPage } from './services-view.page';

const routes: Routes = [
  {
    path: '',
    component: ServicesViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServicesViewPageRoutingModule {}
