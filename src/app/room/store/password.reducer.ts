import { ADD_PASSWORD, PasswordActions } from './password.actions';

export const passwordReducer = (state: string, action: PasswordActions) => {
  switch (action.type) {
    case ADD_PASSWORD:
      return action.payload;
    default:
      return undefined;
  }
};

/* import { createReducer } from '@ngrx/store';

export const passwordReducer = createReducer(initialState) */
