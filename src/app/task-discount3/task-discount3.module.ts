import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskDiscount3PageRoutingModule } from './task-discount3-routing.module';

import { TaskDiscount3Page } from './task-discount3.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskDiscount3PageRoutingModule
  ],
  declarations: [TaskDiscount3Page]
})
export class TaskDiscount3PageModule {}
