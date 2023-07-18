import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskDiscountPhotoPage } from './task-discount-photo.page';

const routes: Routes = [
  {
    path: '',
    component: TaskDiscountPhotoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskDiscountPhotoPageRoutingModule {}
