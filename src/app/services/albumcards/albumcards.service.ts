import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable, forkJoin, combineLatest} from 'rxjs';
import {merge, switchMap, concat, first, take, flatMap} from 'rxjs/operators';
import {AlbumCards} from 'src/app/models/albumcards';
import {tap, map} from 'rxjs/operators';
import {UtilityService} from '../utility.service';
import {Album} from 'src/app/models/album';
import {Image} from 'src/app/models/image';

@Injectable({
  providedIn: 'root',
})
export class AlbumcardsService {
  albumcard$: Observable<AlbumCards[]>;

  constructor(
    private afs: AngularFirestore,
    private utilityService: UtilityService
  ) {}

  addAlbumCards(albumUid: string, nrOfCard: number, image: Image) {
    const albumcardUid = this.afs.createId();
    return this.afs
      .collection<AlbumCards>('albumcards')
      .add({albumcardUid, albumUid, image, nrOfCard});
  }

  getFirstNCardsForAlbum(albumUid, limit) {
    return this.afs
      .collection('albumcards', ref =>
        ref
          .where('albumUid', '==', albumUid)
          .orderBy('nrOfCard', 'asc')
          .limit(limit)
      )
      .valueChanges();
    // n;
    // .pipe(
    //   map((albumcards: AlbumCards[]) =>
    //     albumcards.map((albumcard: AlbumCards) =>
    //       this.afs
    //         .collection('images')
    //         .doc(albumcard.image.imageUid)
    //         .valueChanges()
    //     )
    //   ),
    //   flatMap(obs => combineLatest(obs))
    // );
  }

  getNextNCards(albumUid, lastCard) {
    return this.afs.collection('albumcards', ref =>
      ref
        .where('albumUid', '==', albumUid)
        .orderBy('nrOfCard')
        .startAfter(lastCard)
        .limit(8)
    );
  }

  // get random 3 cards for album

  getRandomThreeCardsFromAlbum(album: Album): any {
    const rnd1 = this.utilityService.getRndNumber(1, album.nrOfCards);
    const rnd2 = this.utilityService.getRndNumber(1, album.nrOfCards);
    const rnd3 = this.utilityService.getRndNumber(1, album.nrOfCards);

    const image1$ = this.afs
      .collection('albumcards', ref =>
        ref
          .where('albumUid', '==', album.albumUid)
          .where('nrOfCard', '==', rnd1)
      )
      .valueChanges();
    const image2$ = this.afs
      .collection('albumcards', ref =>
        ref
          .where('albumUid', '==', album.albumUid)
          .where('nrOfCard', '==', rnd2)
      )
      .valueChanges();
    const image3$ = this.afs
      .collection('albumcards', ref =>
        ref
          .where('albumUid', '==', album.albumUid)
          .where('nrOfCard', '==', rnd3)
      )
      .valueChanges();
    return combineLatest<any[]>(image1$, image2$, image3$).pipe(
      map(arr => arr.reduce((acc, cur) => acc.concat(cur)))
    );
  }

  getAlbumCards(albumUid, cardUid) {
    return this.afs
      .collection<AlbumCards>('albumcards', ref =>
        ref.where('albumUid', '==', albumUid).where('cardUid', '==', cardUid)
      )
      .valueChanges();
  }

  deleteAlbumCards(uid) {
    return this.afs
      .collection<AlbumCards>('albumcards')
      .doc(uid)
      .delete();
  }

  updateCardNumber(albumcard: AlbumCards) {
    return this.afs
      .collection('albumcards')
      .doc(albumcard.albumcardUid)
      .update(albumcard);
  }

  getAllCardsForAlbumUid(uid) {
    return this.afs
      .collection<AlbumCards>('albumcards', ref =>
        ref.where('albumUid', '==', uid).orderBy('nrOfCard')
      )
      .valueChanges();
  }

  getAllCardsUrlForAlbumUid(uid) {
    return this.getAllCardsForAlbumUid(uid).pipe(
      map(images =>
        images.map(image =>
          this.afs.collection('images', ref => ref.where('imageUid', '==', uid))
        )
      )
    );
  }
}
