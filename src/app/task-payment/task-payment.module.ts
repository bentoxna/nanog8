import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskPaymentPageRoutingModule } from './task-payment-routing.module';

import { TaskPaymentPage } from './task-payment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskPaymentPageRoutingModule
  ],
  declarations: [TaskPaymentPage]
})
export class TaskPaymentPageModule {}
