import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { NguCarouselConfig } from '@ngu/carousel';
import { DataService } from 'src/app/services/data/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements OnInit {
  @Input() cardsDuplicates;
  cards;
  lSlider = 0;
  hSlider = 6;
  arrLength = 0;

  config: SwiperOptions = {
    // autoplay: 3000, // Autoplay option having value in milliseconds
    initialSlide: 0, // Slide Index Starting from 0
    slidesPerView: 6, // Slides Visible in Single View Default is 1
    pagination: '.swiper-pagination', // Pagination Class defined
    paginationClickable: true, // Making pagination dots clicable
    nextButton: '.swiper-button-next', // Class for next button
    prevButton: '.swiper-button-prev', // Class for prev button
    spaceBetween: 20 // Space between each Item
  };

  constructor(private dataService: DataService, private router: Router) {

  }



  ngOnInit() {

  }



  // next() {
  //   this.hSlider++;
  //   this.lSlider++;
  //   if (this.hSlider > this.arrLength)
  //     return;

  //   this.cards = this.cardsDuplicates.slice(this.lSlider, this.hSlider);
  // }

  // prev() {
  //   this.hSlider--;
  //   this.lSlider--;

  //   if (this.lSlider < 0) return;

  //   this.cards = this.cardsDuplicates.slice(this.lSlider, this.hSlider);
  // }

  cardsChoosed(card) {
    this.dataService.changeAlbumCards(card);
    this.router.navigateByUrl('choose-exchange-player');
  }
}
