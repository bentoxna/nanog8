import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskDiscountCustomPageRoutingModule } from './task-discount-custom-routing.module';

import { TaskDiscountCustomPage } from './task-discount-custom.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskDiscountCustomPageRoutingModule
  ],
  declarations: [TaskDiscountCustomPage]
})
export class TaskDiscountCustomPageModule {}
