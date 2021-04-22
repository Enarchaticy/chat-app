import { Room, Visibility } from '../interfaces/room';

export const MOCK_AUTH_USER = {
  uid: 'authUserId',
  displayName: 'authUser',
  email: 'auth@user.com',
};

export const MOCK_OTHER_USER = {
  uid: 'otherUserId',
  name: 'otherUser',
  email: 'other@user.com',
};

export const setStorageUser = () => {
  localStorage.setItem('user', JSON.stringify(MOCK_AUTH_USER));
};

export const MOCK_PUBLIC_ROOM: Room = {
  id: '101',
  name: 'publicRoom',
  visibility: Visibility.public,
  queryId: '101',
  messages: [
    {
      text: 'First message',
      date: '2020-10-05T14:48:00.000Z',
      author: MOCK_AUTH_USER,
    },
    {
      text: 'Second message',
      date: '2020-10-05T14:49:00.000Z',
      author: MOCK_OTHER_USER,
    },
  ],
};

export const MOCK_PROTECTED_ROOM: Room = {
  id: '102',
  name: 'protectedRoom',
  visibility: Visibility.protected,
  password: 'password',
  queryId: '102',
};

export const MOCK_PRIVATE_ROOM: Room = {
  id: '103',
  name: 'privateRoom',
  visibility: Visibility.private,
  queryId: '103',
  members: [
    MOCK_AUTH_USER,
    MOCK_OTHER_USER,
    { id: 'thirdUserId', name: 'thirdUser', email: 'third@user.com' },
  ],
};
