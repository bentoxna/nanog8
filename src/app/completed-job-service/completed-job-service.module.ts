import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompletedJobServicePageRoutingModule } from './completed-job-service-routing.module';

import { CompletedJobServicePage } from './completed-job-service.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompletedJobServicePageRoutingModule
  ],
  declarations: [CompletedJobServicePage]
})
export class CompletedJobServicePageModule {}
