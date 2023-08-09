import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InsertCsvPage } from './insert-csv.page';

const routes: Routes = [
  {
    path: '',
    component: InsertCsvPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InsertCsvPageRoutingModule {}
