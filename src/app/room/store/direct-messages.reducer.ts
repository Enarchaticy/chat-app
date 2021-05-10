import { createReducer, on } from '@ngrx/store';
import {
  createDirectMessage,
  setDirectMessage,
} from './direct-messages.actions';

export const directMessagesReducer = createReducer(
  null,
  on(setDirectMessage, (state, action) => ({
    ...state,
    ...action,
  })),
  on(createDirectMessage, (state, action) => ({ ...state, ...action }))
);
