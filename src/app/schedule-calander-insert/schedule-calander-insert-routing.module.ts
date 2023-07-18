import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScheduleCalanderInsertPage } from './schedule-calander-insert.page';

const routes: Routes = [
  {
    path: '',
    component: ScheduleCalanderInsertPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScheduleCalanderInsertPageRoutingModule {}
