import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VideoViewerPageRoutingModule } from './video-viewer-routing.module';

import { VideoViewerPage } from './video-viewer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VideoViewerPageRoutingModule
  ],
  declarations: [VideoViewerPage]
})
export class VideoViewerPageModule {}
