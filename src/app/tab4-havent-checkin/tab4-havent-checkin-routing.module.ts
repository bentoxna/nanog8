import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Tab4HaventCheckinPage } from './tab4-havent-checkin.page';

const routes: Routes = [
  {
    path: '',
    component: Tab4HaventCheckinPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Tab4HaventCheckinPageRoutingModule {}
