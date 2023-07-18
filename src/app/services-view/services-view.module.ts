import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServicesViewPageRoutingModule } from './services-view-routing.module';

import { ServicesViewPage } from './services-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServicesViewPageRoutingModule
  ],
  declarations: [ServicesViewPage]
})
export class ServicesViewPageModule {}
