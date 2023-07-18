import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskLabelCancelReschedulePageRoutingModule } from './task-label-cancel-reschedule-routing.module';

import { TaskLabelCancelReschedulePage } from './task-label-cancel-reschedule.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskLabelCancelReschedulePageRoutingModule
  ],
  declarations: [TaskLabelCancelReschedulePage]
})
export class TaskLabelCancelReschedulePageModule {}
