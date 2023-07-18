import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateSubTaskPageRoutingModule } from './create-sub-task-routing.module';

import { CreateSubTaskPage } from './create-sub-task.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateSubTaskPageRoutingModule
  ],
  declarations: [CreateSubTaskPage]
})
export class CreateSubTaskPageModule {}
