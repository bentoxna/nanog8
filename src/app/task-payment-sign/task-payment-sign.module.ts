import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskPaymentSignPageRoutingModule } from './task-payment-sign-routing.module';

import { TaskPaymentSignPage } from './task-payment-sign.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskPaymentSignPageRoutingModule
  ],
  declarations: [TaskPaymentSignPage]
})
export class TaskPaymentSignPageModule {}
