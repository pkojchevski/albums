import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import { UserService } from 'src/app/services/user/user.service';
import { DataService } from 'src/app/services/data/data.service';
import { Album } from 'src/app/models/album';
import { Subscription } from 'rxjs';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-album-subscription',
  templateUrl: './album-subscription.component.html',
  styleUrls: ['./album-subscription.component.scss'],
})
export class AlbumSubscriptionComponent implements OnInit, OnDestroy {
  order: number;
  constructor(
    private modalService: ModalService,
    private userService: UserService,
    private dataService: DataService,
  ) { }

  ngOnInit() {
    this.dataService.currentObject.subscribe(obj => this.order = obj.order);
  }

  closeModal() {
    this.modalService.closeModal();
  }

  subscribeToAlbum() {
    this.dataService.currentAlbum
      .pipe(untilComponentDestroyed(this), first())
      .subscribe(album => {
        console.log('album:', album);
        this.userService.subscribeUserToAlbum(album);
        this.closeModal();
      });
  }

  ngOnDestroy() { }
}
