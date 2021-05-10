import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { first, map, mergeMap, tap } from 'rxjs/operators';
import { Visibility } from 'src/app/interfaces/room';
import { RoomService } from 'src/app/services/room.service';
import { SET_ROOM, AUTHORIZE_ROOM } from './room.actions';
@Injectable()
export class RoomEffects {
  authorizeRoom$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AUTHORIZE_ROOM),
        mergeMap((action: any) =>
          this.roomService
            .getRoom(action.visibility, action.queryId, action.password)
            .pipe(
              first(),
              tap((res) => {
                if(res) {
                  console.log({ ...res, isAuthorized: true });
                }
              }),
              map((res) => {
                if (!res) {
                  /* console.log('asdasd'); */
                  return null;
                } else {
                  /* console.log({ ...res, isAuthorized: true }); */
                  return { ...res, isAuthorized: true };
                }
              })
            )
        )
      ),
    { dispatch: false }
  );

  setRoom$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SET_ROOM),
      mergeMap((action: any) => {
        if (action.visibility === Visibility.protected) {
          return of({ ...action, type: AUTHORIZE_ROOM, isAuthorized: false });
        } else {
          return of({ ...action, type: AUTHORIZE_ROOM });
        }
      })
    )
  );

  constructor(private roomService: RoomService, private actions$: Actions) {}
}
