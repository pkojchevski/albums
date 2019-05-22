import {Image, initialImage} from './image';

export interface AlbumCards {
  albumcardUid: string;
  albumUid: string;
  nrOfCard: number;
  image: Image;
}

export const InitialAlbumCard = {
  albumcardUid: '',
  albumUid: '',
  nrOfCard: 0,
  image: initialImage,
};
