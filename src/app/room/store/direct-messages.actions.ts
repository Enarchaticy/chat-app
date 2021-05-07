import { createAction, props } from '@ngrx/store';
import { User } from 'src/app/interfaces/user';

export const SET_DIRECT_MESSAGE = '[Direct Messages] Set Direct Message';
/* export const CREATE_DIRECT_MESSAGE = '[Direct Messages] Create Direct Messages';
 */
export const setDirectMessage = createAction(SET_DIRECT_MESSAGE, props<User>());
/* export const createDirectMessage = createAction(CREATE_DIRECT_MESSAGE, props<User>());
 */

