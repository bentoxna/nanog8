import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServicePackageDetailPageRoutingModule } from './service-package-detail-routing.module';

import { ServicePackageDetailPage } from './service-package-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServicePackageDetailPageRoutingModule
  ],
  declarations: [ServicePackageDetailPage]
})
export class ServicePackageDetailPageModule {}
