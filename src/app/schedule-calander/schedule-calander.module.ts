import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScheduleCalanderPageRoutingModule } from './schedule-calander-routing.module';

import { ScheduleCalanderPage } from './schedule-calander.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScheduleCalanderPageRoutingModule
  ],
  declarations: [ScheduleCalanderPage]
})
export class ScheduleCalanderPageModule {}
