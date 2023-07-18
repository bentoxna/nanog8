import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LeadEditPageRoutingModule } from './lead-edit-routing.module';

import { LeadEditPage } from './lead-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LeadEditPageRoutingModule
  ],
  declarations: [LeadEditPage]
})
export class LeadEditPageModule {}
