import { Action, createAction, props } from '@ngrx/store';
import { User } from 'src/app/interfaces/user';

export const SET_DIRECT_MESSAGE = '[Direct Messages] Set Direct Message';

/* export class SetDirectMessage implements Action {
  type = SET_DIRECT_MESSAGE;
  constructor(public payload: User) {}
} */

// eslint-disable-next-line @typescript-eslint/naming-convention
export const setDirectMessage = createAction(SET_DIRECT_MESSAGE, props<User>());

/* export type DirectMessagesActions = SetDirectMessage; */
