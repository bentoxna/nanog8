import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LeadAppointmentPage } from './lead-appointment.page';

const routes: Routes = [
  {
    path: '',
    component: LeadAppointmentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeadAppointmentPageRoutingModule {}
