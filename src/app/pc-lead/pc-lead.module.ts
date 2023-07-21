import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PcLeadPageRoutingModule } from './pc-lead-routing.module';

import { PcLeadPage } from './pc-lead.page';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PcLeadPageRoutingModule,
    NgxPaginationModule
  ],
  declarations: [PcLeadPage]
})
export class PcLeadPageModule {}
