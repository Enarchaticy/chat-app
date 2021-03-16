export interface User {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
  isOnline?: boolean;
}

export const users: User[] = [
  {
    id: '1',
    name: 'adam',
    email: 'adam@valami.com',
    password: '123456',
    isOnline: true,
  },
  {
    id: '2',
    name: 'peti',
    email: 'peti@valami.com',
    password: '456789',
    isOnline: true,
  },
  {
    id: '3',
    name: 'rita',
    email: 'rita@valami.com',
    password: 'qwertz',
    isOnline: false,
  },
  {
    id: '4',
    name: 'rozi',
    email: 'rozi@valami.com',
    password: 'asdfgh',
    isOnline: true,
  },
  {
    id: '5',
    name: 'fodor adam',
    email: 'fodor.adam@gmail.hu',
    isOnline: true,
  },
];
