import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServicePackageDetailPage } from './service-package-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ServicePackageDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServicePackageDetailPageRoutingModule {}
