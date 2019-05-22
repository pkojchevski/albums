export const COLLECTIONS = [
  'deporte',
  'arte',
  'matemática',
  'biología',
  'química',
  'historia',
  'idiomas',
  'geografía',
];

export interface Collection {
  collection: string;
  collectionUid: string;
}

export const InitialCollection = {
  collection: '',
  collectionUid: '',
};
