import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskEquipmentPage } from './task-equipment.page';

const routes: Routes = [
  {
    path: '',
    component: TaskEquipmentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskEquipmentPageRoutingModule {}
