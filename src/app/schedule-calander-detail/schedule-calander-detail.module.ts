import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScheduleCalanderDetailPageRoutingModule } from './schedule-calander-detail-routing.module';

import { ScheduleCalanderDetailPage } from './schedule-calander-detail.page';
import {NgxPaginationModule} from 'ngx-pagination'; 

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,NgxPaginationModule,
    ScheduleCalanderDetailPageRoutingModule
  ],
  declarations: [ScheduleCalanderDetailPage]
})
export class ScheduleCalanderDetailPageModule {}
