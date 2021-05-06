import { passwordReducer } from './password.reducer';
import { directMessagesReducer } from './direct-messages.reducer';
import { User } from 'src/app/interfaces/user';
import { ActionReducerMap } from '@ngrx/store';
import { roomReducer } from './room.reducer';
import { Room } from 'src/app/interfaces/room';

export interface AppState {
  password: string;
  directMessages: User;
  room: Room;
}

export const appReducerMap: ActionReducerMap<AppState> = {
  password: passwordReducer,
  directMessages: directMessagesReducer,
  room: roomReducer,
};
