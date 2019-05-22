import {Component, OnInit} from '@angular/core';
import {ModalService} from '../../services/modal.service';
import {Router} from '@angular/router';
import {InitialGroup} from 'src/app/models/group';
import {GroupService} from 'src/app/services/group/group.service';
import {Observable} from 'rxjs';
import {AuthService} from 'src/app/services/auth/auth.service';
import {LocalStorageService} from 'src/app/services/localStorage/local-storage.service';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss'],
})
export class CreateGroupComponent implements OnInit {
  groupSettings = InitialGroup;
  newUser: string;
  currentStep = 0;
  totalSteps = 2;
  newUsers = [];
  userUid;
  user$: Observable<firebase.User>;

  constructor(
    protected modalService: ModalService,
    private router: Router,
    private groupService: GroupService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // this.authService.user$.subscribe(user => (this.userUid = user.uid));
    this.userUid = localStorage.getItem('user_uid');
  }

  formNextStep() {
    if (this.currentStep + 1 < this.totalSteps) {
      this.currentStep++;
    } else {
      this.groupSettings.userUid = this.userUid;
      this.groupService.createGroup(this.groupSettings).then(() => {
        this.groupSettings = InitialGroup;
        this.router
          .navigateByUrl('/albums')
          .then(() => this.modalService.closeModal());
      });
    }
  }

  addUser() {
    if (this.newUser) {
      this.newUsers.push({user_email: this.newUser, user_status: 'pending'});
      this.newUser = '';
      this.groupSettings.users = this.newUsers;
    }
  }

  deleteUser(user) {
    this.newUsers.splice(this.newUsers.indexOf(user), 1);
    this.groupSettings.users = this.newUsers;
  }

  closeModal() {
    this.modalService.closeModal();
  }

  formPrevStep() {
    this.currentStep--;
  }
}
