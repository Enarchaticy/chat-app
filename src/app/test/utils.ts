import { Room, Visibility } from '../interfaces/room';
import { mockStorage } from './mock-storage';

export const MOCK_AUTH_USER = {
  uid: 'authUserId',
  displayName: 'authUser',
  email: 'auth@user.com',
};

export const MOCK_OTHER_USER = {
  uid: 'otherUserId',
  name: 'otherUser',
  email: 'other@user.com',
  identifier: ['someId', 'other@user.com'],
};

export const setStorageUser = () => {
  mockStorage.setItem('user', JSON.stringify(MOCK_AUTH_USER));
};

export const MOCK_MESSAGES = [
  {
    timestamp: '2020-10-05',
    messages: [
      {
        text: 'First message',
        date: '2020-10-05T14:48:00.000Z',
        author: MOCK_AUTH_USER,
        timestamp: '2020-10-05',
      },
      {
        text: 'Second message',
        date: '2020-10-05T14:49:00.000Z',
        author: MOCK_OTHER_USER,
        timestamp: '2020-10-05',
      },
    ],
  },
  {
    timestamp: '2020-10-07',
    messages: [
      {
        text: 'Message on a different day',
        date: '2020-10-07T14:49:00.000Z',
        author: MOCK_AUTH_USER,
        timestamp: '2020-10-07',
      },
    ],
  },
];

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
    {
      text: 'Message on a different day',
      date: '2020-10-07T14:49:00.000Z',
      author: MOCK_AUTH_USER,
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
  messages: [],
};

export const MOCK_DIRECT_MESSAGES = {
  visibility: Visibility.private,
  memberIds: ['someIdauthUserId', 'authUserIdsomeId', 'someId', 'authUserId'],
  members: [
    {
      uid: 'otherUserId',
      name: 'otherUser',
      email: 'other@user.com',
      identifier: ['someId', 'other@user.com'],
    },
    { id: 'authUserId', name: 'authUser' },
  ],
  memberNumber: 2,
};
