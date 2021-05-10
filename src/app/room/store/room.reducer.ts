import { createReducer, on } from '@ngrx/store';
import { Room, Visibility } from 'src/app/interfaces/room';
import { setDefaultRoom, authorizeRoom, setRoom } from './room.actions';

const defaultState: Room = { id: 'me', visibility: Visibility.public };

export const roomReducer = createReducer(
  defaultState,
  on(setDefaultRoom, (state, action) => ({
    ...state,
    ...defaultState,
  })),
  on(authorizeRoom, (state, action) => ({
    ...state,
    ...action,
    id: action.queryId /* TODO ezt megnézni elrontja-e */,
  })),
  on(setRoom, (state, action) => ({
    ...state,
    ...action,
    isAuthorized: true,
  }))
);

/*   case CREATE_ROOM:
      return { ...action.payload };
    ...state kimarad mert ha csinálunk egy private roomot és utána egy publicot, akkor a publicnak is lesz memberje
 */
