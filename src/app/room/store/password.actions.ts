import { Action } from '@ngrx/store';

export const ADD_PASSWORD = '[Password] Add Password';

export class AddPassword implements Action {
  type = ADD_PASSWORD;
  constructor(public payload: string) {}
}

export type PasswordActions = AddPassword;

/* import { createAction, props } from '@ngrx/store';

export const addPassword = createAction(
  '[Password] Add Password',
  props<{ password: string }>()
);
 */
