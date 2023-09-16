import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Tab4HaventCheckinPageRoutingModule } from './tab4-havent-checkin-routing.module';

import { Tab4HaventCheckinPage } from './tab4-havent-checkin.page';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Tab4HaventCheckinPageRoutingModule,
    NgxPaginationModule
  ],
  declarations: [Tab4HaventCheckinPage]
})
export class Tab4HaventCheckinPageModule {}
