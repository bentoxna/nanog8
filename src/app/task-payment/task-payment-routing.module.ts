import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskPaymentPage } from './task-payment.page';

const routes: Routes = [
  {
    path: '',
    component: TaskPaymentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskPaymentPageRoutingModule {}
