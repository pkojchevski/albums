import {Component, OnInit} from '@angular/core';
import {ImageService} from 'src/app/services/image/image.service';
import {DataService} from 'src/app/services/data/data.service';
import {Observable} from 'rxjs';
import {Album} from 'src/app/models/album';
import {AlbumcardsService} from 'src/app/services/albumcards/albumcards.service';
import {Cards} from 'src/app/models/usersalbums';
import {UsersalbumsService} from 'src/app/services/usersalbums.service';

@Component({
  selector: 'app-open-album',
  templateUrl: './open-album.component.html',
  styleUrls: ['./open-album.component.scss'],
})
export class OpenAlbumComponent implements OnInit {
  albums$: Observable<Album[]>;
  rndAlbum$: Observable<Album>;
  rndAlbum: Album;
  images$: Observable<any>;
  images: any;
  sliceNumber = 0;
  imagesArrayLength: number;
  endOfArray = false;
  beginingOfArray = true;
  showDesc = false;
  selectedIndex: number;
  clicked = false;
  lastCard;
  lastVisible;

  userCards$: Observable<Cards[]>;
  userAlbum;
  arrayLengthMin: number;
  arrayLengthMax: number;
  userAlbumSliced;

  constructor(
    private imageService: ImageService,
    private dataService: DataService,
    private imagecardsService: AlbumcardsService,
    private userAlbumService: UsersalbumsService
  ) {}

  ngOnInit() {
    this.dataService.currentArr1.subscribe(userAlbum => {
      this.userAlbum = userAlbum;
      this.arrayLengthMin = 0;
      this.arrayLengthMax = 8;
      if (this.userAlbum.cards.length - 1 < 7) {
        this.arrayLengthMax = this.userAlbum.cards.length - 1;
        this.beginingOfArray = true;
        this.endOfArray = true;
      }

      this.userAlbumSliced = this.userAlbum.cards
        .slice(this.arrayLengthMin, this.arrayLengthMax)
        .sort((a, b) => b.nrOfCards - a.nrofCards);
    });
  }

  onItemDropped(event, card) {
    if (event.dragData.nrOfCard === card.nrOfCard) {
      card.added = true;
      card.quantity--;

      const index = this.userAlbum.cards.find(el => el === card);
      this.userAlbum.cards[index] = card;
      this.userAlbumService.updateUserAlbum(this.userAlbum);
    }
  }

  next() {
    this.arrayLengthMin += 8;
    this.arrayLengthMax += 8;

    if (this.userAlbum.cards.length - 1 <= this.arrayLengthMin) {
      this.endOfArray = true;
      this.beginingOfArray = true;
      return;
    }
    if (this.userAlbum.cards.length >= this.arrayLengthMax) {
      this.endOfArray = false;
      this.beginingOfArray = false;
    } else {
      this.endOfArray = true;
      this.beginingOfArray = false;
      this.arrayLengthMax = this.userAlbum.cards.length;
    }
    this.userAlbumSliced = this.userAlbum.cards.slice(
      this.arrayLengthMin,
      this.arrayLengthMax
    );
  }

  previouse() {
    this.arrayLengthMin -= 8;

    if (this.arrayLengthMin < 0) {
      this.arrayLengthMin = 0;
      this.beginingOfArray = true;
      return;
    }

    if (this.endOfArray) {
      this.beginingOfArray = false;
      this.endOfArray = false;
      const length = this.arrayLengthMax;
      this.arrayLengthMax = length - (this.userAlbum.cards.length % 8);
    } else {
      this.arrayLengthMax -= 8;
      this.beginingOfArray = false;
    }
    this.userAlbumSliced = this.userAlbum.cards.slice(
      this.arrayLengthMin,
      this.arrayLengthMax
    );
  }
}
