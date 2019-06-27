import { Component, OnInit, ViewChild } from '@angular/core';
import { Collection } from '../../models/collections';
import { Album, initialAlbum } from 'src/app/models/album';
import { AlbumService } from 'src/app/services/album/album.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { Observable } from 'rxjs';
import { CollectionService } from 'src/app/services/collection.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-new-album',
  templateUrl: './new-album.component.html',
  styleUrls: ['./new-album.component.scss'],
})
export class NewAlbumComponent implements OnInit {
  @ViewChild('addImageForm') form: NgForm;
  collections$: Observable<Collection[]>;
  albumName: string;
  collection: string;
  imagesColumn;
  album = {} as Album;
  file: any;
  imageIsDropped: boolean;
  albumIsAdded: boolean;

  constructor(
    private albumService: AlbumService,
    private toast: ToastService,
    private collectionService: CollectionService
  ) { }

  ngOnInit() {
    this.collections$ = this.collectionService.getAllCollections();
    this.album.genericQuiz = false;
    this.album.nrOfCards = 0;
  }

  valueChanged(event) {
    this.album.genericQuiz = event;
  }

  getImageUrl(event) {
    this.file = event.file;
    this.imageIsDropped = event.dropped;
  }

  addAlbum() {
    if (!this.imageIsDropped) {
      this.toast.newToast({
        content: `Please upload image!`,
        style: 'warning',
      });
      this.albumIsAdded = false;
      return;
    }

    this.albumService
      .addNewAlbum(this.album, this.file)
      .then(() => {
        this.toast.newToast({
          content: 'Album is added',
          style: 'success',
        });
        this.albumIsAdded = true;
        this.formReset();
      })
      .catch(err =>
        this.toast.newToast({
          content: `There was problem:${err}`,
          style: 'warning',
        })
      );
  }

  formReset() {
    this.form.form.reset();
    this.imageIsDropped = false;
  }
}
