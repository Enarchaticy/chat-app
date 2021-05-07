import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { first, map, mergeMap } from 'rxjs/operators';
import { Room, Visibility } from 'src/app/interfaces/room';
import { RoomService } from 'src/app/services/room.service';
import { ADD_PASSWORD } from './password.actions';
import { SET_DEFAULT, SET_ROOM } from './room.actions';

// todo: megoldani, hogy SET_ROOM esetén ne ezt hívja meg mégegyszer
@Injectable()
export class PasswordEffect {
  addPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ADD_PASSWORD),
      mergeMap((action: any) => {
        console.log(Visibility.protected, action.id, action.password);
        return this.roomService
          .getRoom(Visibility.protected, action.id, action.password)
          .pipe(
            first(),
            map((res: Room) => {
              if (res) {
                return { type: SET_ROOM, ...res };
              } else {
                return { type: SET_DEFAULT };
              }
            })
          );
      })
    )
  );

  constructor(private actions$: Actions, private roomService: RoomService) {}
}
