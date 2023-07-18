import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LeadAppointmentPageRoutingModule } from './lead-appointment-routing.module';

import { LeadAppointmentPage } from './lead-appointment.page';
import { GoogleMapsModule } from '@angular/google-maps';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LeadAppointmentPageRoutingModule,
    GoogleMapsModule
  ],
  declarations: [LeadAppointmentPage]
})
export class LeadAppointmentPageModule {}
