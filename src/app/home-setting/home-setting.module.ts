import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeSettingPageRoutingModule } from './home-setting-routing.module';

import { HomeSettingPage } from './home-setting.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeSettingPageRoutingModule
  ],
  declarations: [HomeSettingPage]
})
export class HomeSettingPageModule {}
