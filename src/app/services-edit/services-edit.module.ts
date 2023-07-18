import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServicesEditPageRoutingModule } from './services-edit-routing.module';

import { ServicesEditPage } from './services-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServicesEditPageRoutingModule
  ],
  declarations: [ServicesEditPage]
})
export class ServicesEditPageModule {}
