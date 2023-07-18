import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LeadAddPage } from './lead-add.page';

const routes: Routes = [
  {
    path: '',
    component: LeadAddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeadAddPageRoutingModule {}
