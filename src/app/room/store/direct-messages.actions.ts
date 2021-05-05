import { Action } from '@ngrx/store';
import { User } from 'src/app/interfaces/user';

export const SET_DIRECT_MESSAGE = '[Direct Messages] Set Direct Message';

export class SetDirectMessage implements Action {
  type = SET_DIRECT_MESSAGE;
  constructor(public payload: User) {}
}

export type DirectMessagesActions = SetDirectMessage;
