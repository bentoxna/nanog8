import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Tab1UpcomingTaskPage } from './tab1-upcoming-task.page';

const routes: Routes = [
  {
    path: '',
    component: Tab1UpcomingTaskPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Tab1UpcomingTaskPageRoutingModule {}
