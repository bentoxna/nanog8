import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WebsiteSignPage } from './website-sign.page';

const routes: Routes = [
  {
    path: '',
    component: WebsiteSignPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WebsiteSignPageRoutingModule {}
