import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { Camera } from '@awesome-cordova-plugins/camera/ngx';
import { MediaCapture} from '@awesome-cordova-plugins/media-capture/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
// import { File } from '@awesome-cordova-plugins/file';
import { Media, MediaObject } from '@awesome-cordova-plugins/media/ngx';
import { StreamingMedia, StreamingVideoOptions } from '@awesome-cordova-plugins/streaming-media/ngx';
// import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
import {HttpClientModule} from '@angular/common/http'
// import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';
// import { IonicStorageModule } from '@ionic/storage-angular';
// import { VideoPlayer } from '@awesome-cordova-plugins/video-player/ngx';

import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { NativeGeocoder } from '@awesome-cordova-plugins/native-geocoder/ngx';

import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';
// import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import {NgxPaginationModule} from 'ngx-pagination'; 
import { DatePipe } from '@angular/common';
import { DocumentViewer } from '@awesome-cordova-plugins/document-viewer/ngx';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { FCM } from "@capacitor-community/fcm";
import { PushNotifications } from "@capacitor/push-notifications";

const config: SocketIoConfig = { url: 'https://api.nanogapp.com', options: {
    transports: ['websocket']
} };


@NgModule({
  declarations: [AppComponent],
  imports: [SocketIoModule.forRoot(config), BrowserModule, IonicModule.forRoot(), AppRoutingModule,HttpClientModule,NgxPaginationModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, Camera, MediaCapture, File, Media, DatePipe,
    StreamingMedia, Geolocation, NativeGeocoder, LocationAccuracy, AndroidPermissions, DocumentViewer,
    Diagnostic],
  bootstrap: [AppComponent],
})
export class AppModule {}
