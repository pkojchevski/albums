import {Injectable} from '@angular/core';
import {Group} from '../models/group';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  constructor() {}

  getRndNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  getRandom(arr, n) {
    const result = new Array(n);
    let len = arr.length;
    const taken = new Array(len);
    while (n--) {
      const x = Math.floor(Math.random() * len);
      result[n] = arr[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
  }

  shuffle(array) {
    let currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  getDuplicates(arr) {
    const fArr = [];
    // tslint:disable-next-line:forinSSS
    for (const el of arr) {
      if (el['quantity'] > 1) {
        for (let i = 0; i <= el['quantity'] - 1; i++) {
          fArr.push(el);
        }
      }
    }
    return fArr;
  }
}
