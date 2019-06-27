import { Injectable } from '@angular/core';
import {
  AngularFirestoreDocument,
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Album } from '../../models/album';
import { map, expand, finalize, catchError, first } from 'rxjs/operators';
import { Image } from 'src/app/models/image';
import { ToastService } from '../toast/toast.service';
import { AlbumcardsService } from '../albumcards/albumcards.service';
import { Observable, EMPTY, throwError } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';

import { BehaviorSubject } from 'rxjs';
import { UtilityService } from '../utility.service';

@Injectable({
  providedIn: 'root',
})
export class AlbumService {
  albumRef: AngularFirestoreCollection<Album>;

  private isAlbumAddedSource = new BehaviorSubject<Boolean>(false);
  isAlbumAdded$ = this.isAlbumAddedSource.asObservable();

  constructor(
    private afs: AngularFirestore,
    private toast: ToastService,
    private albumcards: AlbumcardsService,
    private afStorage: AngularFireStorage,
    private utilityService: UtilityService
  ) { }

  addNewAlbum(album: Album, file: any) {
    album.albumUid = this.afs.createId();
    album.nrOfCards = 0;
    const path = `images/albumsCoverage/${file.name}`;
    const fileRef = this.afStorage.ref(path);
    const task = this.afStorage.upload(path, file);
    // this.percentage$ = task.percentageChanges();
    const albumTask$ = task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            album.coverPageUrl = url;
            this.afs.collection('albums').doc(album.albumUid).set(album)
              .then(() => {
                // this.percentage$ = of(null);
                // this.formReset();
                this.toast.newToast({
                  content: 'Image is added',
                  style: 'success',
                });
                this.isAlbumAddedSource.next(true);
              })
              .catch(err => {
                this.toast.newToast({
                  content: `Error${err.name}`,
                  style: 'warning',
                });
                this.isAlbumAddedSource.next(false);
              });
          });
        }),
        catchError(err => {
          this.toast.newToast({ content: `Error${err.name}`, style: 'warning' });
          return throwError(err);
        })
      );
    // .subscribe();
    return albumTask$.toPromise();
  }


  updateAlbum(album) {
    this.afs
      .collection<Album>('albums')
      .doc(album.albumUid)
      .update(album);
  }

  addImageToAlbum(albumUid: string, image: Image) {
    let nrOfCards = 0;
    return this.afs
      .doc<Album>(`albums/${albumUid}`)
      .get()
      .forEach(doc => {
        nrOfCards = Number(doc.data().nrOfCards) + 1;
        this.afs
          .doc<Album>(`albums/${albumUid}`)
          .update({ nrOfCards })
          .then(() => this.albumcards.addCardsToAlbum(albumUid, nrOfCards, image)
            // const newId = this.afs.createId();
            // return this.afs
            //   .collection('albums/${albumUid}/cards')
            //   .doc(newId)
            //   .set({
            //     image,
            //     nrOfCard: nrOfCards,
            //   });
          )
          .then(() =>
            this.toast.newToast({ content: 'Image is added', style: 'success' })
          )
          .catch(err =>
            this.toast.newToast({ content: 'Err:' + err, style: 'warning' })
          );
      });
  }
  removeImageFromAlbum(albumUid, albumcardUid) {
    return this.afs
      .doc<Album>(`albums/${albumUid}`)
      .get()
      .forEach(doc => {
        const nrOfCards: number =
          Number(doc.data().nrOfCards) - 1 === 0
            ? 0
            : Number(doc.data().nrOfCards) - 1;
        this.afs
          .doc<Album>(`albums/${albumUid}`)
          .update({ nrOfCards })
          .then(() => {
            console.log('albumcardid:', albumcardUid);
            return this.afs
              .doc(`albums/${albumUid}/cards/${albumcardUid}`)
              // .doc(albumUid)
              // .collection('cards')
              // .doc(albumcardsUid)
              .delete();
          })
          .then(() =>
            this.toast.newToast({
              content: 'Image is removed from album',
              style: 'success',
            })
          )
          .catch(err =>
            this.toast.newToast({ content: 'Err:' + err, style: 'warning' })
          );
      });
  }

  getAllAlbums() {
    return this.afs.collection<Album>('albums').valueChanges();
  }

  getRandomAlbums(albums: Album[], n): Album[] {
    const shuffled = albums.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  }

  getRndAlbum(): Observable<any> {
    return this.getRandomAlbumChild().pipe(
      expand((document: any) => {
        return document === null
          ? this.getRandomAlbumChild()
          : EMPTY;
      })
    );
  }

  getRandomAlbumChild() {
    const rnd = this.afs.createId();
    return this.afs
      .collection('albums', ref =>
        ref
          .where('albumUid', '>', rnd)
          .limit(1)
      )
      .valueChanges()
      .pipe(
        map(arr => {
          if (arr && arr.length) {
            return arr[0];
          } else {
            return null;
          }
        })
      );
  }

  getAlbum(collection: string, albumName: string) {
    return this.afs
      .collection('albums', ref =>
        ref.where('collection', '==', collection).where('name', '==', albumName)
      )
      .valueChanges();
  }

  getAlbumsFromCollection(collection: string) {
    return this.afs
      .collection('albums', ref => ref.where('collection', '==', collection))
      .valueChanges();
    // .snapshotChanges()
    // .pipe(
    //   map(snaps => this.utilityService.convertSnaps<Album[]>(snaps))
    // );
  }

  getRandomAlbum(albums: Album[]): Album {
    const rnd = Math.floor(Math.random() * albums.length);
    return albums[rnd];
  }

  deleteAlbum(uid) {
    return this.afs
      .collection<Album>('albums')
      .doc(uid)
      .delete();
  }

  getAlbumFromUid(uid: string) {
    return this.afs.doc(`albums/${uid}`)
      // return this.afs.collection('albums', ref => ref.where('albumUid', '==', uid))
      .valueChanges()
      .pipe(
        first()
      );
    // .snapshotChanges()
    // .pipe(
    //   map(snaps => this.utilityService.convertSnaps<Album>(snaps))
    // );
  }

  albumIncrementNrOfCards(uid) {
    const album_ref = this.afs.collection('albums').doc(uid);
    // Update count in a transaction
    return this.afs.firestore.runTransaction(t => {
      return t.get(album_ref[0]).then(doc => {
        const new_nrOfCards = doc.data().nrOfCards + 1;
        t.update(album_ref[0], { nrOfCards: new_nrOfCards });
      });
    });
  }

  albumDecreaseNrOfCards(uid) {
    const album_ref = this.afs.collection('shards').doc(uid);
    // Update count in a transaction
    return this.afs.firestore.runTransaction(t => {
      return t.get(album_ref[0]).then(doc => {
        const new_nrOfCards = doc.data().nrOfCards - 1;
        t.update(album_ref[0], { nrOfCards: new_nrOfCards });
      });
    });
  }

  getImagesFromAlbum(uid) {
    const album_ref = this.afs.collection('albums').doc(uid);
    // Update count in a transaction
    return this.afs.firestore.runTransaction(t => {
      return t.get(album_ref[0]).then(doc => {
        const new_nrOfCards = doc.data().nrOfCards - 1;
        t.update(album_ref[0], { nrOfCards: new_nrOfCards });
      });
    });
  }

  getAlbumFromAlbumArray(albums, name, collection): Album {
    return albums.filter(
      album => album.name === name && album.collection === collection
    )[0];
  }

  getAlbumFromCollectionAndName(name, collection): Observable<any> {
    return this.afs
      .collection('albums', ref =>
        ref.where('name', '==', name).where('collection', '==', collection)
      )
      .valueChanges();
  }

  getAlbums(pageNumber = 0, pageSize = 5): Observable<Album[]> {
    return this.afs.collection(`albums`,
      ref => ref
        .orderBy('createdAt', 'asc')
        .limit(pageSize)
        .startAfter(pageNumber * pageSize))
      .snapshotChanges()
      .pipe(
        map(snaps => this.utilityService.convertSnaps<Album>(snaps))
      );
  }

  getLatestAlbum(): Observable<Album> {
    return this.afs.collection('albums', ref =>
      ref
        .orderBy('createdAt', 'asc')
        .limit(1))
      .snapshotChanges()
      .pipe(
        map(snaps => this.utilityService.convertSnaps<Album>(snaps))
      );
  }
}
