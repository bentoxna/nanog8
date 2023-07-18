import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Tab3TaskAllPageRoutingModule } from './tab3-task-all-routing.module';

import { Tab3TaskAllPage } from './tab3-task-all.page';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Tab3TaskAllPageRoutingModule,
    NgxPaginationModule
  ],
  declarations: [Tab3TaskAllPage]
})
export class Tab3TaskAllPageModule {}
