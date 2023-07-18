import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskDiscountListPage } from './task-discount-list.page';

const routes: Routes = [
  {
    path: '',
    component: TaskDiscountListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskDiscountListPageRoutingModule {}
