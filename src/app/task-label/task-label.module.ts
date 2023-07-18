import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskLabelPageRoutingModule } from './task-label-routing.module';

import { TaskLabelPage } from './task-label.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskLabelPageRoutingModule
  ],
  declarations: [TaskLabelPage]
})
export class TaskLabelPageModule {}
