import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Tab3TaskAllPage } from './tab3-task-all.page';

const routes: Routes = [
  {
    path: '',
    component: Tab3TaskAllPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Tab3TaskAllPageRoutingModule {}
