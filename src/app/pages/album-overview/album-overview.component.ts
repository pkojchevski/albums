import {Component, OnInit} from '@angular/core';
import {UsersAlbums} from 'src/app/models/usersalbums';
import {DataService} from 'src/app/services/data/data.service';
import {Observable} from 'rxjs';
import {map, filter} from 'rxjs/operators';

@Component({
  selector: 'app-album-overview',
  templateUrl: './album-overview.component.html',
  styleUrls: ['./album-overview.component.scss'],
})
export class AlbumOverviewComponent implements OnInit {
  cards = Array.apply(null, {length: 100}).map(Number.call, Number);
  userAlbum;
  userAlbum$: Observable<any>;
  cardsToAdd$: Observable<any>;
  cardsAdded$: Observable<any>;
  cardsDuplicates$: Observable<any>;
  cardsMissing$: Observable<any>;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.userAlbum$ = this.dataService.currentArr1;
    this.cardsToAdd$ = this.dataService.currentArr2;
    this.cardsAdded$ = this.dataService.currentArr3;
    this.cardsDuplicates$ = this.dataService.currentArr4;
    this.cardsMissing$ = this.userAlbum$.pipe(
      map(userAlbums => userAlbums.map(ua => ua.cards)),
      filter(el => el.quantity === 0)
    );
  }
}
