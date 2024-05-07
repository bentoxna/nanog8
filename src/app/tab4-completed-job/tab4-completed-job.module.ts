import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Tab4CompletedJobPageRoutingModule } from './tab4-completed-job-routing.module';

import { Tab4CompletedJobPage } from './tab4-completed-job.page';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Tab4CompletedJobPageRoutingModule,
    NgxPaginationModule
  ],
  declarations: [Tab4CompletedJobPage]
})
export class Tab4CompletedJobPageModule {}
