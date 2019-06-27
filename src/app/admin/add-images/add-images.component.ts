import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Renderer2,
} from '@angular/core';
import { Album } from 'src/app/models/album';
import { Collection } from 'src/app/models/collections';
import {
  AngularFireStorageReference,
  AngularFireUploadTask,
} from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { Image } from 'src/app/models/image';
import { ImageService } from 'src/app/services/image/image.service';
import { initialImage } from '../../models/image';
import { ToastService } from 'src/app/services/toast/toast.service';
import { CollectionService } from 'src/app/services/collection.service';
import { LanguageService } from 'src/app/services/language.service';
import { Language } from 'src/app/models/language';
import { Level } from 'src/app/models/level';
import { LevelService } from 'src/app/services/level.service';
import { NgForm } from '@angular/forms';

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
  // image = {} as Image;
  images$: Observable<Image[]>;
  file: any;
  delete: boolean;
  addToAlbum: boolean;
  isImageDropped: boolean;
  imageIsAdded: boolean;

  constructor(
    private imageService: ImageService,
    private toast: ToastService,
    private collectionService: CollectionService,
    private languageService: LanguageService,
    private levelService: LevelService
  ) { }

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


  getImageUrl(event) {
    this.file = event.file;
    this.imageIsDropped = event.dropped;
  }

  addImage() {
    if (!this.imageIsDropped) {
      this.toast.newToast({
        content: `Please upload image!`,
        style: 'warning',
      });
      this.imageIsAdded = false;
      return;
    }
    this.imageService.addNewImage(this.image, this.file)
      .then(() => {
        this.toast.newToast({
          content: 'Image is added',
          style: 'success',
        });
        this.imageIsAdded = true;
        this.formReset();
      })
      .catch(err =>
        this.toast.newToast({
          content: `Error${err.name}`,
          style: 'warning',
        })
      );
  }


  formReset() {
    this.form.form.reset();
    this.imageIsDropped = false;
  }
}
