import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Tab4CompletedJobPage } from './tab4-completed-job.page';

const routes: Routes = [
  {
    path: '',
    component: Tab4CompletedJobPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Tab4CompletedJobPageRoutingModule {}
