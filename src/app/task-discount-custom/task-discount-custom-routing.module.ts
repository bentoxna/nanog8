import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskDiscountCustomPage } from './task-discount-custom.page';

const routes: Routes = [
  {
    path: '',
    component: TaskDiscountCustomPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskDiscountCustomPageRoutingModule {}
