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
    email: 'asd@gmail.com',
    password: '123456',
    isOnline: true,
  },
  {
    id: '2',
    name: 'peti',
    email: 'peti@gmail.com',
    password: '456789',
    isOnline: true,
  },
  {
    id: '3',
    name: 'rita',
    email: 'rita@gmail.com',
    password: 'qwertz',
    isOnline: false,
  },
  {
    id: '4',
    name: 'rozi',
    email: 'rozi@gmail.com',
    password: 'asdfgh',
    isOnline: true,
  },
];
