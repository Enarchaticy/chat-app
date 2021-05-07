import { createReducer, on } from '@ngrx/store';
import { addPassword } from './password.actions';

export const passwordReducer = createReducer(
  null,
  on(addPassword, (state, action) => ({
    ...state,
    ...action,
  }))
);
