import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServicesWarrantyAddPageRoutingModule } from './services-warranty-add-routing.module';

import { ServicesWarrantyAddPage } from './services-warranty-add.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServicesWarrantyAddPageRoutingModule
  ],
  declarations: [ServicesWarrantyAddPage]
})
export class ServicesWarrantyAddPageModule {}
