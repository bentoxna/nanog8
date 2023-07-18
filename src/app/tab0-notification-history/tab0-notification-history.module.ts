import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Tab0NotificationHistoryPageRoutingModule } from './tab0-notification-history-routing.module';

import { Tab0NotificationHistoryPage } from './tab0-notification-history.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Tab0NotificationHistoryPageRoutingModule
  ],
  declarations: [Tab0NotificationHistoryPage]
})
export class Tab0NotificationHistoryPageModule {}
