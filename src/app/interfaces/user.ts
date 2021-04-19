export interface User {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
  isOnline?: boolean;
  identifier?: string[];
}

export const MOCK_AUTH_USER = {
  uid: 'asdasdasd',
  displayName: 'asd',
  email: 'asd@asd.asd',
};

export const MOCK_OTHER_USER = {
  uid: 'qqq',
  name: 'qqq',
  email: 'qqq@qqq.qqq',
};

export const setStorageUser = () => {
  localStorage.setItem('user', JSON.stringify(MOCK_AUTH_USER));
};
