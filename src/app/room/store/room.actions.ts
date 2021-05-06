import { Action } from '@ngrx/store';
import { Room } from 'src/app/interfaces/room';

export const SET_DEFAULT = '[Room] Set Default Room';
export const SET_ROOM = '[Room] Set Room';
/* export const CREATE_ROOM = '[Room] Create Room'; */

export class SetDefaultRoom implements Action {
  type = SET_DEFAULT;
  constructor() {}
}

export class SetRoom implements Action {
  type = SET_ROOM;
  constructor(public payload: Room) {}
}

/* export class CreateRoom implements Action {
  type = CREATE_ROOM;
  constructor(public payload: Room) {}
} */
export type RoomActions = SetRoom | SetDefaultRoom /* | CreateRoom */;
