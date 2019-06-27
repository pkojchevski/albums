import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, EMPTY } from 'rxjs';
import { expand, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {

  constructor(private afs: AngularFirestore) { }

  getDocumentRandomlyParent(collection: string, rnd: string): Observable<any> {
    return this.getDocumentRandomlyChild(collection, rnd)
      .pipe(
        expand((document: any) => document === null ? this.getDocumentRandomlyChild(collection, rnd) : EMPTY),
      );
  }

  getDocumentRandomlyChild(collection: string, rnd: string): Observable<any> {
    const random = this.afs.createId();
    return this.afs
      .collection(collection, ref =>
        ref
          .where(rnd, '>', random)
          .limit(1))
      .valueChanges()
      .pipe(
        map((documentArray: any[]) => {
          if (documentArray && documentArray.length) {
            return documentArray[0];
          } else {
            return null;
          }
        }),
      );
  }

  getRndNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  getRandom(arr, n) {
    const result = new Array(n);
    let len = arr.length;
    const taken = new Array(len);
    while (n--) {
      const x = Math.floor(Math.random() * len);
      result[n] = arr[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
  }

  shuffle(array) {
    let currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  convertSnaps<T>(snaps) {
    return snaps.map(snap => {
    return <T>{
      id: snap.payload.doc.id,
      ...snap.payload.doc.data()
    };
  });
  }

getDuplicates(arr) {
  const fArr = [];
  // tslint:disable-next-line:forinSSS
  for (const el of arr) {
    if (el['quantity'] > 1) {
      for (let i = 0; i <= el['quantity'] - 1; i++) {
        fArr.push(el);
      }
    }
  }
  return fArr;
}
}
