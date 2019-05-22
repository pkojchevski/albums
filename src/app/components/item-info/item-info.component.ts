import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-item-info',
  templateUrl: './item-info.component.html',
  styleUrls: ['./item-info.component.scss'],
})
export class ItemInfoComponent implements OnInit {
  closed = true;
  @Input() joined: boolean;
  @Input() private: boolean;

  constructor() {}

  ngOnInit() {}

}
