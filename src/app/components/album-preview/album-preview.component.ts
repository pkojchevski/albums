import { Component, OnInit, Input } from '@angular/core';
import { Album } from 'src/app/models/album';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data/data.service';
import { Image } from 'src/app/models/image';
import { ImageService } from 'src/app/services/image/image.service';
import { Observable } from 'rxjs';
import { dummyImage } from '../../models/image';
import { UtilityService } from 'src/app/services/utility.service';
import { AlbumService } from 'src/app/services/album/album.service';

@Component({
  selector: 'app-album-preview',
  templateUrl: './album-preview.component.html',
  styleUrls: ['./album-preview.component.scss'],
})
export class AlbumPreviewComponent implements OnInit {
  @Input()
  album;
  loaded = false;

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
  }

  // openAlbum(album) {
  //   this.router.navigate([`album/${album.albumUid}`]);
  //   // this.dataService.changeAlbum(this.album);
  //   // this.dataService.changeImage([this.rndImage]);
  // }

  dosomething() {
    this.loaded = true;
  }
}
