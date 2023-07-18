import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServiceWarranty2PageRoutingModule } from './service-warranty2-routing.module';

import { ServiceWarranty2Page } from './service-warranty2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServiceWarranty2PageRoutingModule
  ],
  declarations: [ServiceWarranty2Page]
})
export class ServiceWarranty2PageModule {}
