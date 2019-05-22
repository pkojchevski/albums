import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Renderer2,
} from '@angular/core';
import {Album} from 'src/app/models/album';
import {COLLECTIONS, Collection} from 'src/app/models/collections';
import {
  AngularFireStorage,
  AngularFireStorageReference,
  AngularFireUploadTask,
} from '@angular/fire/storage';
import {Observable, throwError, of} from 'rxjs';
import {finalize, catchError} from 'rxjs/operators';
import {Image} from 'src/app/models/image';
import {ImageService} from 'src/app/services/image/image.service';
import {initialImage} from '../../models/image';
import {ToastService} from 'src/app/services/toast/toast.service';
import {CollectionService} from 'src/app/services/collection.service';
import {LanguageService} from 'src/app/services/language.service';
import {Language} from 'src/app/models/language';
import {Level} from 'src/app/models/level';
import {LevelService} from 'src/app/services/level.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-add-images',
  templateUrl: './add-images.component.html',
  styleUrls: ['./add-images.component.scss'],
})
export class AddImagesComponent implements OnInit {
  @ViewChild('dropzone') dropzone: ElementRef;
  @ViewChild('addImageForm') form: NgForm;

  acceptedImageTypes = {
    'image/png': true,
    'image/jpeg': true,
    'image/gif': true,
  };
  collections$: Observable<Collection[]>;
  languages$: Observable<Language[]>;
  levels$: Observable<Level[]>;
  imagesColumns;
  album: Album[];
  imagesInput$: Observable<Image[]>;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  uploadProgress: Observable<number>;
  downloadURL$: Observable<string>;
  isHovering: boolean;
  imageIsDropped: boolean;
  language: string;

  image: Image = initialImage;
  images$: Observable<Image[]>;
  file;
  delete: boolean;
  addToAlbum: boolean;

  constructor(
    private afStorage: AngularFireStorage,
    private imageService: ImageService,
    private renderer: Renderer2,
    private toast: ToastService,
    private collectionService: CollectionService,
    private languageService: LanguageService,
    private levelService: LevelService
  ) {}

  ngOnInit() {
    this.collections$ = this.collectionService.getAllCollections();
    this.imagesInput$ = this.imageService.getAllImages();
    this.languages$ = this.languageService.getAllLanguages();
    this.levels$ = this.levelService.getAllLevels();
    this.delete = true;
    this.addToAlbum = false;
    this.imageIsDropped = false;
  }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  // add image to db and storage
  addImage() {
    // tslint:disable-next-line:curly
    if (!this.file) {
      this.toast.newToast({content: 'Please add image', style: 'warning'});
      return;
    }
    this.storeAndSaveImage(this.file);
  }

  getFile(event: FileList) {
    const reader = new FileReader();
    this.file = event.item(0);
    if (this.file.type.split('/')[0] !== 'image') {
      this.toast.newToast({
        content: 'File type is unsuported',
        style: 'warning',
      });
      this.file = null;
      return;
    }
    // file
    reader.readAsDataURL(this.file);
    reader.onload = () => {
      this.renderer.setStyle(
        this.dropzone.nativeElement,
        'backgroundImage',
        `url(${reader.result})`
      );
      this.imageIsDropped = true;
    };
  }

  storeAndSaveImage(file) {
    const path = `images/${file.name}`;
    const fileRef = this.afStorage.ref(path);
    const task = this.afStorage.upload(path, file);
    this.percentage = task.percentageChanges();
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            this.image.url = url;
            this.imageService
              .addImage(this.image)
              .then(() => {
                this.percentage = of(null);
                this.formReset();
                this.renderer.removeStyle(
                  this.dropzone.nativeElement,
                  'backgroundImage'
                );
                this.toast.newToast({
                  content: 'Image is added',
                  style: 'success',
                });
              })
              .catch(err =>
                this.toast.newToast({
                  content: `Error${err.name}`,
                  style: 'warning',
                })
              );
          });
        }),
        catchError(err => {
          this.toast.newToast({content: `Error${err.name}`, style: 'warning'});
          return throwError(err);
        })
      )
      .subscribe();
  }

  isActive(snapshot) {
    return (
      snapshot.state === 'running' &&
      snapshot.bytesTransferred < snapshot.totalBytes
    );
  }

  formReset() {
    this.form.form.reset();
    this.imageIsDropped = false;
  }
}
