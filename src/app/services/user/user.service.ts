import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { User } from 'src/app/models/User';
import { map, take } from 'rxjs/operators';
import { ToastService } from '../toast/toast.service';
import { InitialCard } from 'src/app/models/usersalbums';
import { UsersalbumsService } from '../usersalbums.service';
import * as firebase from 'firebase/app';
import { Album } from 'src/app/models/album';
import { timingSafeEqual } from 'crypto';
import { DateFloatingFilterComp } from 'ag-grid-community/dist/lib/filter/floatingFilter';
import { Bean } from 'ag-grid-community';
import { userInfo } from 'os';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userDoc: AngularFirestoreDocument<User>;
  users: AngularFirestoreCollection<User>;

  constructor(
    private afs: AngularFirestore,
    private toast: ToastService,
    private usersalbumsService: UsersalbumsService
  ) { }

  createUser(user: User, uid: string) {
    this.userDoc = this.afs.doc<User>(`users/${uid}`);
    return this.userDoc.set(user);
  }

  getAllUsers() {
    this.users = this.afs.collection<User>('users');
    return this.users.snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
  }

  updateUser(user) {
    return this.afs
      .collection('users')
      .doc(user.uid)
      .update({ role: user.role })
      .then(() =>
        this.toast.newToast({ content: 'User is updated!', style: 'success' })
      )
      .catch(err =>
        this.toast.newToast({ content: `Error ${err}`, style: 'warning' })
      );
  }

  updateEmailVerification(uid) {
    return this.afs
      .collection('users')
      .doc(uid)
      .update({ mail_verified: true });
  }

  // addAlbumToUserUid(album, order) {
  //   this.getUserFromUid(localStorage.getItem('user_uid'))
  //     .subscribe((user: User) => this.addAlbumForUser(user, album, order));
  //   // this.afs.collection(url).add(userAlbum);
  // }


  subscribeUserToAlbum(album) {
    const userUid = localStorage.getItem('user_uid');
    this.afs.firestore.runTransaction(async transaction => {

      const userRef = this.afs.doc(`users/${userUid}`).ref;
      const snap = await transaction.get(userRef);

      const user = <User>snap.data();
      // tslint:disable-next-line:forin
      for (const key in user.albums) {
        if (user.albums[key].uid === album.albumUid) {
          this.toast.newToast({
            content: 'You already are subscribed to this album!',
            style: 'warning',
          });
          transaction.update(userRef, {});
          return;
        }
        if (!user.albums[key].uid) {
          user.albums[key].uid = album.albumUid;
          user.albums[key].createdAt = firebase.firestore.FieldValue.serverTimestamp();
          user.questionsTimeFirstAlbum = Date.now();
          transaction.set(userRef, user);
          return;
        }
      }

    });
  }

  updateUserAlbumsSubscripton(user, album: Album, order: number): void {
    // tslint:disable-next-line:forin
    for (const key in user.albums) {
      if (user.albums[key].uid === album.albumUid) {
        this.toast.newToast({
          content: 'You already are subscribed to this album!',
          style: 'warning',
        });
        return null;
      }
    }
    switch (order) {
      case 1:
        if (!user.albums.one.uid) {
          user.albums.one.uid = album.albumUid;
          user.albums.one.createdAt = firebase.firestore.FieldValue.serverTimestamp();
          user.questionsTimeFirstAlbum = Date.now();
        }
        break;
      case 2:
        if (!user.albums.two.uid) {
          user.albums.two.uid = album.albumUid;
          user.albums.two.createdAt = firebase.firestore.FieldValue.serverTimestamp();
          user.questionsTimeSecondAlbum = Date.now();
        }
        break;
      case 3:
        if (!user.albums.three.uid) {
          user.albums.three.uid = album.albumUid;
          user.albums.three.createdAt = firebase.firestore.FieldValue.serverTimestamp();
          user.questionsTimeThirdAlbum = Date.now();
        }
        break;
    }
    this.toast.newToast({
      content: 'You successfuly subscribed to this album!',
      style: 'success',
    });
    // this.updateOnlyUser(user);
    return user;
  }

  questionTimeUpdate(order) {
    switch (order) {
      case 1:
        localStorage.setItem('questionTimeFirstAlbum', Date.now().toString());
        return this.afs
          .collection('users')
          .doc(localStorage.getItem('user_uid'))
          .update({ questionTimeFirstAlbum: Date.now() });

      case 2:
        localStorage.setItem('questionTimeSecondAlbum', Date.now().toString());
        return this.afs
          .collection('users')
          .doc(localStorage.getItem('user_uid'))
          .update({ questionTimeSecondAlbum: Date.now() });

      case 3:
        localStorage.setItem('questionTimeThirdAlbum', Date.now().toString());
        return this.afs
          .collection('users')
          .doc(localStorage.getItem('user_uid'))
          .update({ questionTimeThirdAlbum: Date.now() });
    }

  }

  getQuestionTime() {
    return localStorage.getItem('question_time');
  }

  getUserFromUid(userUid) {
    return this.afs.doc<User>(`users/${userUid}`).valueChanges().pipe(take(1));
  }

  updateOnlyUser(user) {
    return this.afs
      .collection('users')
      .doc(user.uid)
      .update(user);
  }
}
