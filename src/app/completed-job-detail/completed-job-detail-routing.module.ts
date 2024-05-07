import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompletedJobDetailPage } from './completed-job-detail.page';

const routes: Routes = [
  {
    path: '',
    component: CompletedJobDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompletedJobDetailPageRoutingModule {}
