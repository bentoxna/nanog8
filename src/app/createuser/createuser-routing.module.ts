import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateuserPage } from './createuser.page';

const routes: Routes = [
  {
    path: '',
    component: CreateuserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateuserPageRoutingModule {}
