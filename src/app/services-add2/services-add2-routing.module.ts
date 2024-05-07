import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServicesAdd2Page } from './services-add2.page';

const routes: Routes = [
  {
    path: '',
    component: ServicesAdd2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServicesAdd2PageRoutingModule {}
