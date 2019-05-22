import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data/data.service';
import { take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-cards-exchange',
  templateUrl: './cards-exchange.component.html',
  styleUrls: ['./cards-exchange.component.scss'],
})
export class CardsExchangeComponent implements OnInit {
  cards;
  cardsDuplicates;
  users = [
    {
      name: 'Carlos Perez',
      nrOfCards: 8,
    },
    {
      name: 'Carlos Perez',
      nrOfCards: 8,
    },
    {
      name: 'Carlos Perez',
      nrOfCards: 8,
    },
    {
      name: 'Carlos Perez',
      nrOfCards: 8,
    },
    {
      name: 'Carlos Perez',
      nrOfCards: 8,
    },
    {
      name: 'Carlos Perez',
      nrOfCards: 8,
    },
    {
      name: 'Carlos Perez',
      nrOfCards: 8,
    },
    {
      name: 'Carlos Perez',
      nrOfCards: 8,
    },
    {
      name: 'Carlos Perez',
      nrOfCards: 8,
    },
    {
      name: 'Carlos Perez',
      nrOfCards: 8,
    },
    {
      name: 'Carlos Perez',
      nrOfCards: 8,
    },
  ];
  cardsDuplicates$;
  constructor(private router: Router, private dataService: DataService) { }

  ngOnInit() {
    this.dataService.currentArr4.subscribe(cards => {
      this.cardsDuplicates = cards;
      this.cards = this.cardsDuplicates;
    });
    
    // this.cardsDuplicates$.subscribe(arr => console.log('arr:', arr));
  }

  getUsersFromGroupWhichHaveMissingCromos() {}

  playerChoosed(user) {
    this.router.navigateByUrl('exchange-proposal');
    this.dataService.changeObject(user);
  }

  navigateTo() {
    this.router.navigateByUrl('exchange-proposal');
  }
}
