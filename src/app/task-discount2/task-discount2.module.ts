import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskDiscount2PageRoutingModule } from './task-discount2-routing.module';

import { TaskDiscount2Page } from './task-discount2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskDiscount2PageRoutingModule
  ],
  declarations: [TaskDiscount2Page]
})
export class TaskDiscount2PageModule {}
