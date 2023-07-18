import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LeadAddPageRoutingModule } from './lead-add-routing.module';

import { LeadAddPage } from './lead-add.page';
import { GoogleMapsModule } from '@angular/google-maps';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LeadAddPageRoutingModule,
    GoogleMapsModule
  ],
  declarations: [LeadAddPage],
})
export class LeadAddPageModule {}
