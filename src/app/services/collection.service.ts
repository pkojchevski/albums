import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastService } from './toast/toast.service';
import { Collection } from '../models/collections';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {

  constructor(private afsdb: AngularFirestore, private toast: ToastService) {}

  getAllCollections() {
    return this.afsdb.collection<Collection>('collections').valueChanges();
  }

  addCollection(collection) {
    collection.collectionUid = this.afsdb.createId();
    return this.afsdb
      .collection<Collection>('collections')
      .doc(collection.collectionUid)
      .set(collection)
      .then(() =>
        this.toast.newToast({content: 'Collection is updated', style: 'success'})
      )
      .catch(err =>
        this.toast.newToast({content: `Error:${err}`, style: 'warning'})
      );
  }

  updateCollection(collection) {
    return this.afsdb
      .collection('collections')
      .doc(collection.collectionUid)
      .update(collection)
      .then(() =>
        this.toast.newToast({content: 'Collection is updated', style: 'success'})
      )
      .catch(err =>
        this.toast.newToast({content: `Error:${err}`, style: 'warning'})
      );
  }

  deleteCollection(uid) {
    return this.afsdb
      .collection('collections')
      .doc(uid)
      .delete()
      .then(() =>
        this.toast.newToast({content: 'Collection is deleted', style: 'success'})
      )
      .catch(err =>
        this.toast.newToast({content: `Error:${err}`, style: 'warning'})
      );
  }
}
