import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskAllPageRoutingModule } from './task-all-routing.module';

import { TaskAllPage } from './task-all.page';
import {NgxPaginationModule} from 'ngx-pagination'; 

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskAllPageRoutingModule,
    NgxPaginationModule
  ],
  declarations: [TaskAllPage]
})
export class TaskAllPageModule {}
