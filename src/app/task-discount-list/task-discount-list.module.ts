import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskDiscountListPageRoutingModule } from './task-discount-list-routing.module';

import { TaskDiscountListPage } from './task-discount-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskDiscountListPageRoutingModule
  ],
  declarations: [TaskDiscountListPage]
})
export class TaskDiscountListPageModule {}
