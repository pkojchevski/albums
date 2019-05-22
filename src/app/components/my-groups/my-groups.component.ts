import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Group} from 'src/app/models/group';
import {GroupService} from 'src/app/services/group/group.service';
import {AngularFirestoreCollection} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-my-groups',
  templateUrl: './my-groups.component.html',
  styleUrls: ['./my-groups.component.scss'],
})
export class MyGroupsComponent implements OnInit {
  groups$: Observable<Group[]>;
  selected: Array<boolean>;
  nrOfGroups: number;
  joined = false;

  constructor(private groupService: GroupService) {}

  ngOnInit() {
    // this.groups$ = this.groupService.getGroupsForUser();

    this.groups$ = this.groupService.getMyGroups();

    this.groups$.subscribe(group => (this.selected = group.map(arr => false)));
  }

  confirm() {}

  selectedGroup(group, index) {
    this.selected = this.selected.map(item => false);
    this.selected[index] = true;

    this.joined = this.groupService.containsUser(
      'petarkojchevski24@gmail.com',
      group
    );
  }
}
