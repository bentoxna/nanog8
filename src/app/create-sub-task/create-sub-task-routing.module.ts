import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateSubTaskPage } from './create-sub-task.page';

const routes: Routes = [
  {
    path: '',
    component: CreateSubTaskPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateSubTaskPageRoutingModule {}
