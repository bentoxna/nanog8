import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WebsiteSignPageRoutingModule } from './website-sign-routing.module';

import { WebsiteSignPage } from './website-sign.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WebsiteSignPageRoutingModule
  ],
  declarations: [WebsiteSignPage]
})
export class WebsiteSignPageModule {}
