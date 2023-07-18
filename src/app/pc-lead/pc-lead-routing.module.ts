import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PcLeadPage } from './pc-lead.page';

const routes: Routes = [
  {
    path: '',
    component: PcLeadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PcLeadPageRoutingModule {}
