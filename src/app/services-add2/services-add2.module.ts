import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServicesAdd2PageRoutingModule } from './services-add2-routing.module';

import { ServicesAdd2Page } from './services-add2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServicesAdd2PageRoutingModule
  ],
  declarations: [ServicesAdd2Page]
})
export class ServicesAdd2PageModule {}
