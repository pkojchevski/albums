import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Observable, throwError } from 'rxjs';
import { Album } from 'src/app/models/album';
import { map, finalize, catchError } from 'rxjs/operators';
import { Image } from 'src/app/models/image';
import { AlbumCards } from 'src/app/models/albumcards';
import { UtilityService } from '../utility.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { ToastService } from '../toast/toast.service';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  albums$: Observable<Album[]>;
  albums: Album[];
  constructor(private afs: AngularFirestore, private utility: UtilityService,
    private afStorage: AngularFireStorage, private toast: ToastService) { }

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

  addNewImage(image: Image, file: any) {
    image.imageUid = this.afs.createId();
    const path = `images/${file.name}`;
    const fileRef = this.afStorage.ref(path);
    const task = this.afStorage.upload(path, file);
    // this.percentage$ = task.percentageChanges();
    const albumTask$ = task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            image.url = url;
            this.afs.collection('images').doc(image.imageUid).set(image)
              .then(() => {
                // this.percentage$ = of(null);
                // this.formReset();
                this.toast.newToast({
                  content: 'Image is added',
                  style: 'success',
                });
              })
              .catch(err => {
                this.toast.newToast({
                  content: `Error${err.name}`,
                  style: 'warning',
                });
              });
          });
        }),
        catchError(err => {
          this.toast.newToast({ content: `Error${err.name}`, style: 'warning' });
          return throwError(err);
        })
      );
    return albumTask$.toPromise();
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
