import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data/data.service';
import { Album } from 'src/app/models/album';
import { Observable } from 'rxjs';
import { ModalService } from '../../services/modal.service';
import { Image } from 'src/app/models/image';
import { ActivatedRoute } from '@angular/router';
import { UsersAlbums, Cards } from 'src/app/models/usersalbums';

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
  album: Album;
  isSubscribedAlbum$: Observable<any>;

  constructor(
    private dataService: DataService,
    private modalService: ModalService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.isSubscribedAlbum$ = this.dataService.currentObject;
    this.albumSingle = this.route.snapshot.data['album'];
    // this.dataService.currentAlbum.pipe(take(1)).subscribe(album => {
    //   this.albumSingle = album;
    //   this.usersAlbumsService
    //     .getCardsForUserAlbum(album.albumUid)
    //     .subscribe((useralbumCard: UsersAlbums[]) => {
    //       if (useralbumCard.length) {
    //         this.userAlbum = useralbumCard[0];
    //         this.dataService.changeArr1(useralbumCard[0]);

    //         this.cardsAdded = useralbumCard[0].cards
    //           .slice(0, 7)
    //           .filter((c: Cards) => c.added);
    //         this.dataService.changeArr2(this.cardsAdded);

    //         this.cardsToAdd = useralbumCard[0].cards
    //           .filter((c: Cards) => c.received && !c.added)
    //           .sort((b, a) => a.nrOfCard - b.nrOfCard);
    //         this.dataService.changeArr3(this.cardsAdded);

    //         this.cardsDuplicated = this.utilityService.getDuplicates(
    //           useralbumCard[0].cards
    //         );
    //         this.dataService.changeArr4(this.cardsDuplicated);
    //         const rnd = this.utilityService.getRndNumber(
    //           0,
    //           useralbumCard[0].cards.length - 1
    //         );

    //         this.rndImage = useralbumCard[0].cards[rnd].image;
    //       }

    //       // add get rndImage
    //     });
    // });
  }

  next() {
    this.albumOpened = true;
  }

  openGroupModal() {
    this.modalService.modalShow({
      modalShow: true,
      modalContent: { modalType: 'create_group' },
    });
  }

  openSubscriptionModal() {
    this.dataService.changeAlbum(this.albumSingle);
    this.modalService.modalShow({
      modalShow: true,
      modalContent: { modalType: 'album_subscription' },
    });
  }

}
