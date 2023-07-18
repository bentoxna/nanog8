import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CheckInHistoryPageRoutingModule } from './check-in-history-routing.module';

import { CheckInHistoryPage } from './check-in-history.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CheckInHistoryPageRoutingModule
  ],
  declarations: [CheckInHistoryPage]
})
export class CheckInHistoryPageModule {}
