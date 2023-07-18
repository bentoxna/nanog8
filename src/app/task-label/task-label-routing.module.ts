import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskLabelPage } from './task-label.page';

const routes: Routes = [
  {
    path: '',
    component: TaskLabelPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskLabelPageRoutingModule {}
