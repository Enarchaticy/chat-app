import { MOCK_AUTH_USER, MOCK_OTHER_USER, User } from './user';
import { Message } from './message';

export enum Visibility {
  private = 'private',
  protected = 'protected',
  public = 'public',
}

export interface Room {
  id?: string;
  queryId?: string;
  name?: string;
  visibility?: Visibility;
  password?: string;
  members?: User[];
  memberIds?: string[];
  messages?: Message[];
  memberNumber?: number;
}

export const MOCK_PUBLIC_ROOM: Room = {
  id: '101',
  name: 'asdasd',
  visibility: Visibility.public,
  queryId: '101',
};

export const MOCK_PROTECTED_ROOM: Room = {
  id: '102',
  name: 'qweqwe',
  visibility: Visibility.protected,
  password: 'qweqwe',
  queryId: '102',
};

export const MOCK_PRIVATE_ROOM: Room = {
  id: '103',
  name: 'yxcyxc',
  visibility: Visibility.private,
  queryId: '103',
  members: [
    MOCK_AUTH_USER,
    MOCK_OTHER_USER,
    { id: 'yxc', name: 'yxc', email: 'yxc@yxc.yxc' },
  ],
};
