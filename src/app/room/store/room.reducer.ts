import { Room, Visibility } from 'src/app/interfaces/room';
import {
  /* CREATE_ROOM, */
  RoomActions,
  SET_DEFAULT,
  SET_ROOM,
} from './room.actions';

const defaultState: Room = { id: 'me', visibility: Visibility.public };

export const roomReducer = (state = defaultState, action: any) => {
  switch (action.type) {
    case SET_DEFAULT:
      return { ...state, ...defaultState };
    case SET_ROOM:
      return { ...state, ...action.payload, id: action.payload.queryId };
    /* case CREATE_ROOM:
      return { ...action.payload }; */
    /* ...state kimarad mert ha csinálunk egy private roomot és utána egy publicot, akkor a publicnak is lesz memberje */
    default:
      return state;
  }
};
