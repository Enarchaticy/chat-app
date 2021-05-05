import { User } from 'src/app/interfaces/user';
import {
  DirectMessagesActions,
  SET_DIRECT_MESSAGE,
} from './direct-messages.actions';

export const directMessagesReducer = (
  state: User = null,
  action: DirectMessagesActions
) => {
  switch (action.type) {
    case SET_DIRECT_MESSAGE:
      return { ...state, ...action.payload };
    default:
      return {};
  }
};
