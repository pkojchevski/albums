export interface Image {
  imageUid: string;
  title: string;
  description: string;
  url: string;
  collection: string;
  imgName: string;
  language: string;
  level: string;
}

export const initialImage = {
  imageUid: '',
  title: '',
  description: '',
  url: '',
  collection: '',
  imgName: '',
  language: '',
  level: '',
};

export const dummyImage = {
  imageUid: '',
  title: '',
  description: '',
  url: '../../assets/img/missing_image.png',
  collection: '',
  imgName: '',
  language: '',
  level: '',
};
