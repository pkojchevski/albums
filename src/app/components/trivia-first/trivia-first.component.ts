import {Component, OnInit} from '@angular/core';
import {ModalService} from 'src/app/services/modal.service';
import {DataService} from 'src/app/services/data/data.service';
import {AlbumcardsService} from 'src/app/services/albumcards/albumcards.service';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Album} from 'src/app/models/album';
import {Cards} from 'src/app/models/usersalbums';
import {AlbumCards} from 'src/app/models/albumcards';

@Component({
  selector: 'app-trivia-first',
  templateUrl: './trivia-first.component.html',
  styleUrls: ['./trivia-first.component.scss'],
})
export class TriviaFirstComponent implements OnInit {
  username: string;
  album: Album;
  cards$: any;

  constructor(
    private modalService: ModalService,
    private dataService: DataService,
    private albumcardService: AlbumcardsService
  ) {}

  ngOnInit() {
    this.username = localStorage.getItem('user_name');
    this.dataService.currentAlbum.subscribe(album => {
      this.album = album;
      this.cards$ = this.albumcardService.getRandomThreeCardsFromAlbum(album);
      this.cards$.subscribe((albumCards: AlbumCards[]) => {
        this.dataService.changeAlbumCards(albumCards);
      });
    });
  }

  openModal(modalType) {
    console.log('open modal');
    this.modalService.modalShow({
      modalShow: true,
      modalContent: {modalType: modalType},
    });
  }
}
