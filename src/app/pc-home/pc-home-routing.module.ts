import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PcHomePage } from './pc-home.page';

const routes: Routes = [
  {
    path: '',
    component: PcHomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PcHomePageRoutingModule {}
