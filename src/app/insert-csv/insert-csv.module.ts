import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InsertCsvPageRoutingModule } from './insert-csv-routing.module';

import { InsertCsvPage } from './insert-csv.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InsertCsvPageRoutingModule
  ],
  declarations: [InsertCsvPage]
})
export class InsertCsvPageModule {}
