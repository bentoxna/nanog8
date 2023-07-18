import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskAllPage } from './task-all.page';

const routes: Routes = [
  {
    path: '',
    component: TaskAllPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskAllPageRoutingModule {}
