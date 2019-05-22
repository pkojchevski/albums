import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {ModalService} from '../../services/modal.service';
import {LocalStorageService} from '../../services/localStorage/local-storage.service';
import {AuthService} from 'src/app/services/auth/auth.service';
import {Observable} from 'rxjs';
import {User} from '../../models/User';

@Component({
  selector: 'app-site-header',
  templateUrl: './site-header.component.html',
  styleUrls: ['./site-header.component.scss'],
})
export class SiteHeaderComponent implements OnInit {
  user_name;
  isAuth = false;
  user$: Observable<firebase.User>;
  auth$;
  constructor(
    public router: Router,
    private modalService: ModalService,
    private localSt: LocalStorageService,
    private authService: AuthService
  ) {
    // this.localSt.user_name_changed.subscribe(user_name => {
    //   this.user_name = user_name;
    //   this.isAuth = true;
    // });
    this.getUserName();
    this.user$ = this.authService.user$;
    this.user$.subscribe(user => console.log(!user));
  }

  ngOnInit() {}

  // getUserName() {
  //   this.user_name = this.localSt.getStorage('user_first_name');
  //   if (this.user_name) {
  //     this.isLogened = true;
  //   }
  // }

  getUserName() {
    this.localSt.getStorage('user_name').subscribe(user_name => {
      if (user_name) {
        this.user_name = user_name;
        this.isAuth = true;
      }
    });
  }

  navigateTo() {
    if (this.isAuth) {
      this.router.navigateByUrl('/albums');
    } else {
      this.router.navigateByUrl('/finish-egistration');
    }
  }

  openAuthModal() {
    this.modalService.modalShow({
      modalShow: true,
      modalContent: {modalType: 'auth'},
    });
  }

  signOut() {
    this.authService.signOut().then(() => {
      this.router.navigateByUrl('');
      this.localSt.setStorage('user_name', '');
      this.localSt.setStorage('user_uid', '');
      this.localSt.setStorage('user_email', '');
    });
  }
}

interface MenuLink {
  title: string;
  link: string;
  active: boolean;
}
