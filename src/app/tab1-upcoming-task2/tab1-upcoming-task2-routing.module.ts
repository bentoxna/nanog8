import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Tab1UpcomingTask2Page } from './tab1-upcoming-task2.page';

const routes: Routes = [
  {
    path: '',
    component: Tab1UpcomingTask2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Tab1UpcomingTask2PageRoutingModule {}
