import { Component, OnInit, ViewChild } from '@angular/core';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';

// import { Storage } from '@ionic/storage-angular';

import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions, CaptureVideoOptions } from '@awesome-cordova-plugins/media-capture/ngx';
import { File, FileEntry } from '@awesome-cordova-plugins/file/ngx';
import { Media, MediaObject } from '@awesome-cordova-plugins/media/ngx';
import { StreamingMedia, StreamingVideoOptions } from '@awesome-cordova-plugins/streaming-media/ngx';
// import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
// import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';

import { DomSanitizer } from '@angular/platform-browser'
import { ActionSheetController, NavController, Platform } from '@ionic/angular';

// import { VideoPlayer } from '@awesome-cordova-plugins/video-player/ngx';

const MEDIA_FOLDER_NAME = 'my_media';

const MEDIA_FILES_KEY = 'mediaFiles';


@Component({
  selector: 'app-create-sub-task',
  templateUrl: './create-sub-task.page.html',
  styleUrls: ['./create-sub-task.page.scss'],
})
export class CreateSubTaskPage implements OnInit{


  //   mediaFiles = [];
  //   @ViewChild('myvideo') myVideo: any;
    
  //   constructor(public navCtrl: NavController, private mediaCapture: MediaCapture, private storage: Storage, private file: File, private media: Media) {}
  
  //   ionViewDidLoad() {
  //     this.storage.get(MEDIA_FILES_KEY).then(res => {
  //       this.mediaFiles = JSON.parse(res) || [];
  //     })
  //   }
  
  //   captureAudio() {
  //     this.mediaCapture.captureAudio().then(res => {
  //       this.storeMediaFiles(res);
  //     }, (err: CaptureError) => console.error(err));
  //   }
  
  //   captureVideo() {
  //     let options: CaptureVideoOptions = {
  //       limit: 1,
  //     }
  //     this.mediaCapture.captureVideo(options).then((res: MediaFile[]) => {
  //       let capturedFile = res[0];
  //       let fileName = capturedFile.name;
  //       let dir = capturedFile['localURL'].split('/');
  //       dir.pop();
  //       let fromDirectory = dir.join('/');      
  //       var toDirectory = this.file.dataDirectory;
  
  //       console.log(fromDirectory , fileName , toDirectory , fileName)
        
  //       this.file.copyFile(fromDirectory , fileName , toDirectory , fileName).then((res) => {
  //         this.storeMediaFiles([{name: fileName, size: capturedFile.size}]);
  //       },err => {
  //         console.log('err: ', err);
  //       });
  //           },
  //     (err: CaptureError) => console.error(err));
  //   }
  
  //   play(myFile) {
  //     if (myFile.name.indexOf('.wav') > -1) {
  //       const audioFile: MediaObject = this.media.create(myFile.localURL);
  //       audioFile.play();
  //     } else {
  //       let path = this.file.dataDirectory + myFile.name;
  //       let url = path.replace(/^file:\/\//, '');
  //       let video = this.myVideo.nativeElement;
  //       video.src = url;
  //       video.play();
  //     }
  //   }
  
  //   storeMediaFiles(files) {
  //     this.storage.get(MEDIA_FILES_KEY).then(res => {
  //       if (res) {
  //         let arr = JSON.parse(res);
  //         arr = arr.concat(files);
  //         this.storage.set(MEDIA_FILES_KEY, JSON.stringify(arr));
  //       } else {
  //         this.storage.set(MEDIA_FILES_KEY, JSON.stringify(files))
  //       }
  //       this.mediaFiles = this.mediaFiles.concat(files);
  //     })
  //   }
  // }
  
    files = []
  
    checkinvideo = [] as any
    checkinphoto = [] as any
  
    videopath
    safeUrl
  
    constructor(
      private camera: Camera,
      private mediaCapture: MediaCapture,
      private sanitizer: DomSanitizer,
      // private imagePicker : ImagePicker,
      private file : File,
      private media : Media,
      private streamingMedia : StreamingMedia,
      // private photoViewer : PhotoViewer,
      private actionSheetController : ActionSheetController,
      private platform : Platform,
      // private videoPlayer: VideoPlayer
    ) { }
  
  
    ngOnInit() {
      this.platform.ready().then(() => {
        let path = this.file.dataDirectory;
        console.log(path, MEDIA_FOLDER_NAME)
        this.file.checkDir(path, MEDIA_FOLDER_NAME).then(
          () => {
            this.loadFiles();
          },
          err => {
            this.file.createDir(path, MEDIA_FOLDER_NAME, false);
          }
        );
      });
    }
  
    loadFiles() {
      this.file.listDir(this.file.dataDirectory, MEDIA_FOLDER_NAME).then(
        res => {
          this.files = res;
        },
        err => console.log('error loading files: ', err)
      );
    }
  
    async selectMedia() {
      const actionSheet = await this.actionSheetController.create({
        header: 'What would you like to add?',
        buttons: [
          {
            text: 'Capture Image',
            handler: () => {
              this.captureImage();
            }
          },
          {
            text: 'Record Video',
            handler: () => {
              this.recordVideo();
            }
          },
          {
            text: 'Record Audio',
            handler: () => {
              this.recordAudio();
            }
          },
          // {
          //   text: 'Load multiple',
          //   handler: () => {
          //     this.pickImages();
          //   }
          // },
          {
            text: 'Cancel',
            role: 'cancel'
          }
        ]
      });
      await actionSheet.present();
    }
  
    // pickImages() {
    //   this.imagePicker.getPictures({}).then(
    //     results => {
    //       for (var i = 0; i < results.length; i++) {
    //         this.copyFileToLocalDir(results[i]);
    //       }
    //     }
    //   );
  
    // }
  
    captureImage() {
      this.mediaCapture.captureImage().then(
        (data: MediaFile[]) => {
          if (data.length > 0) {
            this.copyFileToLocalDir(data[0].fullPath);
          }
        },
        (err: CaptureError) => console.error(err)
      );
    }
  
    recordAudio() {
      this.mediaCapture.captureAudio().then(
        (data: MediaFile[]) => {
          if (data.length > 0) {
            this.copyFileToLocalDir(data[0].fullPath);
          }
        },
        (err: CaptureError) => console.error(err)
      );
    }
  
    recordVideo() {
      this.mediaCapture.captureVideo().then(
        (data: MediaFile[]) => {
          if (data.length > 0) {
            this.copyFileToLocalDir(data[0].fullPath);
            console.log(data)
          }
        },
        (err: CaptureError) => console.error(err)
      );

    }
  
  
   copyFileToLocalDir(fullPath) {
      let myPath = fullPath;
      // Make sure we copy from the right location
      if (fullPath.indexOf('file://') < 0) {
        myPath = 'file://' + fullPath;
      }
  
      const ext = myPath.split('.').pop();
      const d = Date.now();
      const newName = `${d}.${ext}`;
  
      const name = myPath.substr(myPath.lastIndexOf('/') + 1);
      const copyFrom = myPath.substr(0, myPath.lastIndexOf('/') + 1);
      const copyTo = this.file.dataDirectory + MEDIA_FOLDER_NAME + '/';
  
      const copyfrom2 = copyFrom + name
      const copyto2 = copyTo + newName
  
      this.file.copyFile(copyFrom, name , copyTo , newName).then(
        success => {
          this.loadFiles();
        },
        error => {
          console.log('error: ', error);
        }
      );
    }
  
    openFile(f: FileEntry) {
      if (f.name.indexOf('.wav') > -1) {
        // We need to remove file:/// from the path for the audio plugin to work
        const path =  f.nativeURL.replace(/^file:\/\//, '');
        const audioFile: MediaObject = this.media.create(path);
        audioFile.play();
      } else if (f.name.indexOf('.MOV') > -1 || f.name.indexOf('.mp4') > -1) {
  
        // this.videoPlayer.play(f.nativeURL).then(() => {
        //   console.log('video completed')
        // }).catch(err => {
        //   console.log(err)
        // });
        let options: StreamingVideoOptions = {
            // orientation: 'landscape',
            controls : true,
        }
        this.streamingMedia.playVideo(f.nativeURL, options);
      } else if (f.name.indexOf('.jpg') > -1) {
        // E.g: Use the Photoviewer to present an Image
        // this.photoViewer.show(f.nativeURL, f.name);
      }
    }
  
    deleteFile(f: FileEntry) {
      const path = f.nativeURL.substr(0, f.nativeURL.lastIndexOf('/') + 1);
      this.file.removeFile(path, f.name).then(() => {
        this.loadFiles();
      }, err => console.log('error remove: ', err));
    }
  
    // takeVideo() {
    //   let options: CaptureVideoOptions = { limit : 1 }
    //   this.mediaCapture.captureVideo(options)
    //     .then(
    //       (data: MediaFile[]) => {
    //         console.log(data)
    //         this.checkinvideo.push(data[0]['localURL'])
  
    //       },
    //       (err: CaptureError) => alert(err)
    //     );
  
    //     console.log(this.checkinvideo)
    // }
  
    // takePhoto() {
    //   const options: CameraOptions = {
    //     quality: 100,
    //     destinationType: this.camera.DestinationType.DATA_URL,
    //     encodingType: this.camera.EncodingType.JPEG,
    //     mediaType: this.camera.MediaType.PICTURE
    //   }
  
    //   this.camera.getPicture(options).then((imageData) => {
    //     // imageData is either a base64 encoded string or a file URI
    //     // If it's base64 (DATA_URL):
    //     let base64Image = 'data:image/jpeg;base64,' + imageData;
    //     this.checkinphoto.push(base64Image)
    //   }, (err) => {
    //     alert(err)
    //     // Handle error
    //   });
    // }

    platformType(){
      return this.platform.platforms()
    }
  
  
  }
  
