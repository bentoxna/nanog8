import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScheduleCalanderDetailPage } from './schedule-calander-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ScheduleCalanderDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScheduleCalanderDetailPageRoutingModule {}
