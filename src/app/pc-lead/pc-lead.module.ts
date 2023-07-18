import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PcLeadPageRoutingModule } from './pc-lead-routing.module';

import { PcLeadPage } from './pc-lead.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PcLeadPageRoutingModule
  ],
  declarations: [PcLeadPage]
})
export class PcLeadPageModule {}
