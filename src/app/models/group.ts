export interface Group {
  userUid: string;
  name: string;
  users: User[];
  description: string;
  label: string;
  dateStart: Date;
  type: string;
  groupUid: string;
}

export interface User {
  user_email: string;
  user_status: string;
}

export const InitialGroup = {
  userUid: '',
  name: '',
  label: 'assets/img/group-label_cup.svg',
  description: '',
  dateStart: new Date(),
  type: '',
  users: [],
  groupUid: '',
};
