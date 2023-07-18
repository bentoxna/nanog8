import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CheckInHistoryPage } from './check-in-history.page';

const routes: Routes = [
  {
    path: '',
    component: CheckInHistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckInHistoryPageRoutingModule {}
