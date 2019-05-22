import {Image} from './image';

export interface Album {
  albumUid?: string;
  collection: string;
  name: string;
  nrOfCards?: number;
  genericQuiz: boolean;
}

export const initialAlbum = {
  name: '',
  collection: '',
  nrOfCards: 0,
  albumUid: '',
  genericQuiz: true,
};
