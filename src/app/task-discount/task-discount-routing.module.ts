import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskDiscountPage } from './task-discount.page';

const routes: Routes = [
  {
    path: '',
    component: TaskDiscountPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskDiscountPageRoutingModule {}
