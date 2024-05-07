import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompletedJobDetailPageRoutingModule } from './completed-job-detail-routing.module';

import { CompletedJobDetailPage } from './completed-job-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompletedJobDetailPageRoutingModule
  ],
  declarations: [CompletedJobDetailPage]
})
export class CompletedJobDetailPageModule {}
