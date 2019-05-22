import {Injectable} from '@angular/core';
import {Subject, BehaviorSubject, Observable, of} from 'rxjs';
import {Album, initialAlbum} from 'src/app/models/album';
import {Image, initialImage} from 'src/app/models/image';
import {AlbumCards, InitialAlbumCard} from 'src/app/models/albumcards';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor() {}

  // album object
  private albumSource = new BehaviorSubject<Album>(initialAlbum);
  currentAlbum = this.albumSource.asObservable();

  // array any
  private arrSource1 = new BehaviorSubject<any[]>([]);
  currentArr1 = this.arrSource1.asObservable();

  // array any
  private arrSource2 = new BehaviorSubject<any[]>([]);
  currentArr2 = this.arrSource2.asObservable();

  // array any
  private arrSource3 = new BehaviorSubject<any[]>([]);
  currentArr3 = this.arrSource3.asObservable();

  // array any
  private arrSource4 = new BehaviorSubject<any[]>([]);
  currentArr4 = this.arrSource4.asObservable();

  // uid
  private uidSource = new BehaviorSubject<string>('');
  currentUid = this.uidSource.asObservable();

  // number
  private numberSource = new BehaviorSubject<number>(0);
  currentNumber = this.numberSource.asObservable();

  // array of albums
  private albumsSource = new BehaviorSubject<Album[]>(null);
  currentAlbums = this.albumsSource.asObservable();

  private imageSource = new BehaviorSubject<Image[]>([initialImage]);
  currentImages = this.imageSource.asObservable();

  private albumCardsSource = new BehaviorSubject<AlbumCards[]>([
    InitialAlbumCard,
  ]);
  currentAlbumCard = this.albumCardsSource.asObservable();

  private source = new BehaviorSubject<any>({});
  currentObject = this.source.asObservable();

  changeObject(obj: any) {
    return this.source.next(obj);
  }

  changeAlbumCards(albumcards: AlbumCards[]) {
    return this.albumCardsSource.next(albumcards);
  }

  changeAlbum(album: Album) {
    return this.albumSource.next(album);
  }

  changeAlbums(albums: Album[]) {
    return this.albumsSource.next(albums);
  }

  changeImage(images: Image[]) {
    return this.imageSource.next(images);
  }

  changedUid(uid: string) {
    return this.uidSource.next(uid);
  }

  changeArr1(arr) {
    return this.arrSource1.next(arr);
  }

  changeArr2(arr) {
    return this.arrSource2.next(arr);
  }

  changeArr3(arr) {
    return this.arrSource3.next(arr);
  }

  changeArr4(arr) {
    return this.arrSource4.next(arr);
  }

  changeNumber(number) {
    return this.numberSource.next(number);
  }
}
