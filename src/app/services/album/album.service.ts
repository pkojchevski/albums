import {Injectable} from '@angular/core';
import {
  AngularFirestoreDocument,
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import {Album} from '../../models/album';
import {map, expand} from 'rxjs/operators';
import {Image} from 'src/app/models/image';
import {ToastService} from '../toast/toast.service';
import {AlbumcardsService} from '../albumcards/albumcards.service';
import { Observable, EMPTY } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlbumService {
  albumRef: AngularFirestoreCollection<Album>;
  constructor(
    private afs: AngularFirestore,
    private toast: ToastService,
    private albumcards: AlbumcardsService
  ) {}

  addNewAlbum(album: Album) {
    album.albumUid = this.afs.createId();
    this.albumRef = this.afs.collection<Album>('albums');
    return this.albumRef.doc(album.albumUid).set(album);
  }

  updateAlbum(album) {
    this.afs
      .collection<Album>('albums')
      .doc(album.albumUid)
      .update(album);
  }

  addImageToAlbum(albumUid: string, image: Image) {
    return this.afs
      .doc<Album>(`albums/${albumUid}`)
      .get()
      .forEach(doc => {
        const nrOfCards: number = Number(doc.data().nrOfCards) + 1;
        this.afs
          .doc<Album>(`albums/${albumUid}`)
          .update({nrOfCards})
          .then(() => {
            const newId = this.afs.createId();
            return this.afs
              .collection('albumcards')
              .doc(newId)
              .set({
                albumUid,
                image,
                nrOfCard: nrOfCards,
                albumcardUid: newId,
              });
          })
          .then(() =>
            this.toast.newToast({content: 'Image is added', style: 'success'})
          )
          .catch(err =>
            this.toast.newToast({content: 'Err:' + err, style: 'warning'})
          );
      });
  }
  removeImageFromAlbum(albumUid, albumcardsUid) {
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
          .update({nrOfCards})
          .then(() => {
            return this.afs
              .collection('albumcards')
              .doc(albumcardsUid)
              .delete();
          })
          .then(() =>
            this.toast.newToast({
              content: 'Image is removed from album',
              style: 'success',
            })
          )
          .catch(err =>
            this.toast.newToast({content: 'Err:' + err, style: 'warning'})
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
    return this.afs.doc(`albums/${uid}`).valueChanges();
  }

  albumIncrementNrOfCards(uid) {
    const album_ref = this.afs.collection('albums').doc(uid);
    // Update count in a transaction
    return this.afs.firestore.runTransaction(t => {
      return t.get(album_ref[0]).then(doc => {
        const new_nrOfCards = doc.data().nrOfCards + 1;
        t.update(album_ref[0], {nrOfCards: new_nrOfCards});
      });
    });
  }

  albumDecreaseNrOfCards(uid) {
    const album_ref = this.afs.collection('shards').doc(uid);
    // Update count in a transaction
    return this.afs.firestore.runTransaction(t => {
      return t.get(album_ref[0]).then(doc => {
        const new_nrOfCards = doc.data().nrOfCards - 1;
        t.update(album_ref[0], {nrOfCards: new_nrOfCards});
      });
    });
  }

  getImagesFromAlbum(uid) {
    const album_ref = this.afs.collection('albums').doc(uid);
    // Update count in a transaction
    return this.afs.firestore.runTransaction(t => {
      return t.get(album_ref[0]).then(doc => {
        const new_nrOfCards = doc.data().nrOfCards - 1;
        t.update(album_ref[0], {nrOfCards: new_nrOfCards});
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
}
