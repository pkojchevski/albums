import {Image, initialImage} from './image';

export interface UsersAlbums {
  userUid: string;
  albumUid: string;
  cards: Array<Cards>;
  nrOfAlbumForUser: number;
  uid: string;
}

export interface Cards {
  nrOfCard: number;
  received: boolean;
  added: boolean;
  quantity: number;
  image: Image;
  question: string;
  answer: string;
}

export const InitialCard = {
  nrOfCard: 0,
  received: false,
  added: false,
  quantity: 0,
  image: initialImage,
  question: null,
  answer: null,
};
