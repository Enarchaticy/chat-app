import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Visibility } from 'src/app/interfaces/room';
import { RoomService } from 'src/app/services/room.service';
import { ADD_PASSWORD } from './password.actions';
import { AUTHORIZE_ROOM, SET_ROOM } from './room.actions';

// todo: megoldani, hogy SET_ROOM esetén ne ezt hívja meg mégegyszer
@Injectable()
export class PasswordEffect {
  addPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ADD_PASSWORD),
      mergeMap((action: any) =>
         of({
          ...action,
          visibility: Visibility.protected,
          queryId: action.id,
          type: AUTHORIZE_ROOM,
        }) /* this.roomService
          .getRoom(Visibility.protected, action.id, action.password)
          .pipe(
            first(),
            map((res: Room) => {
              if (res) {
                return { ...res, type: SET_ROOM, isAuthorized: true };
              } else {
                return { type: SET_DEFAULT };
              }
            })
          ); */
      )
    )
  );

  constructor(private actions$: Actions, private roomService: RoomService) {}
}
