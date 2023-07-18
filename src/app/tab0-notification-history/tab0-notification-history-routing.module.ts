import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Tab0NotificationHistoryPage } from './tab0-notification-history.page';

const routes: Routes = [
  {
    path: '',
    component: Tab0NotificationHistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Tab0NotificationHistoryPageRoutingModule {}
