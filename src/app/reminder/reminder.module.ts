import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReminderPageRoutingModule } from './reminder-routing.module';

import { ReminderPage } from './reminder.page';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReminderPageRoutingModule,
    NgxPaginationModule
  ],
  declarations: [ReminderPage]
})
export class ReminderPageModule {}
