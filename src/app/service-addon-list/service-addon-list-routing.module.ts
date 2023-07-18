import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServiceAddonListPage } from './service-addon-list.page';

const routes: Routes = [
  {
    path: '',
    component: ServiceAddonListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceAddonListPageRoutingModule {}
