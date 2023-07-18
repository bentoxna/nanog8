import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskDiscount3Page } from './task-discount3.page';

const routes: Routes = [
  {
    path: '',
    component: TaskDiscount3Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskDiscount3PageRoutingModule {}
