import {Component, OnInit, Input} from '@angular/core';
import {Observable} from 'rxjs';
import {Album} from 'src/app/models/album';
import {AlbumService} from 'src/app/services/album/album.service';
import {Image} from 'src/app/models/image';
import {ImageService} from 'src/app/services/image/image.service';
import {take, tap, switchMap, map} from 'rxjs/operators';
import {DataService} from 'src/app/services/data/data.service';
import {AlbumcardsService} from 'src/app/services/albumcards/albumcards.service';
import {AlbumCards} from 'src/app/models/albumcards';

@Component({
  selector: 'app-interactive-album',
  templateUrl: './interactive-album.component.html',
  styleUrls: ['./interactive-album.component.scss'],
})
export class InteractiveAlbumComponent implements OnInit {
  albums$: Observable<Album[]>;
  rndAlbum$: Observable<Album>;
  rndAlbum: Album;
  images$: Observable<any>;
  images: any;
  imagesSliceLeft: Image[];
  imagesSliceRight: Image[];
  sliceNumber = 0;
  imagesArrayLength: number;
  endOfArray = false;
  beginingOfArray = true;
  showDesc = false;
  selectedIndex: number;
  clicked = false;
  lastCard;
  lastVisible;
  selected1 = [false, false, false, false];
  selected2 = [false, false, false, false];
  oneClick1 = false;
  oneClick2 = false;

  constructor(
    private imageService: ImageService,
    private dataService: DataService,
    private imagecardsService: AlbumcardsService
  ) {}

  ngOnInit() {
    this.dataService.currentAlbum.subscribe(album => {
      this.rndAlbum = album;
      if (this.rndAlbum.albumUid) {
        this.images$ = this.imagecardsService.getFirstNCardsForAlbum(
          this.rndAlbum.albumUid,
          8
        );
        this.images$.subscribe(images => (this.lastCard = images.length + 1));
      }
    });
  }

  next() {
    const nextAlbumCards = this.imagecardsService.getNextNCards(
      this.rndAlbum.albumUid,
      this.lastCard
    );
    nextAlbumCards.get().subscribe(
      documentSnapshots =>
        // Get the last visible document
        (this.lastCard = documentSnapshots.docs.length - 1)
    );
    this.imageService.getNCardsForAlbum(nextAlbumCards).subscribe(images => {
      if (images.length === 0) {
        this.endOfArray = true;
      } else {
        // this.images = images;
        this.endOfArray = false;
      }
    });
  }

  previouse() {
    this.lastCard -= 8;
    const previouseAlbumCards = this.imagecardsService.getNextNCards(
      this.rndAlbum.albumUid,
      this.lastCard
    );
    previouseAlbumCards.get().subscribe(
      documentSnapshots =>
        // Get the last visible document
        (this.lastCard = documentSnapshots.docs.length - 1)
    );
    this.imageService
      .getNCardsForAlbum(previouseAlbumCards)
      .subscribe(images => {
        if (images.length === 0) {
          this.beginingOfArray = true;
        } else {
          // this.images = images;
          this.beginingOfArray = false;
        }
      });
  }

  iconIsClicked1(i) {
    this.oneClick1 = !this.oneClick1;
    if (this.oneClick1) {
      this.selected1[i] = true;
    } else {
      this.selected1[i] = false;
    }
  }

  iconIsClicked2(i) {
    this.oneClick2 = !this.oneClick2;
    if (this.oneClick2) {
      this.selected2[i] = true;
    } else {
      this.selected2[i] = false;
    }
  }


}
