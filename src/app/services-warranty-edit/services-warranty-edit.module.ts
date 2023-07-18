import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServicesWarrantyEditPageRoutingModule } from './services-warranty-edit-routing.module';

import { ServicesWarrantyEditPage } from './services-warranty-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServicesWarrantyEditPageRoutingModule
  ],
  declarations: [ServicesWarrantyEditPage]
})
export class ServicesWarrantyEditPageModule {}
