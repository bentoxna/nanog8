import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Tab1UpcomingTaskPageRoutingModule } from './tab1-upcoming-task-routing.module';

import { Tab1UpcomingTaskPage } from './tab1-upcoming-task.page';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Tab1UpcomingTaskPageRoutingModule,
    NgxPaginationModule,
  ],
  declarations: [Tab1UpcomingTaskPage]
})
export class Tab1UpcomingTaskPageModule {}
