import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskLabelCancelReschedulePage } from './task-label-cancel-reschedule.page';

const routes: Routes = [
  {
    path: '',
    component: TaskLabelCancelReschedulePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskLabelCancelReschedulePageRoutingModule {}
