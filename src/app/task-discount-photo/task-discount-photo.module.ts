import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskDiscountPhotoPageRoutingModule } from './task-discount-photo-routing.module';

import { TaskDiscountPhotoPage } from './task-discount-photo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskDiscountPhotoPageRoutingModule
  ],
  declarations: [TaskDiscountPhotoPage]
})
export class TaskDiscountPhotoPageModule {}
