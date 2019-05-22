import {Component, OnInit} from '@angular/core';
import {DataService} from 'src/app/services/data/data.service';
import {Album} from 'src/app/models/album';
import {Observable} from 'rxjs';
import {ModalService} from '../../services/modal.service';
import {Image} from 'src/app/models/image';
import {ImageService} from 'src/app/services/image/image.service';
import {Router} from '@angular/router';
import {map, take} from 'rxjs/operators';
import {UsersalbumsService} from 'src/app/services/usersalbums.service';
import {UsersAlbums, Cards} from 'src/app/models/usersalbums';
import {UtilityService} from 'src/app/services/utility.service';

@Component({
  selector: 'app-album-single',
  templateUrl: './album-single.component.html',
  styleUrls: ['./album-single.component.scss'],
})
export class AlbumSingleComponent implements OnInit {
  album$: Observable<Album>;
  albumSingle: Album;
  rndImage: Image;
  cardsAdded;
  cardsToAdd = [];
  cardsDuplicated = [];
  albumOpened = false;
  userAlbum: UsersAlbums;
  arrayLengthMin: number;
  arrayLengthMax: number;
  albumEnd = false;
  albumBeginning = true;

  constructor(
    private dataService: DataService,
    private modalService: ModalService,
    private router: Router,
    private usersAlbumsService: UsersalbumsService,
    private utilityService: UtilityService
  ) {}

  ngOnInit() {
    this.arrayLengthMin = 0;
    this.arrayLengthMax = 7;
    this.dataService.currentAlbum.pipe(take(1)).subscribe(album => {
      this.albumSingle = album;
      this.usersAlbumsService
        .getCardsForUserAlbum(album.albumUid)
        .subscribe((useralbumCard: UsersAlbums[]) => {
          if (useralbumCard.length) {
            this.userAlbum = useralbumCard[0];
            this.dataService.changeArr1(useralbumCard[0]);

            this.cardsAdded = useralbumCard[0].cards
              .slice(0, 7)
              .filter((c: Cards) => c.added);
            this.dataService.changeArr2(this.cardsAdded);

            this.cardsToAdd = useralbumCard[0].cards
              .filter((c: Cards) => c.received && !c.added)
              .sort((b, a) => a.nrOfCard - b.nrOfCard);
            this.dataService.changeArr3(this.cardsAdded);

            this.cardsDuplicated = this.utilityService.getDuplicates(
              useralbumCard[0].cards
            );
            this.dataService.changeArr4(this.cardsDuplicated);
            const rnd = this.utilityService.getRndNumber(
              0,
              useralbumCard[0].cards.length - 1
            );

            this.rndImage = useralbumCard[0].cards[rnd].image;
          }

          // add get rndImage
        });
    });
  }

  next() {
    this.albumOpened = true;
  }

  openGroupModal() {
    this.modalService.modalShow({
      modalShow: true,
      modalContent: {modalType: 'create_group'},
    });
  }

  openSubscriptionModal() {
    this.modalService.modalShow({
      modalShow: true,
      modalContent: {modalType: 'album_subscription'},
    });
  }

  goToExchange() {
    this.router.navigateByUrl('cards-exchange');
  }

  goToAlbumOverview() {
    this.router.navigateByUrl('album-overview');
  }

  goToRanking() {
    this.router.navigateByUrl('ranking');
  }
}
