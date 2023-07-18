import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PdfSalesOrderFormPageRoutingModule } from './pdf-sales-order-form-routing.module';

import { PdfSalesOrderFormPage } from './pdf-sales-order-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PdfSalesOrderFormPageRoutingModule
  ],
  declarations: [PdfSalesOrderFormPage]
})
export class PdfSalesOrderFormPageModule {}
