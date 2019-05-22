import {Component, OnInit, Input} from '@angular/core';
import {Album} from 'src/app/models/album';
import {Router} from '@angular/router';
import {DataService} from 'src/app/services/data/data.service';
import {Image} from 'src/app/models/image';
import {ImageService} from 'src/app/services/image/image.service';
import {Observable} from 'rxjs';
import {AlbumService} from 'src/app/services/album/album.service';
import {dummyImage} from '../../models/image';
import {flatMap, map} from 'rxjs/operators';

@Component({
  selector: 'app-album-preview',
  templateUrl: './album-preview.component.html',
  styleUrls: ['./album-preview.component.scss'],
})
export class AlbumPreviewComponent implements OnInit {
  @Input()
  album;
  albums: Observable<Album>;
  rndImage$: Observable<any>;
  rndImage: Image;
  images: Image[];
  loaded = false;
  dummyImage = dummyImage;

  constructor(
    private router: Router,
    private dataService: DataService,
    private imageService: ImageService
  ) {}

  ngOnInit() {
    this.rndImage$ = this.imageService.getRandomImageFromAlbum(this.album);
  }

  openAlbum(album) {
    this.router.navigate([`album/${album.name}`]);
    this.dataService.changeAlbum(this.album);
    this.dataService.changeImage([this.rndImage]);
  }

  dosomething() {
    this.loaded = true;
  }
}
