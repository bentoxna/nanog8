import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PdfSofFillPageRoutingModule } from './pdf-sof-fill-routing.module';

import { PdfSofFillPage } from './pdf-sof-fill.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PdfSofFillPageRoutingModule
  ],
  declarations: [PdfSofFillPage]
})
export class PdfSofFillPageModule {}
