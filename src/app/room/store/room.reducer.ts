import { createReducer, on } from '@ngrx/store';
import { Room, Visibility } from 'src/app/interfaces/room';
import { setDefaultRoom, setRoom } from './room.actions';

const defaultState: Room = { id: 'me', visibility: Visibility.public };

export const roomReducer = createReducer(
  defaultState,
  on(setDefaultRoom, (state, action) => ({
    ...state,
    ...defaultState,
  })),
  on(setRoom, (state, action) => ({
    ...state,
    ...action,
    id: action.queryId,
  }))
);

/*   case CREATE_ROOM:
      return { ...action.payload };
    ...state kimarad mert ha csinálunk egy private roomot és utána egy publicot, akkor a publicnak is lesz memberje
 */
