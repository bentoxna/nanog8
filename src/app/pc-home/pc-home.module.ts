import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PcHomePageRoutingModule } from './pc-home-routing.module';

import { PcHomePage } from './pc-home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PcHomePageRoutingModule
  ],
  declarations: [PcHomePage]
})
export class PcHomePageModule {}
