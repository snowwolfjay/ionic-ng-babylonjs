export const USER_COL = 'users';

export enum USER_METHODS {
  update = 'user.update',
}

export enum USER_PUBLISH {
  mineInfo = 'mine.info',
}

export interface User {
  _id?: any;
  role: string;
  username:string;
  profile: {
    name: string;
    avatar: string;
  };
}
