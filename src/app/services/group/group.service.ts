import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Group} from 'src/app/models/group';
import {ToastService} from '../toast/toast.service';
import {map} from 'rxjs/operators';
import {getMaxListeners} from 'cluster';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  constructor(private afsdb: AngularFirestore, private toast: ToastService) {}

  createGroup(group: Group) {
    console.log('group:', group);
    group.groupUid = this.afsdb.createId();
    return this.afsdb
      .collection<Group[]>('groups')
      .doc(group.groupUid)
      .set(group)
      .then(() =>
        this.toast.newToast({content: 'Group is created', style: 'success'})
      )
      .catch(err =>
        this.toast.newToast({content: `Error ${err}`, style: 'warning'})
      );
  }

  checkIfEmailExists(email) {
    const user = {user_email: email, user_status: 'pending'};
    return this.afsdb
      .collection('groups', ref => ref.where('users', 'array-contains', user))
      .valueChanges();
  }

  updateStatus(uid, email, status) {
    return this.afsdb
      .collection('groups', ref => ref.where('groupUid', '==', uid))
      .valueChanges()
      .pipe(
        map((group: Group) => {
          group[0].users.forEach(user => {
            // tslint:disable-next-line:curly
            if (user.user_email === email) {
              user.user_status = status;
              this.updateGroup(group[0]);
            }
          });
        })
      )
      .toPromise()
      .then(() =>
        this.toast.newToast({
          content: 'Invitation accepted',
          style: 'success',
        })
      )
      .catch(err =>
        this.toast.newToast({content: `Error ${err}`, style: 'warning'})
      );
  }

  updateGroup(group: Group) {
    this.afsdb
      .collection('groups')
      .doc(group.groupUid)
      .update(group)
      .then(() =>
        this.toast.newToast({
          content: 'Collection is updated',
          style: 'success',
        })
      )
      .catch(err =>
        this.toast.newToast({content: `Error:${err}`, style: 'warning'})
      );
  }

  getGroupsForUser() {
    const user = {
      user_email: 'petarkojchevski24@gmail.com',
      user_status: 'accepted',
    };

    return this.afsdb
      .collection<Group>('groups', ref =>
        ref.where('users', 'array-contains', user)
      )
      .valueChanges();
  }

  getMyGroups() {
    return this.afsdb.collection<Group>('groups', ref =>
      ref.where('userUid', '==', localStorage.getItem('user_uid'))
    ).valueChanges();
  }

  containsUser(email, group: Group): boolean {
    for (let i = 0; i < group.users.length; i++) {
      if (group.users[i].user_email === email) {
        return true;
      }
    }
    return false;
  }
}
