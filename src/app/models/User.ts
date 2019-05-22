export interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  role?: string;
  first_name: string;
  last_name: string;
  mail_verified: boolean;
  question_time?: Date;
  albums?: {
    one: { uid: string; createdAt: string };
    two: { uid: string; createdAt: string };
    three: { uid: string; createdAt: string };
  };
  duplicates?: {
    album_uid: {
      card_uid: string;
      duplicate: number;
    }
  };
  questionsTimeFirstAlbum?: number;
  questionsTimeSecondAlbum?: number;
  questionsTimeThirdAlbum?: number;
}
