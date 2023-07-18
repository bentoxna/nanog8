import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScheduleCalanderInsertPageRoutingModule } from './schedule-calander-insert-routing.module';

import { ScheduleCalanderInsertPage } from './schedule-calander-insert.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScheduleCalanderInsertPageRoutingModule
  ],
  declarations: [ScheduleCalanderInsertPage]
})
export class ScheduleCalanderInsertPageModule {}
