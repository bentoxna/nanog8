import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskEquipmentPageRoutingModule } from './task-equipment-routing.module';

import { TaskEquipmentPage } from './task-equipment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskEquipmentPageRoutingModule
  ],
  declarations: [TaskEquipmentPage]
})
export class TaskEquipmentPageModule {}
