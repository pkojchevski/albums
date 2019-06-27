import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/User';
import { GroupService } from 'src/app/services/group/group.service';
import { Group } from 'src/app/models/group';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserService } from 'src/app/services/user/user.service';
import { DataService } from 'src/app/services/data/data.service';
import { AlbumService } from 'src/app/services/album/album.service';
import { Album } from 'src/app/models/album';
import { Router } from '@angular/router';

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.scss'],
})
export class AlbumsComponent implements OnInit {
  email: string;
  user$: Observable<User>;
  albums;
  nrOfCromos: number;
  isSubscribedAlbum: boolean;

  constructor(
    private groupService: GroupService,
    private userService: UserService,
    private dataService: DataService,
    private modalService: ModalService,
    private albumService: AlbumService,
    private toast: ToastService,
    private router: Router
  ) { }

  ngOnInit() {
    this.email = localStorage.getItem('user_email');
    this.userService
      .getUserFromUid(localStorage.getItem('user_uid'))
      .subscribe(user => {
        if (user) {
          // tslint:disable-next-line:forin
          for (const key in user.albums) {
            if (user.albums[key].createdAt) {
              user.albums[key].remain =
                90 -
                Math.round(
                  (new Date().getTime() -
                    user.albums[key].createdAt.toDate().getTime()) /
                  (1000 * 3600 * 24)
                );
            }
          }
          this.albums = user.albums;
        }
      });
  }

  checkInvitations(email) {
    this.groupService.checkIfEmailExists(email).subscribe(groups =>
      groups.forEach((group: Group) => {
        const alert = confirm(
          `You have invitations for group ${
          group.name
          }. Do You accept invitation?`
        );
        if (alert === true) {
          this.groupService.updateStatus(group.groupUid, email, 'accepted');
        } else {
          this.groupService.updateStatus(group.groupUid, email, 'canceled');
        }
      })
    );
  }

  openModal(modalType, albumNumber, order) {
    if (!albumNumber.uid) {
      this.toast.newToast({
        content: 'Please subscribe to an album',
        style: 'warning',
      });
      return;
    }
    this.dataService.changeObject({ 'isSubscribedAlbum': true, order });
    if (!this.questionTime(order)) {
      this.toast.newToast({
        content: 'Next Questions will be avaliable tomorrow.',
        style: 'info',
      });
      this.albumService
        .getAlbumFromUid(albumNumber.uid)
        .subscribe((album: Album) => {
          this.dataService.changeAlbum(album);
          this.router.navigateByUrl(`album/${albumNumber.uid}`);
          // this.albumService
          //   .getAlbumFromUid(albumNumber.uid)
          //   .subscribe((album: Album) => {
          //     this.dataService.changeAlbum(album);
          //     this.router.navigateByUrl(`album / ${ album.albumUid }`);
        });
    } else {
      this.albumService
        .getAlbumFromUid(albumNumber.uid)
        .subscribe((album: Album) => {
          this.dataService.changeAlbum(album);
          this.router.navigate([`album / ${albumNumber.uid}`]);
          this.userService.questionTimeUpdate(order);
          this.modalService.modalShow({
            modalShow: true,
            modalContent: { modalType: modalType }
          });
        });
    }
  }

  questionTime(order): boolean {
    // const oneDay = 24 * 60 * 60 * 1000;
    const twoDays = 48 * 60 * 60 * 1000;
    switch (order) {
      case 1:
        return (
          Date.now() - +localStorage.getItem('questionTimeFirstAlbum') > twoDays
        );
      case 2:
        return (
          Date.now() - +localStorage.getItem('questionTimeSecondAlbum') > twoDays
        );
      case 3:
        return (
          Date.now() - +localStorage.getItem('questionsTimeThirdAlbum') > twoDays
        );
    }
  }

  openModalGroup(modalType) {
    this.modalService.modalShow({
      modalShow: true,
      modalContent: { modalType: modalType },
    });
  }
}
