import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-carousel-chckbox',
  templateUrl: './carousel-chckbox.component.html',
  styleUrls: ['./carousel-chckbox.component.scss']
})
export class CarouselChckboxComponent implements OnInit {
  myDuplicates;
  user;
  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.myDuplicates = this.dataService.changeArr4;
    this.user = this.dataService.currentObject;
  }

}
