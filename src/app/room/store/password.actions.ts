import { createAction, props } from '@ngrx/store';

export const ADD_PASSWORD = '[Password] Add Password';

export const addPassword = createAction(
  ADD_PASSWORD,
  props<{ password: string }>()
);
