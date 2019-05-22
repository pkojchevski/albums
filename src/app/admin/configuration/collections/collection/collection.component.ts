import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Collection, InitialCollection} from 'src/app/models/collections';
import {CollectionService} from 'src/app/services/collection.service';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss'],
})
export class CollectionComponent implements OnInit {
  collections$: Observable<Collection[]>;
  collection: Collection = InitialCollection;

  constructor(private collectionService: CollectionService) {}

  ngOnInit() {}

  addCollection(event) {
    this.collectionService.addCollection(this.collection);
  }
}
