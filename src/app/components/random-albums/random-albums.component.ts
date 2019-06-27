import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { DataService } from 'src/app/services/data/data.service';
import { AlbumService } from 'src/app/services/album/album.service';
import { take, bufferCount, first } from 'rxjs/operators';
import { ImageService } from 'src/app/services/image/image.service';
import { Observable } from 'rxjs';
import { Album } from 'src/app/models/album';
import { Image } from 'src/app/models/image';
import { UtilityService } from 'src/app/services/utility.service';
import { AlbumCards } from 'src/app/models/albumcards';

@Component({
  selector: 'app-random-albums',
  templateUrl: './random-albums.component.html',
  styleUrls: ['./random-albums.component.scss'],
})
export class RandomAlbumsComponent implements OnInit {
  images: any;
  loaded = false;
  rndAlbum: Album;
  lastVisible;
  albums: any[];

  constructor(
    private modalService: ModalService,
    private albumService: AlbumService,
    private imageService: ImageService,
    private utility: UtilityService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.albumService.getAllAlbums().subscribe(albums => {
      this.rndAlbum = this.utility.getRandom(albums, 1)[0];
      this.dataService.changeAlbum(this.rndAlbum);

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
            if (albumcard[0]) {
              album['url'] = albumcard[0]['image'].url;
              this.loaded = true;
            }
          });
      });
    });
  }

  openModal() {
    this.modalService.modalShow({
      modalShow: true,
      modalContent: { modalType: 'auth' },
    });
  }
}
