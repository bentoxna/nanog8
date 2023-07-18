import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScheduleCalanderEditPageRoutingModule } from './schedule-calander-edit-routing.module';

import { ScheduleCalanderEditPage } from './schedule-calander-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScheduleCalanderEditPageRoutingModule
  ],
  declarations: [ScheduleCalanderEditPage]
})
export class ScheduleCalanderEditPageModule {}
