import {Injectable} from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import {Observable, of, combineLatest} from 'rxjs';
import {Album} from 'src/app/models/album';
import {AlbumService} from '../album/album.service';
import {map, switchMap, flatMap, tap} from 'rxjs/operators';
import {Image} from 'src/app/models/image';
import {AlbumcardsService} from '../albumcards/albumcards.service';
import {AlbumCards} from 'src/app/models/albumcards';
import {UtilityService} from '../utility.service';

import {dummyImage} from '../../models/image';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  albums$: Observable<Album[]>;
  albums: Album[];
  constructor(private afs: AngularFirestore, private utility: UtilityService) {}

  getRndImage(images: Image[]) {
    const rnd = Math.floor(Math.random() * Object.keys(images).length);
    return images[rnd];
  }

  getRandomImageFromDB() {
    return this.afs
      .collection('images', ref =>
        ref.where('albumUid', '==', '7dsLmxglXdUt97WNwuPb')
      )
      .valueChanges();
  }

  getAllImages() {
    return this.afs.collection<Image>('images').valueChanges();
  }

  getImagesForAlbum(albumUid: string) {
    return this.afs
      .collection('images', ref => ref.where('albumUId', '==', albumUid))
      .valueChanges()
      .pipe(
        map(images =>
          images.sort(
            (a: Image, b: Image) =>
              +a.imgName.replace(/[^\d]/g, '') -
              +b.imgName.replace(/[^\d]/g, '')
          )
        )
      );
  }

  addImage(image) {
    const imageUid = this.afs.createId();
    image.imageUid = imageUid;
    return this.afs
      .collection<Image>('images')
      .doc(imageUid)
      .set(image);
  }

  getFirstNImagesFromAlbum(album, n) {
    return this.afs.collection('albumcards', ref =>
      ref
        .where('albumUid', '==', album.albumUid)
        .orderBy('albumUid')
        .limit(n)
    );
  }

  getRandomImageFromAlbum(album: Album) {
    if (!album) {
      return;
    }
    const cardNumber = this.utility.getRndNumber(1, album.nrOfCards);
    // tslint:disable-next-line:max-line-length
    return this.afs
      .collection<'AlbumCards'>('albumcards', ref =>
        ref
          .where('albumUid', '==', album.albumUid)
          .where('nrOfCard', '==', cardNumber)
      )
      .valueChanges();
    // .pipe(
    //   map((albumcard: AlbumCards[]) => {
    //     if (albumcard[0]) {
    //       return albumcard[0]
    //     }
    //   })
    // );
  }

  getNCardsForAlbum(albumcards: AngularFirestoreCollection<any>) {
    return albumcards.valueChanges().pipe(
      map((albumcard: AlbumCards[]) => {
        if (albumcard) {
          return albumcard.map(item => item.image.url);
        }
      })
    );
  }

  updateImage(image: Image) {
    return this.afs
      .collection<Image>('images')
      .doc(image.imageUid)
      .update(image);
  }

  getImagesWithUid(imageUid) {
    return this.afs
      .collection('images', ref => ref.where('imageUid', '==', imageUid))
      .valueChanges();
  }

  deleteImage(imageUid: string) {
    return this.afs
      .collection<Image>('images')
      .doc(imageUid)
      .delete();
  }

  getImageFromUid(uid) {
    return this.afs.doc(`images/${uid}`).valueChanges();
  }

  getCurrentImage(albumcard: AlbumCards) {
    return this.afs
      .doc<Image>(`images/${albumcard.image.imageUid}`)
      .valueChanges();
  }
}
