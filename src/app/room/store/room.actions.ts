import { createAction, props } from '@ngrx/store';
import { Room } from 'src/app/interfaces/room';

export const SET_DEFAULT = '[Room] Set Default Room';
export const SET_ROOM = '[Room] Set Room';

/* export const CREATE_ROOM = '[Room] Create Room'; */

export const setDefaultRoom = createAction(SET_DEFAULT);
export const setRoom = createAction(SET_ROOM, props<Room>());

/* export class CreateRoom implements Action {
  type = CREATE_ROOM;
  constructor(public payload: Room) {}
} */
