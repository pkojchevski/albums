import {Injectable, OnDestroy} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {UsersAlbums, Cards} from '../models/usersalbums';
import {AlbumCards} from '../models/albumcards';
import {take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UsersalbumsService implements OnDestroy {
  userUid: string;
  constructor(private afs: AngularFirestore) {}

  addUsersAlbums(usersalbums: UsersAlbums) {
    usersalbums.uid = this.afs.createId();
    return this.afs.doc(`usersalbums/${usersalbums.uid}`).set(usersalbums);
  }

  updateUserAlbum(userAlbum: UsersAlbums) {
    return this.afs
      .collection('usersalbums')
      .doc(userAlbum.uid)
      .update(userAlbum)
      .then(() => console.log('userAlbum updated'));
  }

  addCardToUserAlbum(cards: AlbumCards[], answer: string, question: string) {
    return this.afs
      .collection('usersalbums', ref =>
        ref
          .where('userUid', '==', localStorage.getItem('user_uid'))
          // .where('albumUid', '==', cards[0].albumUid)
      )
      .valueChanges()
      .pipe(take(1))
      .subscribe((useralbums: UsersAlbums[]) => {
        cards.forEach((card: AlbumCards) => {
          useralbums[0].cards[card.nrOfCard - 1].received = true;
          useralbums[0].cards[card.nrOfCard - 1].nrOfCard = card.nrOfCard;
          useralbums[0].cards[card.nrOfCard - 1].image = card.image;
          useralbums[0].cards[card.nrOfCard - 1].quantity += 1;
          useralbums[0].cards[card.nrOfCard - 1].answer = answer;
          useralbums[0].cards[card.nrOfCard - 1].question = question;
        });
        this.afs.doc(`usersalbums/${useralbums[0].uid}`).update(useralbums[0]);
      });
  }

  getCardsForUserAlbum(albumUid) {
    return this.afs
      .collection('usersalbums', ref =>
        ref
          .where('userUid', '==', localStorage.getItem('user_uid'))
          .where('albumUid', '==', albumUid)
      )
      .valueChanges();
  }

  ngOnDestroy() {}
}
