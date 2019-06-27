import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ImageService } from 'src/app/services/image/image.service';
import { Observable, from, of } from 'rxjs';
import { Image, initialImage } from 'src/app/models/image';
import { GridApi, ColumnApi } from 'ag-grid-community';
import { Collection } from 'src/app/models/collections';
import { Album, initialAlbum } from 'src/app/models/album';
import { AlbumService } from 'src/app/services/album/album.service';
import { AlbumcardsService } from 'src/app/services/albumcards/albumcards.service';
import { NgForm } from '@angular/forms';
import { CollectionService } from 'src/app/services/collection.service';

@Component({
  selector: 'app-manage-images',
  templateUrl: './manage-images.component.html',
  styleUrls: ['./manage-images.component.scss'],
})
export class ManageImagesComponent implements OnInit {
  images$: Observable<Image[]>;
  collections$: Observable<Collection[]>;
  albums$: Observable<any[]>;
  cols;
  @ViewChild('f') form: NgForm;
  @ViewChild('selColl') selColl: HTMLSelectElement;
  private api: GridApi;
  private columnApi: ColumnApi;
  frameworkComponents;
  context;
  imagesColumns;
  delete;
  addToAlbum;
  albumColumns;
  deleteAlbum;
  collections;
  collection;
  albumNames;
  albumName;
  albums;
  album: Album = initialAlbum;
  cardsInAlbum: Image[];
  currAlbum = of(initialAlbum);
  imagesForAlbum$: Observable<any[]>;
  imagesForAlbum = [];
  defaultName: string;
  defaultCollection: string;

  constructor(
    private imageService: ImageService,
    private albumService: AlbumService,
    private albumcards: AlbumcardsService,
    private collectionService: CollectionService
  ) { }

  ngOnInit() {
    this.collections$ = this.collectionService.getAllCollections();
    this.images$ = this.imageService.getAllImages();

  }

  getAlbumNames(collection: Collection) {
    // tslint:disable-next-line:curly
    if (!collection) return;

    this.albums$ = this.albumService.getAlbumsFromCollection(collection.collection);

  }

  getImagesForAlbum(album: Album) {
    this.albumService.getAlbumFromCollectionAndName(album.name, album.collection)
      .subscribe(alb => this.currAlbum = alb[0]);
    this.imagesForAlbum$ = this.albumcards.getAllCardsForAlbumUid(album.albumUid);
  }
}
