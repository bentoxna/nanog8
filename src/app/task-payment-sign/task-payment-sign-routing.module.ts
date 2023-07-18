import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskPaymentSignPage } from './task-payment-sign.page';

const routes: Routes = [
  {
    path: '',
    component: TaskPaymentSignPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskPaymentSignPageRoutingModule {}
