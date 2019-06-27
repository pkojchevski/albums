import { Component, OnInit } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import { DataService } from 'src/app/services/data/data.service';
import { AlbumcardsService } from 'src/app/services/albumcards/albumcards.service';
import { Album } from 'src/app/models/album';
import { AlbumCards } from 'src/app/models/albumcards';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { AlbumService } from 'src/app/services/album/album.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-trivia-first',
  templateUrl: './trivia-first.component.html',
  styleUrls: ['./trivia-first.component.scss'],
})
export class TriviaFirstComponent implements OnInit {
  username: string;
  album: Album;
  cards$: any;
  albumUid: string;

  constructor(
    private modalService: ModalService,
    private dataService: DataService,
    private albumService: AlbumService,
    private route: ActivatedRouteSnapshot,
    private albumcardService: AlbumcardsService
  ) { }

  ngOnInit() {
    this.albumUid = this.route.paramMap.get('albumUid');
    this.username = localStorage.getItem('user_name');
    this.cards$ = this.albumService.getAlbumFromUid(this.albumUid).
      pipe(
        switchMap((album: Album) => {
          return this.albumcardService.getRandomThreeCardsFromAlbum(album);
        })
      );

    // this.dataService.currentAlbum.subscribe(album => {
    //   this.album = album;
    //   this.cards$ = this.albumcardService.getRandomThreeCardsFromAlbum(album);
    //   this.cards$.subscribe((albumCards: AlbumCards[]) => {
    //     this.dataService.changeAlbumCards(albumCards);
    //   });
    // });


    openModal(modalType) {
      this.modalService.modalShow({
        modalShow: true,
        modalContent: { modalType: modalType },
      });
    }
  }
