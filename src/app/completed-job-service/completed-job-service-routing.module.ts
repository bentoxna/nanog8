import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompletedJobServicePage } from './completed-job-service.page';

const routes: Routes = [
  {
    path: '',
    component: CompletedJobServicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompletedJobServicePageRoutingModule {}
