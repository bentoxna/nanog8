import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeSettingPage } from './home-setting.page';

const routes: Routes = [
  {
    path: '',
    component: HomeSettingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeSettingPageRoutingModule {}
