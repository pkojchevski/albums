import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import { scan, tap, take } from 'rxjs/operators';

import { QueryConfig } from '../models/query-config';


@Injectable({
  providedIn: 'root'
})
export class PaginationService {

  // sources
  private _done = new BehaviorSubject(false);
  private _loading = new BehaviorSubject(false);
  private _data = new BehaviorSubject([]);

  private query: QueryConfig;

  // Observable data
  data: Observable<any>;
  done: Observable<boolean> = this._done.asObservable();
  loading: Observable<boolean> = this._loading.asObservable();

  constructor(private afs: AngularFirestore) { }


  init(path: string, field: string, opts?: any) {
    this.query = {
      path,
      field,
      limit: 8,
      reverse: false,
      prepend: false,
      ...opts
    };
    const first = this.afs.collection(this.query.path, ref =>
      ref
        .orderBy(this.query.field, this.query.reverse ? 'desc' : 'asc')
        .limit(this.query.limit)
    );

    this.mapAndUpdate(first);

    // Create observable array for consumption in component
    this.data = this._data.asObservable().pipe(scan((acc, val) => this.query.prepend ? val.concat(acc) : acc.concat(val)));
  }

  // Retrieves additional data from firestore
  more() {
    const cursor = this.getCursor();

    const more = this.afs.collection(this.query.path, ref =>
      ref.
        orderBy(this.query.field, this.query.reverse ? 'desc' : 'asc')
        .limit(this.query.limit)
        .startAfter(cursor)
    );
    this.mapAndUpdate(more);
  }

  getCursor() {
    console.log('_data:', this._data);
    const current = this._data.value;
    if (current.length) {
      return this.query.prepend ? current[0].doc : current[current.length - 1].doc;
    }
    return null;
  }




  // Maps the snapshot to usable format the updates source
  private mapAndUpdate(col: AngularFirestoreCollection<any>) {
    let values;
    // tslint:disable-next-line:curly
    if (this._done.value || this._loading.value) return;

    // loading
    this._loading.next(true);

    // Map snapshot with doc ref (needed for cursor)
    return col.snapshotChanges()
      .pipe(tap((arr: Array<any>) => {
        values = arr.map(snap => {
          const data = snap.payload.doc.data();
          const doc = snap.payload.doc;
          return { ...data, doc };
        });

        // If prepending, reverse the batch order
        values = this.query.prepend ? values.reverse() : values;

        // update source with new values, done loading
        this._data.next(values);
        this._loading.next(false);

        // no more values, mark done
        if (!values.length) {
          this._done.next(true);
        }
      })
        , take(1))
      .subscribe();

  }



}
