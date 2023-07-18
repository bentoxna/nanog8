import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskDiscountPageRoutingModule } from './task-discount-routing.module';

import { TaskDiscountPage } from './task-discount.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskDiscountPageRoutingModule
  ],
  declarations: [TaskDiscountPage]
})
export class TaskDiscountPageModule {}
