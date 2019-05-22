import {Component, OnInit, Testability} from '@angular/core';
import {Album} from 'src/app/models/album';
import {AlbumService} from 'src/app/services/album/album.service';
import {ImageService} from 'src/app/services/image/image.service';
import {Image} from 'src/app/models/image';
import {DataService} from 'src/app/services/data/data.service';
import {
  first,
  filter,
  tap,
  switchMap,
  catchError,
  distinctUntilChanged,
  flatMap,
  mergeMap,
} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Collection} from 'src/app/models/collections';
import {CollectionService} from 'src/app/services/collection.service';
import {AlbumcardsService} from 'src/app/services/albumcards/albumcards.service';
import {AlbumCards} from 'src/app/models/albumcards';
import {UtilityService} from 'src/app/services/utility.service';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss'],
})
export class CollectionsComponent implements OnInit {
  randomImage$;
  randomImage;
  images: Image[];
  album: Album;
  collections$: Observable<Collection[]>;
  albums;
  album$;
  classes = [
    'color-blue',
    'color-violet',
    'color-green',
    'color-lemon',
    'color-orange',
    'color-red',
    'color-pink',
    'color-d_red',
    'color-yellow',
    'color-lighblue',
    'color-lightred',
    'color-light-green',
  ];
  constructor(
    private albumService: AlbumService,
    private imageService: ImageService,
    private dataService: DataService,
    private utility: UtilityService
  ) {}

  ngOnInit() {
    this.album$ = this.albumService.getRndAlbum();
    this.album$.subscribe(album => console.log('album:', album));
    this.randomImage$ = this.album$.pipe(
      filter(Boolean),
      distinctUntilChanged(),
      switchMap((album: Album) =>
        this.imageService.getRandomImageFromAlbum(album)
      )
    );

    this.randomImage$.subscribe(img => (this.randomImage = img[0]));

    this.albumService.getAllAlbums().subscribe(albums => {
      if (albums.length >= 5) {
        this.albums = this.utility.getRandom(albums, 5);
      } else {
        this.albums = this.utility.getRandom(albums, albums.length);
      }
      this.dataService.changeAlbums(this.albums);
      this.albums.forEach(album => {
        this.imageService
          .getRandomImageFromAlbum(album)
          .subscribe(albumcard => {
            album['url'] = albumcard[0]['image'].url;
          });
      });
    });
    // this.albumService.getAllAlbums().subscribe((albums: Album[]) => {
    //   this.albums = albums.filter((album: Album) => album.nrOfCards > 0);
    // });
    // this.imageService
    //   .getAllImages()
    //   .pipe(first())
    //   .subscribe((images: Image[]) => {
    //     // this.albums = albums;
    //     // this.randomAlbum = this.albumService.getRandomAlbum(albums);
    //     this.images = images;
    //     this.dataService.changeImage(images);
    //     this.randomImage = this.imageService.getRndImage(images);
    //   });
  }
}
