import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServiceAddonListPageRoutingModule } from './service-addon-list-routing.module';

import { ServiceAddonListPage } from './service-addon-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServiceAddonListPageRoutingModule
  ],
  declarations: [ServiceAddonListPage]
})
export class ServiceAddonListPageModule {}
