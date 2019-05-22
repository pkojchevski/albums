import {Component, OnInit} from '@angular/core';
import {LocalStorageService} from '../../services/localStorage/local-storage.service';
import {ModalService} from '../../services/modal.service';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth/auth.service';
import {UserService} from 'src/app/services/user/user.service';
import {User} from 'src/app/models/User';
import {ToastService} from 'src/app/services/toast/toast.service';
import {FirebaseErrorsService} from 'src/app/services/firebase-errors.service';
import {NgForm} from '@angular/forms';
import {GroupService} from 'src/app/services/group/group.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  user = {
    email: '',
    remember: false,
    password: '',
  };
  newUser = {
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    agreed: false,
  };
  constructor(
    private localStr: LocalStorageService,
    private modalService: ModalService,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private toast: ToastService,
    private firebaseErrors: FirebaseErrorsService,
    private groupService: GroupService
  ) {}

  ngOnInit() {}

  signIn(form: NgForm) {
    this.authService
      .loginWithEmail(this.user)
      .then(auth => {
        if (auth) {
          if (auth.user.emailVerified) {
            this.userService.updateEmailVerification(auth.user.uid);
            this.localStr.setStorage('user_name', auth.user.displayName);
            this.localStr.setStorage('user_email', auth.user.email);
            this.localStr.setStorage('user_uid', auth.user.uid);
            this.router.navigateByUrl('/albums').then(() => {
              this.modalService.closeModal();
              this.checkInvitations(auth.user.email);
            });
          } else {
            // alert(
            //   `User with email ${
            //     this.user.email
            //   } doesn't verified, please follow instructions form registration letter`
            // );
            this.toast.newToast({
              content: `User with email ${
                this.user.email
              } is not verified, please follow instructions form registration letter`,
              style: 'warning',
            });
            form.reset();
          }
        }
      })
      .catch(err => {
        this.firebaseErrors.getError(err);
        form.reset();
      });
  }

  checkInvitations(email) {
    this.groupService
      .checkIfEmailExists(email)
      .subscribe(user => console.log(user));
  }

  // signIn() {
  //   this.authService.signIn(this.user).subscribe(
  //     (user: any) => {
  //       if (user) {
  //         this.authService
  //           .getUserName(user.userId, user.id)
  //           .subscribe(userInfo => {
  //             if (userInfo.emailVerified) {
  //               this.localStr.setStorage('user_name', userInfo.user_first_name);
  //               this.localStr.setStorage('user', JSON.stringify(userInfo));
  //               this.router.navigateByUrl('albums').then(() => {
  //                 this.modalService.closeModal();
  //               });
  //             } else {
  //               alert(
  //                 `User with email ${
  //                   this.user.user_email
  //                 } doesn't verified, please follow instructions form registration letter`
  //               );
  //             }
  //           });
  //       }
  //     },
  //     err => {
  //       alert('There is no user with email:' + this.user.user_email);
  //     }
  //   );
  // }

  signUp() {
    this.authService
      .registerWithEmail(this.newUser)
      .then(auth => {
        auth.user
          .updateProfile({
            displayName: this.newUser.first_name,
            photoURL: '',
          })
          .catch(err =>
            this.toast.newToast({
              content: 'Error during registering user:' + err,
              style: 'warning',
            })
          );
        const profile: User = {
          uid: auth.user.uid,
          email: auth.user.email,
          photoURL: auth.user.photoURL,
          displayName: this.newUser.first_name,
          role: 'user',
          first_name: this.newUser.first_name,
          last_name: this.newUser.last_name,
          mail_verified: auth.user.emailVerified,
        };
        this.userService
          .createUser(profile, auth.user.uid)
          .then(() => {
            auth.user
              .sendEmailVerification()
              .then(res =>
                this.toast.newToast({
                  content: 'Email is sent',
                  style: 'success',
                })
              )
              .catch(err =>
                this.toast.newToast({
                  content: 'Error during sending mail:' + err,
                  style: 'warning',
                })
              );
            this.router.navigateByUrl('registration-success').then(() => {
              this.modalService.closeModal();
            });
          })
          .catch(err =>
            this.toast.newToast({
              content: 'Error during registering user:' + err,
              style: 'warning',
            })
          );
      })
      .catch(err => {
        this.firebaseErrors.getError(err);
      });
  }

  // signUp() {
  //   this.authService.signUp(this.newUser).subscribe((userEmail: any) => {
  //     if (userEmail) {
  //       this.localStr.setStorage('user_email', userEmail.response);
  //       this.router.navigateByUrl('registration-success').then(() => {
  //         this.modalService.closeModal();
  //       });
  //     }
  //   });
  // }
}
