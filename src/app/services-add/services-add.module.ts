import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServicesAddPageRoutingModule } from './services-add-routing.module';

import { ServicesAddPage } from './services-add.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServicesAddPageRoutingModule
  ],
  declarations: [ServicesAddPage]
})
export class ServicesAddPageModule {}
