import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LeadTaskPage } from './lead-task.page';

const routes: Routes = [
  {
    path: '',
    component: LeadTaskPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeadTaskPageRoutingModule {}
