import { createReducer, on } from '@ngrx/store';
import { User } from 'src/app/interfaces/user';
import { setDirectMessage } from './direct-messages.actions';

export const directMessagesReducer = (state: User, action: any) => {
  switch (action.type) {
    case setDirectMessage.type:
      return { ...state, ...action };
    default:
      return state;
  }
};

/* export const directMessagesReducer = createReducer(null,
  on(
    setDirectMessage,
  )) */
