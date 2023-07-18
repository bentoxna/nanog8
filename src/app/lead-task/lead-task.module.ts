import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LeadTaskPageRoutingModule } from './lead-task-routing.module';

import { LeadTaskPage } from './lead-task.page';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LeadTaskPageRoutingModule,
    NgxPaginationModule,
  ],
  declarations: [LeadTaskPage]
})
export class LeadTaskPageModule {}
