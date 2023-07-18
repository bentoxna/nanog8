import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScheduleCalanderEditPage } from './schedule-calander-edit.page';

const routes: Routes = [
  {
    path: '',
    component: ScheduleCalanderEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScheduleCalanderEditPageRoutingModule {}
