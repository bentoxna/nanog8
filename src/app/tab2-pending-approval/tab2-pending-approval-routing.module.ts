import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Tab2PendingApprovalPage } from './tab2-pending-approval.page';

const routes: Routes = [
  {
    path: '',
    component: Tab2PendingApprovalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Tab2PendingApprovalPageRoutingModule {}
