import * as firebase from 'firebase/app';
import 'firebase/firestore';

export interface Album {
  albumUid?: string;
  collection: string;
  name: string;
  nrOfCards?: number;
  genericQuiz: boolean;
  coverPageUrl?: string;
  createdAt: firebase.firestore.FieldValue;
}

export const initialAlbum = {
  name: '',
  collection: '',
  nrOfCards: 0,
  albumUid: '',
  genericQuiz: true,
  coverPageUrl: '',
  createdAt: firebase.firestore.FieldValue.serverTimestamp()
};
