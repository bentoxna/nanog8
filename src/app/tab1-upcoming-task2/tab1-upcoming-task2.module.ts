import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Tab1UpcomingTask2PageRoutingModule } from './tab1-upcoming-task2-routing.module';

import { Tab1UpcomingTask2Page } from './tab1-upcoming-task2.page';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Tab1UpcomingTask2PageRoutingModule,
    NgxPaginationModule,

  ],
  declarations: [Tab1UpcomingTask2Page]
})
export class Tab1UpcomingTask2PageModule { }
