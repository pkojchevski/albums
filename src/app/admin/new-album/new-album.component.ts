import {Component, OnInit} from '@angular/core';
import {Collection} from '../../models/collections';
import {Album, initialAlbum} from 'src/app/models/album';
import {AlbumService} from 'src/app/services/album/album.service';
import {ToastService} from 'src/app/services/toast/toast.service';
import {Observable} from 'rxjs';
import {CollectionService} from 'src/app/services/collection.service';

@Component({
  selector: 'app-new-album',
  templateUrl: './new-album.component.html',
  styleUrls: ['./new-album.component.scss'],
})
export class NewAlbumComponent implements OnInit {
  collections$: Observable<Collection[]>;
  albumName: string;
  collection: string;
  imagesColumn;
  album: Album = initialAlbum;

  constructor(
    private albumService: AlbumService,
    private toast: ToastService,
    private collectionService: CollectionService
  ) {}

  ngOnInit() {
    this.collections$ = this.collectionService.getAllCollections();
  }

  valueChanged(event) {
    this.album.genericQuiz = event;
  }

  addAlbum(e) {
    console.log('album:', this.album);
    e.preventDefault();
    this.albumService
      .addNewAlbum(this.album)
      .then(() => {
        this.toast.newToast({
          content: 'Album is added',
          style: 'success',
        });
      })
      .catch(err =>
        this.toast.newToast({
          content: `There was problem:${err}`,
          style: 'warning',
        })
      );
  }
}
