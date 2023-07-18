import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Tab2PendingApprovalPageRoutingModule } from './tab2-pending-approval-routing.module';

import { Tab2PendingApprovalPage } from './tab2-pending-approval.page';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Tab2PendingApprovalPageRoutingModule,
    NgxPaginationModule,
  ],
  declarations: [Tab2PendingApprovalPage]
})
export class Tab2PendingApprovalPageModule {}
