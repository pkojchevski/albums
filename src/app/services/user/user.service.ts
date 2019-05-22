import {Injectable} from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import {User} from 'src/app/models/User';
import {map, take} from 'rxjs/operators';
import {ToastService} from '../toast/toast.service';
import {InitialCard} from 'src/app/models/usersalbums';
import {UsersalbumsService} from '../usersalbums.service';
import * as firebase from 'firebase/app';
import {Album} from 'src/app/models/album';
import {timingSafeEqual} from 'crypto';
import { DateFloatingFilterComp } from 'ag-grid-community/dist/lib/filter/floatingFilter';

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
  ) {}

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
          return {id, ...data};
        })
      )
    );
  }

  updateUser(user) {
    return this.afs
      .collection('users')
      .doc(user.uid)
      .update({role: user.role})
      .then(() =>
        this.toast.newToast({content: 'User is updated!', style: 'success'})
      )
      .catch(err =>
        this.toast.newToast({content: `Error ${err}`, style: 'warning'})
      );
  }

  updateEmailVerification(uid) {
    return this.afs
      .collection('users')
      .doc(uid)
      .update({mail_verified: true});
  }

  addAlbumUid(album) {
    this.getUser(localStorage.getItem('user_uid'))
      .pipe(take(1))
      .subscribe((user: User) => this.addAlbumForUser(user, album));
  }

  addAlbumForUser(user, album: Album): void {
    let first,
      second,
      third = false;
    // tslint:disable-next-line:forin
    for (const key in user.albums) {
      if (user.albums[key].uid === album.albumUid) {
        this.toast.newToast({
          content: 'You already are subscribed to this album, beginning!',
          style: 'warning',
        });
        return;
      }
    }

    if (!user.albums.one.uid) {
      user.albums.one.uid = album.albumUid;
      user.albums.one.createdAt = firebase.firestore.FieldValue.serverTimestamp();
      user.questionsTimeFirstAlbum = Date.now();
      this.usersalbumsService.addUsersAlbums({
        userUid: user.uid,
        albumUid: album.albumUid,
        nrOfAlbumForUser: 1,
        cards: Array.apply(null, Array(album.nrOfCards)).map(() => InitialCard),
        uid: '',
      });
      first = true;
      this.toast.newToast({
        content: 'You successfuly subscribed this album one!',
        style: 'success',
      });
      this.updateOnlyUser(user);
      return;
    } else if (!user.albums.two.uid && !first) {
      user.albums.two.uid = album.albumUid;
      user.albums.two.createdAt = firebase.firestore.FieldValue.serverTimestamp();
      user.questionsTimeSecondAlbum = Date.now();
      this.usersalbumsService.addUsersAlbums({
        userUid: user.uid,
        albumUid: album.albumUid,
        nrOfAlbumForUser: 2,
        cards: Array.apply(null, Array(album.nrOfCards)).map(() => InitialCard),
        uid: '',
      });
      second = true;
      this.toast.newToast({
        content: 'You successfuly subscribed this album two!',
        style: 'success',
      });
      this.updateOnlyUser(user);
      return;
    } else if (!user.albums.three.uid && !first && !second) {
      user.albums.three.uid = album.albumUid;
      user.albums.three.createdAt = firebase.firestore.FieldValue.serverTimestamp();
      user.questionsTimeThirdAlbum = Date.now();
      this.usersalbumsService.addUsersAlbums({
        userUid: user.uid,
        albumUid: album.albumUid,
        nrOfAlbumForUser: 1,
        cards: Array.apply(null, Array(album.nrOfCards)).map(() => InitialCard),
        uid: '',
      });
      third = true;
      this.toast.newToast({
        content: 'You successfuly subscribed this album, three!',
        style: 'success',
      });
      this.updateOnlyUser(user);
      return;
    }
    if (first && second && third) {
      console.log('not here');
      this.toast.newToast({
        content: 'You already subscribed for 3 albums!',
        style: 'warning',
      });
      first = false;
      second = false;
      third = false;
      return;
    }
  }

  questionTimeUpdate(order) {
    switch (order) {
      case 1:
      localStorage.setItem('questionTimeFirstAlbum', Date.now().toString());
      return this.afs
      .collection('users')
      .doc(localStorage.getItem('user_uid'))
      .update({questionTimeFirstAlbum: Date.now()});

      case 2:
      localStorage.setItem('questionTimeSecondAlbum', Date.now().toString());
      return this.afs
      .collection('users')
      .doc(localStorage.getItem('user_uid'))
      .update({questionTimeSecondAlbum: Date.now()});

      case 3:
      localStorage.setItem('questionTimeThirdAlbum', Date.now().toString());
      return this.afs
      .collection('users')
      .doc(localStorage.getItem('user_uid'))
      .update({questionTimeThirdAlbum: Date.now()});
    }

  }

  getQuestionTime() {
    return localStorage.getItem('question_time');
  }

  getUser(userUid) {
    return this.afs.doc<User>('users/' + userUid).valueChanges();
  }

  updateOnlyUser(user) {
    return this.afs
      .collection('users')
      .doc(user.uid)
      .update(user);
  }
}
